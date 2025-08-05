import {DriverStatus, OnlineDriverInfo, RideData} from '../types/driverTypes';

// Action Types
export const SET_DRIVER_STATUS = 'SET_DRIVER_STATUS';
export const SET_CURRENT_RIDE = 'SET_CURRENT_RIDE';
export const CLEAR_CURRENT_RIDE = 'CLEAR_CURRENT_RIDE';
export const SET_RIDE_REQUESTS = 'SET_RIDE_REQUESTS';
export const CLEAR_RIDE_REQUESTS = 'CLEAR_RIDE_REQUESTS';
export const SET_ONLINE_DRIVERS = 'SET_ONLINE_DRIVERS';

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

interface SetRideRequestsAction {
  type: typeof SET_RIDE_REQUESTS;
  payload: RideData[];
}

interface ClearRideRequestsAction {
  type: typeof CLEAR_RIDE_REQUESTS;
}

// Union Type for all Actions
export type DriverActionTypes =
  | SetDriverStatusAction
  | SetCurrentRideAction
  | ClearCurrentRideAction
  | SetRideRequestsAction
  | ClearRideRequestsAction;

// Action Creators
export const setDriverStatus = (
  status: DriverStatus,
): SetDriverStatusAction => {
  return {
    type: SET_DRIVER_STATUS,
    payload: status,
  };
};
export const setCurrentRide = (ride: RideData): SetCurrentRideAction => {
  return {
    type: SET_CURRENT_RIDE,
    payload: ride,
  };
};

export const clearCurrentRide = (): ClearCurrentRideAction => ({
  type: CLEAR_CURRENT_RIDE,
});

export const setRideRequests = (rides: RideData[]): SetRideRequestsAction => ({
  type: SET_RIDE_REQUESTS,
  payload: rides,
});

export const clearRideRequests = (): ClearRideRequestsAction => ({
  type: CLEAR_RIDE_REQUESTS,
});
// actions.ts
export const setOnlineDrivers = (drivers: OnlineDriverInfo[]) => ({
  type: 'SET_ONLINE_DRIVERS',
  payload: drivers,
});
