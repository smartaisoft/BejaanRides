import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/RootNavigator';
import firebase from '@react-native-firebase/app';

const App = () => {
  console.log('Firebase initialized?', firebase.apps.length > 0);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
