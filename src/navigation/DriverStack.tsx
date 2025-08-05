import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DriverPersonalInfo from '../screens/Driver/DriverPersonalInfo';
import ChooseVehicleScreen from '../screens/Driver/ChooseVehicle';
import VehicleInfoScreen from '../screens/Driver/VehicleInfoScreen';
import DriverMapScreen from '../screens/Driver/DriverMapScreen';
import DriverProfile from '../screens/Driver/DriverProfile';
import MyWallet from '../screens/Subscription/MyWallet';
import Subscriptions from '../screens/Subscription/Subscriptions';
import InviteFriend from '../screens/Passenger/InviteFriend';
import Topup from '../screens/Subscription/Topup';
import Investment from '../screens/Subscription/Investment';
import SubscriptionPlansScreen from '../screens/Subscription/SubscriptionPlan';

export type DriverStackParamList = {
  DriverPersonalInfo: undefined;
  ChooseVehicleScreen: undefined;
  VehicleInfoScreen: undefined;
  DriverMapScreen: undefined;
  DriverProfile: undefined;
  InviteFriend: undefined;
  Topup: undefined;
  MyWallet: undefined;
  Subscriptions: undefined;
  SubscriptionPlansScreen: undefined;
  Investment: {planTitle: string; planPrice: string};
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
    <Stack.Screen name="DriverProfile" component={DriverProfile} />
    <Stack.Screen name="MyWallet" component={MyWallet} />
    <Stack.Screen name="Subscriptions" component={Subscriptions} />
    <Stack.Screen name="InviteFriend" component={InviteFriend} />
    <Stack.Screen name="Topup" component={Topup} />
    <Stack.Screen name="Investment" component={Investment} />
    <Stack.Screen
      name="SubscriptionPlansScreen"
      component={SubscriptionPlansScreen}
    />
  </Stack.Navigator>
);

export default DriverStack;
