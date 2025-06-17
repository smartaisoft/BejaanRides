import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LocationPick from '../screens/Login/LocationPick';
import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';

export type DriverStackParamList = {
  Location: {name: string};
  DriverDashboard: undefined;
};

const Stack = createStackNavigator<DriverStackParamList>();

const DriverStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Location" component={LocationPick} />
    <Stack.Screen name="DriverDashboard" component={DriverPersonalInfo} />
  </Stack.Navigator>
);

export default DriverStack;
