// redux/actions/authActions.ts
import { Dispatch } from 'redux';
import { signInWithPhoneNumber, ConfirmationResult, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export const SET_USER = 'SET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_CONFIRMATION = 'SET_CONFIRMATION';

export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user,
});

export const logoutUser = () => async (dispatch: Dispatch) => {
  await signOut(auth);
  dispatch({ type: LOGOUT_USER });
};

export const sendOtp = (phone: string) => async (dispatch: Dispatch) => {
  try {
    const confirmation = await signInWithPhoneNumber(auth, phone);
    dispatch({
      type: SET_CONFIRMATION,
      payload: confirmation,
    });
  } catch (error) {
    console.error('OTP send error:', error);
    throw error;
  }
};

export const confirmOtp = (confirmation: ConfirmationResult, code: string) => async (dispatch: Dispatch) => {
  try {
    const result = await confirmation.confirm(code);
    dispatch(setUser(result.user));
  } catch (error) {
    console.error('OTP confirm error:', error);
    throw error;
  }
};
