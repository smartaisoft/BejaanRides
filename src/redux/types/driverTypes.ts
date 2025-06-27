import {LatLng} from 'react-native-maps'; // Make sure you have this

export enum DriverStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  REQUEST_RECEIVED = 'REQUEST_RECEIVED',
  ARRIVED = 'ARRIVED',
  TRIP_STARTED = 'TRIP_STARTED',
  PAYMENT = 'PAYMENT',
}

export interface RideData {
  id: string;
  pickupLocation: LatLng;
  dropoffLocation: LatLng;
  riderName: string;
  riderPhone: string;
  distance: number;
  fare: number;
}

export interface DriverState {
  status: DriverStatus;
  currentRide: RideData | null;
}
