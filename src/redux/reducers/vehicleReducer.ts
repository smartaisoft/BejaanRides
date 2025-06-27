// src/redux/reducers/vehicleReducer.ts
import {
  SET_DRIVER_PERSONAL_INFO,
  SET_VEHICLE_TYPE,
  SET_VEHICLE_DETAILS,
  RESET_VEHICLE_INFO,
} from '../actions/vehicleActions';

const initialState = {
  driverPersonalInfo: {
    licenseNumber: '',
    expirationDate: '',
    images: {
      profile: null,
      license: null,
      selfie: null,
    },
  },
  vehicleType: '',
  vehicleDetails: {
    model: '',
    brand: '',
    color: '',
    plateNumber: '',
    images: {
      certificateFront: null,
      certificateBack: null,
      vehiclePhoto: null,
    },
  },
};

export const vehicleReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_DRIVER_PERSONAL_INFO:
      return { ...state, driverPersonalInfo: action.payload };
    case SET_VEHICLE_TYPE:
      return { ...state, vehicleType: action.payload };
    case SET_VEHICLE_DETAILS:
      return { ...state, vehicleDetails: action.payload };
    case RESET_VEHICLE_INFO:
      return initialState;
    default:
      return state;
  }
};
