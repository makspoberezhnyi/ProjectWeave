import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { env } from './env';

WebBrowser.maybeCompleteAuthSession();

// Authorization Code + PKCE — no client secret ever touches this app.
// Search-only access to Spotify's public catalog needs no user scopes.
const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};
const SCOPES: string[] = [];
const STORAGE_KEY = 'weave-spotify-tokens';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let cached: StoredTokens | null = null;

export function isSpotifyConfigured() {
  return !!env.spotifyClientId;
}

async function loadTokens(): Promise<StoredTokens | null> {
  if (cached) return cached;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    cached = JSON.parse(raw);
    return cached;
  } catch {
    return null;
  }
}

async function saveTokens(tokens: StoredTokens) {
  cached = tokens;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export async function clearSpotifyAuth() {
  cached = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function isSpotifyConnected(): Promise<boolean> {
  return (await loadTokens()) !== null;
}

async function refreshTokens(refreshToken: string): Promise<StoredTokens | null> {
  if (!env.spotifyClientId) return null;
  try {
    const res = await fetch(DISCOVERY.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: env.spotifyClientId,
      }).toString(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tokens: StoredTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    await saveTokens(tokens);
    return tokens;
  } catch {
    return null;
  }
}

// Returns a usable access token, refreshing silently if expired, or null
// if the user has never connected (or refresh itself failed).
export async function getSpotifyAccessToken(): Promise<string | null> {
  const tokens = await loadTokens();
  if (!tokens) return null;
  if (tokens.expiresAt - 30_000 > Date.now()) return tokens.accessToken;
  const refreshed = await refreshTokens(tokens.refreshToken);
  return refreshed?.accessToken ?? null;
}

export async function exchangeSpotifyCode(code: string, codeVerifier: string, redirectUri: string) {
  const res = await fetch(DISCOVERY.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: env.spotifyClientId,
      code_verifier: codeVerifier,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Spotify token exchange failed: ${res.status}`);
  const data = await res.json();
  const tokens: StoredTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  await saveTokens(tokens);
  return tokens;
}

// Hook — call unconditionally at the top of a component. `promptAsync()`
// opens the Spotify login screen; watch `response` for the result.
export function useSpotifyAuthRequest() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'weave' });
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: env.spotifyClientId,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri,
    },
    DISCOVERY
  );
  return { request, response, promptAsync, redirectUri };
}
