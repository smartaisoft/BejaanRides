import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store, {persistor} from './src/redux/store';
import AppNavigator from './src/navigation/RootNavigator';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import FirebaseService from './src/services/NotificationService';
import ReferralListener from './src/services/ReferralListener';
import {PersistGate} from 'redux-persist/integration/react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  console.log('✅ Firebase initialized?', firebase.apps.length > 0);

  useEffect(() => {
    FirebaseService.requestUserPermission();

    // Listen to auth state
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        console.log('👤 Auth state restored:', user.uid);
      } else {
        console.log('👤 No authenticated user.');
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ReferralListener />
            <AppNavigator />
          </PersistGate>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
