import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import CarLogo from '../../assets/SVG/CarLogo';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Adjust the import path based on your project structure
import {NativeStackNavigationProp} from '@react-navigation/native-stack'; // Import the correct type
import Colors from '../themes/colors';

// Define navigation prop type
type HomeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Type the navigation object

  // Handle phone button press and navigate to PhoneLogin screen
  const handlePhonePress = () => {
    console.log('Phone Button Pressed');
    navigation.navigate('PhoneLogin'); // Correctly navigate to PhoneLogin
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/SalamRider.png')} // Adjust the path based on your project structure
        style={styles.logoImage}
      />
      <CarLogo width={300} height={300} style={styles.logo} />
      {/* <Beejan width={300} height={300} style={styles.logo} /> */}

      {/* Title and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Book A Ride</Text>
        <Text style={styles.description}>
          Worried about booking a ride? Get the comfort of ride booking,
          renting, or finding a ride pool service in seconds with a single tap
          on your screen.
        </Text>
      </View>

      {/* Default Button */}
      <Button
        title="Continue with Phone"
        onPress={handlePhonePress} // Trigger the handlePhonePress function on press
        style={styles.button}
        backgroundColor={Colors.primary} // Use a consistent color
      />

      {/* Custom Button */}
      <Button
        title="Continue with Google"
        onPress={handlePhonePress}
        backgroundColor="#E4E4E4"
        textColor="white"
        icon={require('../../assets/images/Google.png')} // Use image as icon
        style={styles.button}
        textStyle={styles.customButtonText}
      />

      {/* Terms and Privacy */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          Joining our app means you agree with our Terms of Use and Privacy
          Policy.
        </Text>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logoImage: {
    width: 100,
    height: 50,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    justifyContent: 'flex-start',
    color: '#000000',
    marginHorizontal: 20,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  customButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default HomeScreen;
