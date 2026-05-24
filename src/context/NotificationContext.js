import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';

const NotificationContext = createContext(null);

const NOTIFICATION_CHANNEL_ID = 'socialapp-chat';

let notificationsModule = null;
let notificationHandlerReady = false;

function isExpoGoAndroid() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

async function loadNotificationsModule() {
  if (isExpoGoAndroid()) return null;
  if (notificationsModule) return notificationsModule;

  notificationsModule = await import('expo-notifications');

  if (!notificationHandlerReady) {
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    notificationHandlerReady = true;
  }

  return notificationsModule;
}

export function NotificationProvider({ children }) {
  const [notificationStatus, setNotificationStatus] = useState('checking');

  useEffect(() => {
    async function prepareNotifications() {
      try {
        const Notifications = await loadNotificationsModule();
        if (!Notifications) {
          setNotificationStatus('unavailable');
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
            name: 'SocialApp Chat',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#6C63FF',
          });
        }

        const existingPermission = await Notifications.getPermissionsAsync();
        setNotificationStatus(existingPermission.status);
      } catch (error) {
        console.error('[NotificationProvider] Gagal menyiapkan local notification:', error);
        setNotificationStatus('error');
      }
    }

    prepareNotifications();
  }, []);

  const sendTestNotification = useCallback(() => {
    async function scheduleLocalNotification() {
      try {
        const Notifications = await loadNotificationsModule();
        if (!Notifications) {
          Alert.alert(
            'Expo Go Android',
            'Expo Go Android SDK 53+ tidak memuat expo-notifications. Jalankan dengan development build untuk mengetes local notification native.'
          );
          return;
        }

        let currentStatus = notificationStatus;

        if (currentStatus !== 'granted') {
          const requestedPermission = await Notifications.requestPermissionsAsync();
          currentStatus = requestedPermission.status;
          setNotificationStatus(currentStatus);
        }

        if (currentStatus !== 'granted') {
          Alert.alert(
            'Izin Notifikasi Ditolak',
            'Aktifkan izin notifikasi agar SocialApp bisa menampilkan simulasi chat masuk.'
          );
          return;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Chat masuk',
            body: 'Raka mengirim pesan baru: "Halo, lagi online?"',
            data: { type: 'chat', conversationId: 'demo-chat' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 3,
            channelId: NOTIFICATION_CHANNEL_ID,
          },
        });

        Alert.alert('Terjadwal', 'Local notification akan muncul dalam 3 detik.');
      } catch (error) {
        console.error('[NotificationProvider] Gagal menjadwalkan notif:', error);
        Alert.alert('Gagal', 'Tidak bisa menjadwalkan local notification.');
      }
    }

    scheduleLocalNotification();
  }, [notificationStatus]);

  return (
    <NotificationContext.Provider value={{ notificationStatus, sendTestNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }
  return context;
}
