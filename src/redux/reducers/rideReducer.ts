// redux/reducers/rideReducer.js
import {
  SET_CURRENT_LOCATION,
  SET_PICKUP_LOCATION,
  SET_DROPOFF_LOCATION,
  SET_ROUTE_INFO,
  SET_ROUTE_TO_PICKUP,
  SET_SELECTED_VEHICLE,
  SET_SELECTED_VEHICLE_OPTION,
  SET_FARE,
  SET_RIDE_ID,
  SET_DRIVER_INFO,
  SET_DRIVER_LIVE_COORDS,
  SET_SELECTED_OFFER,
  SET_SEARCHING_DRIVER,
  SET_DRIVER_ARRIVED,
  SET_RIDE_STATUS,
} from '../actions/rideActions';

const initialState = {
  currentLocation: null,
  pickupLocation: null,
  dropoffLocation: null,
  routeInfo: null,
  routeInfoToPickup: null,
  selectedVehicle: 'Car',
  selectedVehicleOption: null,
  fare: 0,
  currentRideId: null,
  driverInfo: null,
  driverLiveCoords: null,
  selectedOffer: null,
  isSearchingDriver: false,
  hasDriverArrived: false,
  status: 'idle',
};

const rideReducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case SET_CURRENT_LOCATION:
      return { ...state, currentLocation: action.payload };
    case SET_PICKUP_LOCATION:
      return { ...state, pickupLocation: action.payload };
    case SET_DROPOFF_LOCATION:
      return { ...state, dropoffLocation: action.payload };
    case SET_ROUTE_INFO:
      return { ...state, routeInfo: action.payload };
    case SET_ROUTE_TO_PICKUP:
      return { ...state, routeInfoToPickup: action.payload };
    case SET_SELECTED_VEHICLE:
      return { ...state, selectedVehicle: action.payload };
    case SET_SELECTED_VEHICLE_OPTION:
      return { ...state, selectedVehicleOption: action.payload };
    case SET_FARE:
      return { ...state, fare: action.payload };
    case SET_RIDE_ID:
      return { ...state, currentRideId: action.payload };
    case SET_DRIVER_INFO:
      return { ...state, driverInfo: action.payload };
    case SET_DRIVER_LIVE_COORDS:
      return { ...state, driverLiveCoords: action.payload };
    case SET_SELECTED_OFFER:
      return { ...state, selectedOffer: action.payload };
    case SET_SEARCHING_DRIVER:
      return { ...state, isSearchingDriver: action.payload };
    case SET_DRIVER_ARRIVED:
      return { ...state, hasDriverArrived: action.payload };
    case SET_RIDE_STATUS:
      return { ...state, status: action.payload };
    default:
      return state;
  }
};

export default rideReducer;