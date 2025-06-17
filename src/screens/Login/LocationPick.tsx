import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import MapView, {Marker, Region, PROVIDER_GOOGLE} from 'react-native-maps';

const LocationPick = () => {
  const route = useRoute();
  console.log('Route params:', route.params); // Log the route parameters for debugging
  const {name} = route.params; // Access the 'name' parameter

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 31.4532538,
          longitude: 74.1919391,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}></MapView>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: '100%',
   width: '100%',
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});

export default LocationPick;
