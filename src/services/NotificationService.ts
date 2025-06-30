import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = 'fcmToken';

class FirebaseService {
  // Request permission and get/store FCM token
  static async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await this.getAndStoreFCMToken();
    } else {
      console.warn('Push notification permission denied');
    }
  }

  static async getAndStoreFCMToken() {
    let fcmToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (!fcmToken) {
      try {
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
          console.log('New FCM token saved🥶🥶🥶🥶:', fcmToken);
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    } else {
      console.log('FCM token retrieved from storage😈😈:', fcmToken);
    }
    return fcmToken;
  }

  static async deleteFCMToken() {
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    await messaging().deleteToken();
  }
}

export default FirebaseService;
