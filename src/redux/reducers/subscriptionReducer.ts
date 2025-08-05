
import {SET_USER_SUBSCRIPTIONS} from '../actions/subscriptionActions';
const initialState = {
  userSubscriptions: [],
};

export const subscriptionReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_USER_SUBSCRIPTIONS:
      return {...state, userSubscriptions: action.payload};
    default:
      return state;
  }
};
