import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LocationPick from '../screens/Login/LocationPick';

export type PassengerStackParamList = {
  Location: {name: string};
  PassengerHome: undefined;
};

const Stack = createStackNavigator<PassengerStackParamList>();

const PassengerStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Location" component={LocationPick} />
  </Stack.Navigator>
);

export default PassengerStack;
