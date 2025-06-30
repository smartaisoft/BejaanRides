import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import HomeMapScreen from '../screens/Passenger/HomeMapScreen';

export type PassengerStackParamList = {
  PassengerHome: undefined;
  Drawer: undefined;
  HomeMapScreen: undefined;
};

const Stack = createStackNavigator<PassengerStackParamList>();

const PassengerStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMapScreen" component={HomeMapScreen} />
    {/* <Stack.Screen name="Drawer" component={DrawerNavigator} /> */}
  </Stack.Navigator>
);

export default PassengerStack;
