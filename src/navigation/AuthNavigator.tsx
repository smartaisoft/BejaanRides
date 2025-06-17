import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginWithPhone from '../screens/Login/LoginWithPhone';
import OTPScreen from '../screens/Login/OtpScreen';
import RoleScreen from '../screens/Login/RoleScreen';
import NameScreen from '../screens/Login/NameScreen';

export type AuthStackParamList = {
  Splash: undefined;
  PhoneLogin: undefined;
  Otp: {method: string; phone: string};
  Role: undefined;
  Name: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="PhoneLogin" component={LoginWithPhone} />
    <Stack.Screen name="Otp" component={OTPScreen} />
    <Stack.Screen name="Role" component={RoleScreen} />
    <Stack.Screen name="Name" component={NameScreen} />
  </Stack.Navigator>
);

export default AuthStack;
