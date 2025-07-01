import {LatLng} from 'react-native-maps'; // Make sure you have this

// export enum DriverStatus {
//   OFFLINE = 'OFFLINE',
//   ONLINE = 'ONLINE',
//   REQUEST_RECEIVED = 'REQUEST_RECEIVED',
//   ARRIVED = 'ARRIVED',
//   TRIP_STARTED = 'TRIP_STARTED',
//   PAYMENT = 'PAYMENT',
// }

export enum DriverStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  REQUEST_RECEIVED = 'REQUEST_RECEIVED',
  ON_THE_WAY = 'ON_THE_WAY',               // 🚗 new
  WAITING_FOR_PASSENGER = 'WAITING_FOR_PASSENGER', // 🟢 new
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
  rideRequests: RideData[]; // ✅ NEW: All incoming ride requests

}
