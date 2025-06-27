import { DriverState, DriverStatus } from '../types/driverTypes';
import {
  SET_DRIVER_STATUS,
  SET_CURRENT_RIDE,
  CLEAR_CURRENT_RIDE,
  SET_RIDE_REQUESTS,
  CLEAR_RIDE_REQUESTS,
  DriverActionTypes,
} from '../actions/driverActions';

const initialState: DriverState = {
  status: DriverStatus.OFFLINE,
  currentRide: null,
  rideRequests: [], // ✅ Add default empty array
};

export const driverReducer = (
  state = initialState,
  action: DriverActionTypes
): DriverState => {
  switch (action.type) {
    case SET_DRIVER_STATUS:
      return { ...state, status: action.payload };
    case SET_CURRENT_RIDE:
      return { ...state, currentRide: action.payload };
    case CLEAR_CURRENT_RIDE:
      return { ...state, currentRide: null };
    case SET_RIDE_REQUESTS:
      return { ...state, rideRequests: action.payload };
    case CLEAR_RIDE_REQUESTS:
      return { ...state, rideRequests: [] };
    default:
      return state;
  }
};
