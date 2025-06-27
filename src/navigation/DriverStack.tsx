// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';
// import ChooseVehicleScreen from '../screens/Driver/ChooseVehicle';
// import VehicleInfoScreen from '../screens/Driver/VehicleInfoScreen';
// import DriverMapScreen from '../screens/Driver/DriverMapScreen';

// export type DriverStackParamList = {
//   DriverPersonalInfo: undefined;
//   ChooseVehicleScreen: undefined;
//   VehicleInfoScreen: undefined;
//   DriverMapScreen:undefined;
// };

// const Stack = createStackNavigator<DriverStackParamList>();

// const DriverStack = () => (
//   <Stack.Navigator screenOptions={{headerShown: false}}>
//     <Stack.Screen name="DriverPersonalInfo" component={DriverPersonalInfo} />
//     <Stack.Screen name="ChooseVehicleScreen" component={ChooseVehicleScreen} />
//     <Stack.Screen name="VehicleInfoScreen" component={VehicleInfoScreen} />
//     <Stack.Screen name="DriverMapScreen" component={DriverMapScreen} />

//   </Stack.Navigator>
// );

// export default DriverStack;

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';
import ChooseVehicleScreen from '../screens/Driver/ChooseVehicle';
import VehicleInfoScreen from '../screens/Driver/VehicleInfoScreen';
import DriverMapScreen from '../screens/Driver/DriverMapScreen';

export type DriverStackParamList = {
  DriverPersonalInfo: undefined;
  ChooseVehicleScreen: undefined;
  VehicleInfoScreen: undefined;
  DriverMapScreen: undefined;
};

const Stack = createStackNavigator<DriverStackParamList>();

interface Props {
  initialRouteName?: keyof DriverStackParamList;
}

const DriverStack: React.FC<Props> = ({initialRouteName}) => (
  <Stack.Navigator
    initialRouteName={initialRouteName || 'DriverPersonalInfo'}
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="DriverPersonalInfo" component={DriverPersonalInfo} />
    <Stack.Screen name="ChooseVehicleScreen" component={ChooseVehicleScreen} />
    <Stack.Screen name="VehicleInfoScreen" component={VehicleInfoScreen} />
    <Stack.Screen name="DriverMapScreen" component={DriverMapScreen} />
  </Stack.Navigator>
);

export default DriverStack;
