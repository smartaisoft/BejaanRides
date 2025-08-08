import {ADD_TOPUP_REQUEST, SET_TOPUP_HISTORY, UPDATE_TOPUP_LIST} from '../actions/topupActions';

const initialState = {
  topups: [], // [{...topup}]
};

export const topupReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_TOPUP_REQUEST:
      return {
        ...state,
        topups: [...state.topups, action.payload],
      };
    case SET_TOPUP_HISTORY:
      return {
        ...state,
        topups: action.payload,
      };
      case UPDATE_TOPUP_LIST:
      return {
        ...state,
        topupHistory: action.payload,
      };
    default:
      return state;
  }
};
