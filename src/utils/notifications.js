import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { hasNotificationMethods, isExpoGoAndroid, loadNotifications } from './notificationEnvironment';
import { requestNotificationPermission } from './permissions';

async function configureAndroidChannels(Notifications) {
  if (Platform.OS !== 'android') return;
  if (!hasNotificationMethods(Notifications, ['setNotificationChannelAsync'])) return;
  if (!Notifications.AndroidImportance) return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'SocialApp Notifications',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6C63FF',
    sound: true,
  });

  await Notifications.setNotificationChannelAsync('chat', {
    name: 'Pesan Chat',
    description: 'Notifikasi pesan masuk dari pengguna lain',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 100, 200, 100],
    lightColor: '#FF6584',
    sound: true,
  });
}

export async function registerForPushNotifications() {
  const Notifications = await loadNotifications();
  if (!Notifications) return null;

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  await configureAndroidChannels(Notifications);

  if (isExpoGoAndroid()) {
    console.log('[Notifications] Local notification aktif. Push remote perlu development build di Expo Go Android.');
    return null;
  }

  if (!Device.isDevice) {
    console.warn('[Notifications] Push notification tidak berfungsi di simulator.');
  }

  if (!hasNotificationMethods(Notifications, ['getExpoPushTokenAsync'])) {
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (error) {
    console.error('[Notifications] Gagal mendapatkan push token:', error);
    return null;
  }
}

export async function scheduleLocalNotification({
  title = 'SocialApp',
  body = 'Anda memiliki notifikasi baru',
  data = {},
  delaySeconds = 3,
}) {
  try {
    const Notifications = await loadNotifications(['scheduleNotificationAsync']);
    if (!Notifications) return false;

    const granted = await requestNotificationPermission();
    if (!granted) return false;

    await configureAndroidChannels(Notifications);

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL ?? 'timeInterval',
        seconds: delaySeconds,
        channelId: 'chat',
      },
    });
    return true;
  } catch (error) {
    console.warn('[Notifications] Local notification tidak tersedia di runtime ini:', error?.message ?? error);
    return false;
  }
}

export async function cancelAllNotifications() {
  try {
    const Notifications = await loadNotifications(['cancelAllScheduledNotificationsAsync']);
    if (!Notifications) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] Semua notifikasi dibatalkan.');
  } catch (error) {
    console.error('[Notifications] Gagal membatalkan notifikasi:', error);
  }
}
