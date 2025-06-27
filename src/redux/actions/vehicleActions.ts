// src/redux/actions/vehicleActions.ts

export const SET_DRIVER_PERSONAL_INFO = 'SET_DRIVER_PERSONAL_INFO';
export const SET_VEHICLE_TYPE = 'SET_VEHICLE_TYPE';
export const SET_VEHICLE_DETAILS = 'SET_VEHICLE_DETAILS';
export const RESET_VEHICLE_INFO = 'RESET_VEHICLE_INFO';

export const setDriverPersonalInfo = (data: {
  licenseNumber: string;
  expirationDate: string;
  images: {
    profile: string | null;
    license: string | null;
    selfie: string | null;
  };
}) => ({
  type: SET_DRIVER_PERSONAL_INFO,
  payload: data,
});

export const setVehicleType = (vehicleType: string) => ({
  type: SET_VEHICLE_TYPE,
  payload: vehicleType,
});

export const setVehicleDetails = (data: {
  model: string;
  brand: string;
  color: string;
  plateNumber: string;
  images: {
    certificateFront: string | null;
    certificateBack: string | null;
    vehiclePhoto: string | null;
  };
}) => ({
  type: SET_VEHICLE_DETAILS,
  payload: data,
});

export const resetVehicleInfo = () => ({
  type: RESET_VEHICLE_INFO,
});
