export const ADD_TOPUP_REQUEST = 'ADD_TOPUP_REQUEST';
export const SET_TOPUP_HISTORY = 'SET_TOPUP_HISTORY';
export const UPDATE_TOPUP_LIST = 'UPDATE_TOPUP_LIST';


export const addTopupRequest = (topup: any) => {
  console.log('📥 topup in redux:', topup);
  return {
    type: ADD_TOPUP_REQUEST,
    payload: topup,
  };
};
export const setTopupHistory = (history: any[]) => ({
  type: SET_TOPUP_HISTORY,
  payload: history,
});


export const updateTopupList = (topups: any[]) => ({
  type: UPDATE_TOPUP_LIST,
  payload: topups,
});
