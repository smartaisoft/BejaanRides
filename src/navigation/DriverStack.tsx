import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';
import ChooseVehicleScreen from '../screens/Driver/ChooseVehicle';
import VehicleInfoScreen from '../screens/Driver/VehicleInfoScreen';

export type DriverStackParamList = {
  DriverPersonalInfo: undefined;
  ChooseVehicleScreen: undefined;
  VehicleInfoScreen: undefined;
};

const Stack = createStackNavigator<DriverStackParamList>();

const DriverStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="DriverPersonalInfo" component={DriverPersonalInfo} />
    <Stack.Screen name="ChooseVehicleScreen" component={ChooseVehicleScreen} />
    <Stack.Screen name="VehicleInfoScreen" component={VehicleInfoScreen} />

  </Stack.Navigator>
);

export default DriverStack;
