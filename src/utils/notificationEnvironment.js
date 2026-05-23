import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function isExpoGoAndroid() {
  return Platform.OS === 'android' && Constants.expoGoConfig != null;
}

export function hasNotificationMethods(Notifications, methodNames = []) {
  return methodNames.every((methodName) => typeof Notifications?.[methodName] === 'function');
}

export async function loadNotifications(requiredMethods = []) {
  try {
    const module = await import('expo-notifications');
    const Notifications = module?.default ?? module;

    if (!hasNotificationMethods(Notifications, requiredMethods)) {
      return null;
    }

    return Notifications;
  } catch {
    return null;
  }
}
