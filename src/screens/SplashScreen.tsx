import React, { useEffect } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import the correct navigation prop
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook
import { AuthStackParamList } from '../navigation/AuthNavigator';

// Define the navigation prop type for this screen
type SplashNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Splash'
>;

const SplashScreenComponent = () => {
  const navigation = useNavigation<SplashNavigationProp>(); // Type the navigation object

  useEffect(() => {
    // Navigate to the Home screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Home');  // Navigate to Home screen after 3 seconds
    }, 3000);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);  return (
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
