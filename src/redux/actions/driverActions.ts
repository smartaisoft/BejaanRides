import { DriverStatus, RideData } from '../types/driverTypes';

// Action Types
export const SET_DRIVER_STATUS = 'SET_DRIVER_STATUS';
export const SET_CURRENT_RIDE = 'SET_CURRENT_RIDE';
export const CLEAR_CURRENT_RIDE = 'CLEAR_CURRENT_RIDE';

// Action Type Definitions
interface SetDriverStatusAction {
  type: typeof SET_DRIVER_STATUS;
  payload: DriverStatus;
}

interface SetCurrentRideAction {
  type: typeof SET_CURRENT_RIDE;
  payload: RideData;
}

interface ClearCurrentRideAction {
  type: typeof CLEAR_CURRENT_RIDE;
}

// Union Type for all Actions
export type DriverActionTypes =
  | SetDriverStatusAction
  | SetCurrentRideAction
  | ClearCurrentRideAction;

// Action Creators
export const setDriverStatus = (status: DriverStatus): SetDriverStatusAction => ({
  type: SET_DRIVER_STATUS,
  payload: status,
});

export const setCurrentRide = (ride: RideData): SetCurrentRideAction => ({
  type: SET_CURRENT_RIDE,
  payload: ride,
});

export const clearCurrentRide = (): ClearCurrentRideAction => ({
  type: CLEAR_CURRENT_RIDE,
});
