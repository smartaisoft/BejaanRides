import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginWithPhone from '../screens/Login/LoginWithPhone';
import OTPScreen from '../screens/Login/OtpScreen';
import RoleScreen from '../screens/Login/RoleScreen';
import NameScreen from '../screens/Login/NameScreen';
import HomeScreen from '../screens/HomeScreen';
import LocationPick from '../screens/Passenger/LocationPick';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import PaymentScreen from '../screens/Passenger/PaymentScreen';

export type AuthStackParamList = {
  Splash: undefined;
  PhoneLogin: undefined;
  // Otp: { method: string; phone: string };
  Otp: {
    method: string;
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    isNewUser: boolean; // ✅ Add this line
  };
  Role: undefined;
  Name: undefined;
  Home: undefined;
  Location: undefined;
  Payment: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneLogin" component={LoginWithPhone} />
      <Stack.Screen name="Otp" component={OTPScreen} />
      <Stack.Screen name="Role" component={RoleScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Location" component={LocationPick} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
