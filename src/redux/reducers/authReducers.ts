// redux/reducers/authReducer.ts
import { SET_USER, LOGOUT_USER, SET_CONFIRMATION } from '../actions/authActions';

interface AuthState {
  user: any;
  confirmation: any;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  confirmation: null,
  isLoggedIn: false,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case LOGOUT_USER:
      return initialState;
    case SET_CONFIRMATION:
      return {
        ...state,
        confirmation: action.payload,
      };
    default:
      return state;
  }
};
