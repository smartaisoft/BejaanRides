import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import PassengerStack from './PassengerStack';
import DriverStack from './DriverStack';
import AuthStack from './AuthNavigator';

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'passenger' | 'driver' | null>(null);

  if (!isLoggedIn) return <AuthStack />;

  if (role === 'passenger') return <PassengerStack />;
  if (role === 'driver') return <DriverStack />;

  return null; 
};

export default () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);
