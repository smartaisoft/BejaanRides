// utils/geolocation.ts

import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import { Coordinate, Region } from './types';

const INITIAL_DELTA = { latitudeDelta: 0.015, longitudeDelta: 0.0121 };

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    const coarse = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
    return (
      fine === PermissionsAndroid.RESULTS.GRANTED ||
      coarse === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

// export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
//   try {
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU`
//     );
//     const data = await response.json();
//     return data.status === 'OK'
//       ? data.results[0]?.formatted_address || 'Unknown location'
//       : 'No address found';
//   } catch {
//     return 'Reverse geocoding error';
//   }
// };
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vUY`,
    );
    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    console.warn('Reverse geocode failed:', data.status, data.error_message);
    return 'Address not found';
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return 'Address not found';
  }
};


export const getCurrentLocation = (INITIAL_DELTA: { latitudeDelta: number; longitudeDelta: number; }): Promise<{
  region: Region;
  coords: Coordinate;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const region: Region = {
          latitude,
          longitude,
          ...INITIAL_DELTA,
        };
        resolve({ region, coords: { latitude, longitude } });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 6000, distanceFilter: 0 }
    );
  });
};
