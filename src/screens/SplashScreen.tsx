import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';

import {AuthStackParamList} from '../navigation/AuthNavigator';
import {setLoggedIn, setRole} from '../redux/actions/authActions';
import type {AppDispatch} from '../redux/store';

type SplashNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Splash'
>;

const SplashScreenComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<SplashNavigationProp>();

useEffect(() => {
  const checkSession = async () => {
    try {
      const [isLoggedIn, role] = await AsyncStorage.multiGet([
        '@isLoggedIn',
        '@role',
      ]);

      console.log('🪵 isLoggedIn:', isLoggedIn[1]);
      console.log('🪵 role:', role[1]);

      if (isLoggedIn[1] === 'true' && role[1]) {
        dispatch(setRole(role[1] as 'passenger' | 'driver'));
        dispatch(setLoggedIn(true));
      } else {
        setTimeout(() => {
          navigation.replace('Home');
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Session check failed:', error);
      navigation.replace('Home');
    }
  };

  checkSession();
}, [dispatch, navigation]);


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/BeejanLogo.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B39DDBCC',
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
