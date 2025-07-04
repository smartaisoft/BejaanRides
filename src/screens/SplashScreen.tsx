import React, { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { AuthStackParamList } from '../navigation/AuthNavigator';
import { setLoggedIn, setRole } from '../redux/actions/authActions';
import type { AppDispatch } from '../redux/store';

type SplashNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Splash'
>;

const SplashScreenComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const [isLoggedIn, role] = await AsyncStorage.multiGet([
          '@isLoggedIn',
          '@role',
        ]);

        const loggedIn = isLoggedIn[1] === 'true';
        const userRole = role[1] as 'driver' | 'passenger' | null;

        console.log('🪵 isLoggedIn:', loggedIn);
        console.log('🪵 role:', userRole);

        if (loggedIn && userRole) {
          dispatch(setRole(userRole));
          dispatch(setLoggedIn(true));
        } else {
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('❌ Session check failed:', error);
        navigation.replace('Home');
      }
    };

    checkSession();
  }, [dispatch, navigation]);

  return (
    <LinearGradient
      colors={['#A7FFA7', '#3FFF3F']}
      style={styles.container}
    >
      <Image
        source={require('../../assets/images/SalamRider.png')}
        style={styles.image}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    maxWidth: 300,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreenComponent;
