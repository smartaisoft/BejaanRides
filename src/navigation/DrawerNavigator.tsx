import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsScreen from '../screens/Passenger/SettingsScreen';
import NotificationsScreen from '../screens/Passenger/NotificationsScreen';
import HistoryScreen from '../screens/Passenger/HistoryScreen';
import LocationPick from '../screens/Passenger/LocationPick';
import PaymentScreen from '../screens/Passenger/PaymentScreen';

export type DrawerParamList = {
  History: undefined;
  Notifications: undefined;
  Settings: undefined;
  Logout: undefined;
  Location: undefined;
  Payment: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Location"
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="Location" component={LocationPick} />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="bell-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="logout" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
