import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreenComponent from '../screens/SplashScreen'; // Adjust the import path
import HomeScreen from '../screens/HomeScreen';
import LoginWithPhone from '../screens/Login/LoginWithPhone';
import OTPScreen from '../screens/Login/OtpScreen';
import RoleScreen from '../screens/Login/RoleScreen';
import NameScreen from '../screens/Login/NameScreen';
import LocationPick from '../screens/Login/LocationPick';

// Define types for the screen names and parameters
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  PhoneLogin: undefined;
  Otp: {method: string; phone: string}; // Include phone and method
  Role: undefined; // Assuming RoleScreen does not require params
  Name: undefined; // Assuming NameScreen does not require params
  Location: { name: string }; // Name is passed as a parameter
};

// Create a Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreenComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PhoneLogin"
        component={LoginWithPhone}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otp"
        component={OTPScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Role"
        component={RoleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Name"
        component={NameScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Location"
        component={LocationPick}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
