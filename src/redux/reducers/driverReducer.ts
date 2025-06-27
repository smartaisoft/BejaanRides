import { DriverState, DriverStatus } from '../types/driverTypes';
import {
  SET_DRIVER_STATUS,
  SET_CURRENT_RIDE,
  CLEAR_CURRENT_RIDE,
  DriverActionTypes,
} from '../actions/driverActions';

const initialState: DriverState = {
  status: DriverStatus.OFFLINE,
  currentRide: null,
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
    default:
      return state;
  }
};
