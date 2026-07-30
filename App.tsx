import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, TamaguiProvider, Theme, XStack, YStack, Text } from 'tamagui';
import config from './tamagui.config';
import { useWeaveStore } from './src/state/store';
import { ListScreen } from './src/screens/ListScreen';
import { CanvasScreen } from './src/screens/CanvasScreen';
import { SaveOverlay } from './src/screens/SaveOverlay';
import { DetailOverlay } from './src/screens/DetailOverlay';
import { ExportOverlay } from './src/screens/ExportOverlay';

function TopBar({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const view = useWeaveStore((s) => s.view);
  const setView = useWeaveStore((s) => s.setView);

  return (
    <XStack ai="center" jc="space-between" px="$5" py="$4" borderBottomWidth={1} borderColor="$borderColor" bg="$surface">
      <Text fontFamily="$heading" fontSize={34} fontWeight="800" color="$color">weave</Text>
      <XStack ai="center" gap="$3">
        <XStack bg="$backgroundSunken" br="$5" p="$1" gap="$1">
          <Button unstyled px="$4" py="$2" br="$5" bg={view === 'list' ? '$surface' : 'transparent'} onPress={() => setView('list')}>
            <Text color="$color" fontWeight="700" fontSize={13}>List</Text>
          </Button>
          <Button unstyled px="$4" py="$2" br="$5" bg={view === 'canvas' ? '$surface' : 'transparent'} onPress={() => setView('canvas')}>
            <Text color="$color" fontWeight="700" fontSize={13}>Canvas</Text>
          </Button>
        </XStack>
        <Button unstyled onPress={onToggleTheme} width={36} height={36} br="$5" bg="$backgroundSunken" ai="center" jc="center">
          <Text fontSize={15}>{theme === 'dark' ? '☾' : '☀'}</Text>
        </Button>
      </XStack>
    </XStack>
  );
}

function WeaveApp({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const view = useWeaveStore((s) => s.view);
  const overlay = useWeaveStore((s) => s.overlay);

  return (
    <YStack flex={1} bg="$background">
      <TopBar theme={theme} onToggleTheme={onToggleTheme} />
      {view === 'list' ? <ListScreen /> : <CanvasScreen />}
      {overlay === 'save' && <SaveOverlay />}
      {overlay === 'detail' && <DetailOverlay />}
      {overlay === 'export' && <ExportOverlay />}
    </YStack>
  );
}

export default function App() {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);
  const theme = override ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const toggleTheme = () => setOverride(theme === 'dark' ? 'light' : 'dark');

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={theme}>
        <WeaveApp theme={theme} onToggleTheme={toggleTheme} />
      </Theme>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </TamaguiProvider>
  );
}
