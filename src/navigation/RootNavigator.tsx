import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

import PassengerStack from './PassengerStack';
import DriverStack from './DriverStack';
import AuthStack from './AuthNavigator';

const RootNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);

  // Conditional stack selection
  if (!isLoggedIn) return <AuthStack />;
  if (role === 'passenger') return <PassengerStack />;
  if (role === 'driver') return <DriverStack />;

  return null;
};

const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
