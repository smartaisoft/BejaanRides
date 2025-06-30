import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import DriverStack from './DriverStack';
import AuthStack from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import {ActivityIndicator, View} from 'react-native';
import {setVehicleDetails} from '../redux/actions/vehicleActions';
import {getVehicleInfo} from '../services/vehicleService';
import HomeMapScreen from '../screens/Passenger/HomeMapScreen';

const RootNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasVehicleInfo, setHasVehicleInfo] = useState<boolean | null>(null);

  useEffect(() => {
    const checkVehicleInfo = async () => {
      if (isLoggedIn && role === 'driver') {
        setLoading(true);
        try {
          const vehicleData = await getVehicleInfo();
          if (vehicleData) {
            console.log('✅ Vehicle info found, saving to Redux');
            dispatch(setVehicleDetails(vehicleData));
            setHasVehicleInfo(true);
          } else {
            console.log('ℹ️ No vehicle info found');
            setHasVehicleInfo(false);
          }
        } catch (error) {
          console.error('❌ Error fetching vehicle info:', error);
          setHasVehicleInfo(false);
        } finally {
          setLoading(false);
        }
      }
    };

    checkVehicleInfo();
  }, [isLoggedIn, role, dispatch]);

  // 🔹 While loading vehicle info
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  // 🔹 Not logged in
  if (!isLoggedIn) {
    return <AuthStack />;
  }

  // 🔹 Passenger
  if (role === 'passenger') {
    // return <DrawerNavigator />;
    return <HomeMapScreen />;
  }

  // 🔹 Driver
  if (role === 'driver') {
    if (hasVehicleInfo === true) {
      return <DriverStack initialRouteName="DriverMapScreen" />;
    }
    if (hasVehicleInfo === false) {
      return <DriverStack initialRouteName="ChooseVehicleScreen" />;
    }
    // Still deciding (e.g., loading not yet started)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  // 🔹 Fallback
  return null;
};

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigator;
