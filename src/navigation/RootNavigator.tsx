import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import DriverStack from './DriverStack';
import AuthStack from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

const RootNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);

  // 🔹 User is logged in AND role is passenger
  if (isLoggedIn && role === 'passenger') return <DrawerNavigator />;

  // 🔹 User is logged in AND role is driver
  if (isLoggedIn && role === 'driver') return <DriverStack />;

  // 🔹 User is NOT logged in
  return <AuthStack />;
};

const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
