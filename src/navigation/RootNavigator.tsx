import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

import {RootState, AppDispatch} from '../redux/store';
import {setVehicleDetails} from '../redux/actions/vehicleActions';

import AuthStack from './AuthNavigator';
import DriverStack from './DriverStack';
import PassengerStack from './PassengerStack';

import {getVehicleInfo} from '../services/vehicleService';
import Colors from '../themes/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, role} = useSelector((state: RootState) => state.auth);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [hasVehicleInfo, setHasVehicleInfo] = useState<boolean | null>(null);
  useEffect(() => {
    const checkPhoneVerification = async () => {
      const verified = await AsyncStorage.getItem('@isPhoneVerified');
      setIsPhoneVerified(verified === 'true');
    };
    checkPhoneVerification();
  }, []);

  // Fetch vehicle info for drivers
  useEffect(() => {
    const fetchVehicleInfo = async () => {
      if (isLoggedIn && role === 'driver') {
        setLoading(true);
        try {
          const data = await getVehicleInfo();
          if (data) {
            dispatch(setVehicleDetails(data));
            setHasVehicleInfo(true);
          } else {
            setHasVehicleInfo(false);
          }
        } catch (error) {
          console.error('❌ Failed to fetch vehicle info:', error);
          setHasVehicleInfo(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVehicleInfo();
  }, [isLoggedIn, role, dispatch]);

  // Decide which stack to show
  const renderStack = useMemo(() => {
    if (!isLoggedIn) {
      return <AuthStack />;
    }
    // if (!isLoggedIn && isPhoneVerified) {
    //   return <AuthStack initialRouteName="Role" />;
    // }

    if (role === 'passenger') {
      return <PassengerStack />;
    }

    if (role === 'driver') {
      if (loading || hasVehicleInfo === null) {
        return <LoadingScreen />;
      }

      return (
        <DriverStack
          initialRouteName={
            hasVehicleInfo ? 'DriverMapScreen' : 'ChooseVehicleScreen'
          }
        />
      );
    }

    return <LoadingScreen />;
  }, [isLoggedIn, role, loading, hasVehicleInfo]);

  return renderStack;
};

const LoadingScreen = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
