import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMapScreen from '../screens/Passenger/HomeMapScreen';
import SettingsScreen from '../screens/Passenger/SettingsScreen';
import ProfileSettings from '../screens/Passenger/Menu/ProfileSetting';

export type PassengerStackParamList = {
  PassengerHome: undefined;
  Drawer: undefined;
  HomeMapScreen: undefined;
  Settings: undefined;
  ProfileSetting: undefined;
};

const Stack = createStackNavigator<PassengerStackParamList>();

const PassengerStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMapScreen" component={HomeMapScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ProfileSetting" component={ProfileSettings} />
  </Stack.Navigator>
);

export default PassengerStack;
