import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import BottomTabs from './src/navigation/BottomTabs';
import { NotificationProvider } from './src/context/NotificationContext';

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
  useEffect(() => {
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
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NotificationProvider>
          <NavigationContainer linking={linking}>
            <StatusBar style="dark" />
            <BottomTabs />
          </NavigationContainer>
        </NotificationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
