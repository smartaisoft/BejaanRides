// actions/subscriptionActions.ts
export const SET_USER_SUBSCRIPTIONS = 'SET_USER_SUBSCRIPTIONS';

export const setUserSubscriptions = (subscriptions: any[]) => ({
  type: SET_USER_SUBSCRIPTIONS,
  payload: subscriptions,
});
