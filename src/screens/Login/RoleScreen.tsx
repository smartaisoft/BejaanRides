import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button'; // Assuming Button is a reusable component
import Ride from '../../../assets/SVG/Ride'; // Import the Ride SVG component
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigation';

// Define the navigation prop type for this screen
type RoleScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Role' // Replace with the screen you're navigating from
>;

const RoleScreen = () => {
  const navigation = useNavigation<RoleScreenNavigationProp>();
  const handlePassengerPress = () => {
    console.log('Passenger selected');
    // Navigate or perform action for passenger selection
        navigation.navigate('Name'); // Replace 'PassengerScreen' with the actual screen name

  };

  const handleDriverPress = () => {
    console.log('Driver selected');
    // Navigate or perform action for driver selection
        navigation.navigate('Name'); // Replace 'PassengerScreen' with the actual screen name

  };

  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.header}>Are you a passenger or a driver? </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
       You can change the mode.
      </Text>

      {/* Render Ride Image */}
      <View style={styles.imageContainer}>
        <Ride width={400} height={400} />
      </View>

      {/* Bottom Buttons */}
      <Button
        title="Passenger"
        onPress={handlePassengerPress}
        backgroundColor="#9C27B0"
        textColor="white"
        style={styles.button}
        textStyle={styles.passengerText}
      />

      <Button
        title="Driver"
        onPress={handleDriverPress}
        backgroundColor="#E4E4E4"
        textColor="white"
        style={styles.button}
        textStyle={styles.DriverText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 40,
    marginRight:45,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  passengerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  DriverText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default RoleScreen;
