import { useEffect, useRef, useState } from 'react';
import { loadNotifications } from '../utils/notificationEnvironment';
import { registerForPushNotifications, scheduleLocalNotification } from '../utils/notifications';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let isMounted = true;

    registerForPushNotifications()
      .then((token) => {
        if (isMounted && token) {
          setExpoPushToken(token);
          console.log('[useNotifications] Push Token:', token);
        }
      })
      .catch((err) => {
        console.warn('[useNotifications] Push token tidak aktif:', err);
      });

    async function setupListeners() {
      const Notifications = await loadNotifications([
        'addNotificationReceivedListener',
        'addNotificationResponseReceivedListener',
      ]);
      if (!isMounted || !Notifications) {
        if (isMounted) setAvailable(false);
        return;
      }

      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notif) => {
          setNotification(notif);
          console.log('[useNotifications] Notifikasi diterima:', notif);
        }
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log('[useNotifications] Response tap notifikasi:', response);
        }
      );
    }

    setupListeners().catch((err) => {
      if (isMounted) setAvailable(false);
      console.warn('[useNotifications] Listener notifikasi tidak aktif:', err);
    });

    return () => {
      isMounted = false;
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, []);

  const sendTestNotification = async (
    senderName = 'Andi Pratama',
    message = 'Hei! Bagaimana kabarmu?',
    delaySeconds = 3
  ) => {
    try {
      setLoading(true);

      const scheduled = await scheduleLocalNotification({
        title: `Pesan dari ${senderName}`,
        body: message,
        data: { type: 'chat', sender: senderName },
        delaySeconds,
      });

      if (scheduled) {
        console.log(`[useNotifications] Notif dijadwalkan dalam ${delaySeconds} detik.`);
      }

      return scheduled;
    } catch (error) {
      console.error('[useNotifications] Gagal kirim notifikasi:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { expoPushToken, notification, loading, available, sendTestNotification };
}
