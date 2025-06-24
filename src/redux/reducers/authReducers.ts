import {
  AuthState,
  AuthActionTypes,
  SET_PHONE,
  SET_OTP_METHOD,
  SET_OTP,
  VERIFY_OTP,
  SET_ROLE,
  SET_NAME,
  SET_LOGGED_IN,
  SET_AUTH_LOADING,
} from '../types/authTypes';

const initialState: AuthState = {
  phone: '',
  otpMethod: null,
  otp: '',
  isOtpVerified: false,
  role: null,
  name: '',
  isLoggedIn: false,
  isLoading: false,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes,
): AuthState => {
  switch (action.type) {
    case SET_PHONE:
      return {...state, phone: action.payload};
    case SET_OTP_METHOD:
      return {...state, otpMethod: action.payload};
    case SET_OTP:
      return {...state, otp: action.payload};
    case VERIFY_OTP:
      return {...state, isOtpVerified: action.payload};
    case SET_ROLE:
      return {...state, role: action.payload};
    case SET_NAME:
      return {...state, name: action.payload};
    case SET_LOGGED_IN:
      return {...state, isLoggedIn: action.payload};
    case SET_AUTH_LOADING:
      return {...state, isLoading: action.payload};
    default:
      return state;
  }
};
