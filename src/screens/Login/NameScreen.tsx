import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Button'; // Assuming you have a custom Button component
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook
import {NativeStackNavigationProp} from '@react-navigation/native-stack'; // Import the correct type
import { RootStackParamList } from '../../navigation/StackNavigation';

// Define navigation prop type
type NameScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Name'
>;
const NameScreen = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation<NameScreenNavigationProp>(); // Type the navigation object

  // Handle Go Back functionality
  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  // Handle Next button press and navigate to LocationScreen
  const handlePress = () => {
    console.log('Next Button Pressed');
    // navigation.navigate('Location', { name }); // Navigate to Location screen, passing name as parameter
        navigation.navigate('DriverPersonalInfo'); // Navigate to Location screen, passing name as parameter


  };


  return (
    <View style={styles.container}>
      {/* Go Back Button */}
      <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
        <Text style={styles.goBackText}>{'<'}</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Welcome to Bejaan Ride!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Please introduce yourself</Text>

      {/* Name Input Section */}
      <Text style={styles.label}>Enter your name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={name}
        onChangeText={setName}
      />

      {/* Next Button */}
      <Button
        title="Next"
        onPress={handlePress} // Trigger the navigation on press
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertically center the content
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5', // Light background color
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  goBackText: {
    fontSize: 20,
    color: '#333',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333', // Dark color for the header
  },
  subtitle: {
    fontSize: 12,
    color: '#000000', // Slightly lighter color for subtitle
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark color for the label
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    backgroundColor: '#E4E4E4',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

export default NameScreen;
