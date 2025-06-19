import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';

export type DriverStackParamList = {
  DriverPersonalInfo: undefined;
};

const Stack = createStackNavigator<DriverStackParamList>();

const DriverStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="DriverPersonalInfo" component={DriverPersonalInfo} />
  </Stack.Navigator>
);

export default DriverStack;
