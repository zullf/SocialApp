import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import BottomTabs from './src/navigation/BottomTabs';
import { loadNotifications } from './src/utils/notificationEnvironment';

const linking = {
  prefixes: [Linking.createURL('/'), 'socialapp://'],
  config: {
    screens: {
      Home: 'home',
      Camera: 'camera',
      Map: 'map',
      Profile: 'profile',
    },
  },
};

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let isMounted = true;

    async function configureNotifications() {
      const Notifications = await loadNotifications([
        'setNotificationHandler',
        'addNotificationReceivedListener',
        'addNotificationResponseReceivedListener',
      ]);
      if (!isMounted || !Notifications) return;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log('[App] Notifikasi diterima:', notification);
        }
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log('[App] User tap notifikasi:', response);
        }
      );
    }

    configureNotifications().catch((error) => {
      console.warn('[App] Notifikasi tidak aktif:', error);
    });

    const handleDeepLink = ({ url }) => {
      console.log('[DeepLink] App dibuka dari URL:', url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('[DeepLink] Initial URL:', url);
      }
    });

    return () => {
      isMounted = false;
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer linking={linking}>
        <StatusBar style="light" />
        <BottomTabs />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
