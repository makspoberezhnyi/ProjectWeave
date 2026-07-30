import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Local, on-device reminders only — no server, no API keys. Best-effort on
// web (background firing isn't realistic in a browser tab); the reminder
// time itself is still stored and shown regardless of whether the OS-level
// notification could be scheduled.

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (err) {
    console.warn('Notification permission request failed', err);
    return false;
  }
}

export async function scheduleReminder(id: string, title: string, whenMs: number): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // nothing was scheduled yet — fine
  }
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: { title: 'Weave reminder', body: title },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: whenMs,
      },
    });
  } catch (err) {
    console.warn(`Could not schedule OS notification${Platform.OS === 'web' ? ' (expected on web)' : ''}`, err);
  }
}

export async function cancelReminder(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (err) {
    console.warn('Could not cancel notification', err);
  }
}
