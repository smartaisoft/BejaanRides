import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsScreen from '../screens/Passenger/SettingsScreen';
import NotificationsScreen from '../screens/Passenger/NotificationsScreen';
import HistoryScreen from '../screens/Passenger/HistoryScreen';

export type DrawerParamList = {
  History: undefined;
  Notifications: undefined;
  Settings: undefined;
  Logout: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#6200EE',
        drawerLabelStyle: {marginLeft: -15, fontSize: 15},
      }}>
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
        name="Logout"
        component={SettingsScreen}
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
