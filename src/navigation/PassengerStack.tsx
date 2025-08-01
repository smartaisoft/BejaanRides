import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMapScreen from '../screens/Passenger/HomeMapScreen';
import SettingsScreen from '../screens/Passenger/SettingsScreen';
import ProfileSettings from '../screens/Passenger/Menu/ProfileSetting';
import NotificationsScreen from '../screens/Passenger/NotificationsScreen';
import HistoryScreen from '../screens/Passenger/HistoryScreen';
import PaymentScreen from '../screens/Passenger/PaymentScreen';
import Profile from '../screens/Passenger/Profile';
import InviteFriend from '../screens/Passenger/InviteFriend';

export type PassengerStackParamList = {
  PassengerHome: undefined;
  Drawer: undefined;
  HomeMapScreen: undefined;
  Settings: undefined;
  ProfileSetting: undefined;
  Notifications: undefined;
  History: undefined;
  Payment: undefined;
  Profile: undefined;
  InviteFriend: undefined;
};

const Stack = createStackNavigator<PassengerStackParamList>();

const PassengerStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMapScreen" component={HomeMapScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ProfileSetting" component={ProfileSettings} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="InviteFriend" component={InviteFriend} />
  </Stack.Navigator>
);

export default PassengerStack;
