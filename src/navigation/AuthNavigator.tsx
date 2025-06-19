import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginWithPhone from '../screens/Login/LoginWithPhone';
import OTPScreen from '../screens/Login/OtpScreen';
import RoleScreen from '../screens/Login/RoleScreen';
import NameScreen from '../screens/Login/NameScreen';
import HomeScreen from '../screens/HomeScreen';
import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';
import LocationPick from '../screens/Login/LocationPick';

export type AuthStackParamList = {
  Splash: undefined;
  PhoneLogin: undefined;
  Otp: { method: string; phone: string };
  Role: undefined;
  Name: undefined;
  Home: undefined;
  DriverPersonalInfo: undefined;
  Location: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneLogin" component={LoginWithPhone} />
      <Stack.Screen name="Otp" component={OTPScreen} />
      <Stack.Screen name="Role" component={RoleScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DriverPersonalInfo" component={DriverPersonalInfo} />
      <Stack.Screen name="Location" component={LocationPick} />
    </Stack.Navigator>
  );
};

export default AuthStack;
