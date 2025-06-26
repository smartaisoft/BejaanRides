import React, { useEffect } from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/RootNavigator';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const App = () => {
  console.log('Firebase initialized?', firebase.apps.length > 0);

useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged(user => {
    console.log('👤 Auth state restored:', user?.uid);
  });
  return unsubscribe;
}, []);
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
