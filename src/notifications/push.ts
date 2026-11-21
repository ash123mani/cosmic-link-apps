import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/src/api/client';
import { queryClient, queryKeys } from '@/src/data/queryClient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getProjectId(): string | undefined {
  const easProjectId = (Constants.easConfig as { projectId?: string } | undefined)?.projectId;
  const extraProjectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;
  return easProjectId ?? extraProjectId;
}

export async function registerPushNotifications() {
  try {
    if (Platform.OS === 'web') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const permissions = await Notifications.getPermissionsAsync();
    let status = permissions.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') return;

    const projectId = getProjectId();
    const tokenData = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    if (!token) return;

    await api('/api/v1/users/push-token', {
      method: 'POST',
      auth: true,
      body: { type: 'expo', token, platform: Platform.OS },
    });
  } catch {
    // Push registration is best-effort.
  }
}

export function addPushListeners() {
  const received = Notifications.addNotificationReceivedListener(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.sharesInbox });
    void queryClient.invalidateQueries({ queryKey: queryKeys.sharesUnseenCount });
  });

  const response = Notifications.addNotificationResponseReceivedListener(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.sharesInbox });
    void queryClient.invalidateQueries({ queryKey: queryKeys.sharesUnseenCount });
    router.push('/(tabs)/shared' as never);
  });

  return () => {
    received.remove();
    response.remove();
  };
}
