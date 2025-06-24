// File: src/redux/types/authTypes.ts

export const SET_PHONE = 'SET_PHONE';
export const SET_OTP_METHOD = 'SET_OTP_METHOD';
export const SET_OTP = 'SET_OTP';
export const VERIFY_OTP = 'VERIFY_OTP';
export const SET_ROLE = 'SET_ROLE';
export const SET_NAME = 'SET_NAME';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING';


export interface AuthState {
  phone: string;
  otpMethod: string | null;
  otp: string;
  isOtpVerified: boolean;
  role: 'passenger' | 'driver' | null;
  name: string;
  isLoggedIn: boolean;
  isLoading: boolean; // ← Add this

}

interface SetPhoneAction {
  type: typeof SET_PHONE;
  payload: string;
}

interface SetOtpMethodAction {
  type: typeof SET_OTP_METHOD;
  payload: string;
}

interface SetOtpAction {
  type: typeof SET_OTP;
  payload: string;
}

interface VerifyOtpAction {
  type: typeof VERIFY_OTP;
  payload: boolean;
}

interface SetRoleAction {
  type: typeof SET_ROLE;
  payload: 'passenger' | 'driver';
}

interface SetNameAction {
  type: typeof SET_NAME;
  payload: string;
}

interface SetLoggedInAction {
  type: typeof SET_LOGGED_IN;
  payload: boolean;
}

interface SetAuthLoadingAction {
  type: typeof SET_AUTH_LOADING;
  payload: boolean;
}

export type AuthActionTypes =
  | SetPhoneAction
  | SetOtpMethodAction
  | SetOtpAction
  | VerifyOtpAction
  | SetRoleAction
  | SetNameAction
  | SetLoggedInAction
  | SetAuthLoadingAction; // ← Add this

