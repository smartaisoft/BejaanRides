import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';

const LocationPick = () => {
  const route = useRoute();
  console.log('Route params:', route.params); // Log the route parameters for debugging
  const {name} = route.params; // Access the 'name' parameter

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Location Screen</Text>
      <Text style={styles.subText}>Hello, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default LocationPick;
