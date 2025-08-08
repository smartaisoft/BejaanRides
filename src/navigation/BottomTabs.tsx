import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

// Driver Screens
import DriverMapScreen from '../screens/Driver/DriverMapScreen';
import DriverProfile from '../screens/Driver/DriverProfile';

// Passenger Screens
import HomeMapScreen from '../screens/Passenger/HomeMapScreen';
import Profile from '../screens/Passenger/Profile';

// Shared Screens
import Subscriptions from '../screens/Subscription/Subscriptions';
import Colors from '../themes/colors';
import PassengerHomeScreen from '../screens/Passenger/PassengerHomeScreen';
import DriverHomeScreen from '../screens/Driver/DriverHomeScreen';
import WalletStatusScreen from '../screens/Subscription/MyWallet';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary, // ✅ Green active icon/text
        tabBarInactiveTintColor: Colors.tabBarInactive, // ✅ Soft grey for inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // ✅ White tab background
          borderTopColor: '#E4E4E4', // ✅ Matches greyButton
          paddingBottom: 6,
          height: 60,
        },
      }}>
      {role === 'driver' ? (
        <>
          <Tab.Screen
            name="DriverMap"
            component={DriverMapScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="car-outline" color={color} size={size} />
              ),
              title: 'Pick Ride',
            }}
          />
          <Tab.Screen
            name="DriverHomeScreen"
            component={DriverHomeScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="home" color={color} size={size} />
              ),
              title: 'Dashbord',
            }}
          />
           <Tab.Screen
            name="WalletStatusScreen"
            component={WalletStatusScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialIcon name="account-balance-wallet" color={color} size={size} />
              ),
              title: 'Wallet',
            }}
          />

          <Tab.Screen
            name="DriverServices"
            component={Subscriptions}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="construct-outline" color={color} size={size} />
              ),
              title: 'Services',
            }}
          />
          <Tab.Screen
            name="DriverProfile"
            component={DriverProfile}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="person-outline" color={color} size={size} />
              ),
              title: 'Profile',
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="PassengerPickRide"
            component={HomeMapScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="car" color={color} size={size} />
              ),
              title: 'Pick Ride',
            }}
          />
          <Tab.Screen
            name="PassengerDashboard"
            component={PassengerHomeScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              ),
              title: 'Dashbord',
            }}
          />
          <Tab.Screen
            name="WalletStatusScreen"
            component={WalletStatusScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <MaterialIcon name="account-balance-wallet" color={color} size={size} />
              ),
              title: 'Wallet',
            }}
          />

          <Tab.Screen
            name="PassengerServices"
            component={Subscriptions}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="construct-outline" color={color} size={size} />
              ),
              title: 'Services',
            }}
          />

          <Tab.Screen
            name="PassengerProfile"
            component={Profile}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="person-outline" color={color} size={size} />
              ),
              title: 'Profile',
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default BottomTabs;
