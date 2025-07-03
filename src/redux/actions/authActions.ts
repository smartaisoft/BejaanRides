import {
  SET_PHONE,
  SET_OTP_METHOD,
  SET_OTP,
  VERIFY_OTP,
  SET_ROLE,
  SET_NAME,
  SET_LOGGED_IN,
  AuthActionTypes,
  SET_AUTH_LOADING,
  UserData,
  SET_USER_DATA,
} from '../types/authTypes';

export const setAuthLoading = (loading: boolean): AuthActionTypes => ({
  type: SET_AUTH_LOADING,
  payload: loading,
});
export const setPhone = (phone: string): AuthActionTypes => ({
  type: SET_PHONE,
  payload: phone,
});

export const setOtpMethod = (method: string): AuthActionTypes => ({
  type: SET_OTP_METHOD,
  payload: method,
});

export const setOtp = (otp: string): AuthActionTypes => ({
  type: SET_OTP,
  payload: otp,
});

export const verifyOtp = (isValid: boolean): AuthActionTypes => ({
  type: VERIFY_OTP,
  payload: isValid,
});

export const setRole = (role: 'passenger' | 'driver'): AuthActionTypes => ({
  type: SET_ROLE,
  payload: role,
});

export const setName = (name: string): AuthActionTypes => ({
  type: SET_NAME,
  payload: name,
});

export const setLoggedIn = (loggedIn: boolean): AuthActionTypes => ({
  type: SET_LOGGED_IN,
  payload: loggedIn,
});

export const setUserData = (user: UserData): AuthActionTypes => ({
  type: SET_USER_DATA,
  payload: user,
});
