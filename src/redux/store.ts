import {createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux';
import {thunk} from 'redux-thunk';
import {authReducer} from './reducers/authReducers';
import {vehicleReducer} from './reducers/vehicleReducer';
import {driverReducer} from './reducers/driverReducer';
import rideReducer from './reducers/rideReducer';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {subscriptionReducer} from './reducers/subscriptionReducer';
import { topupReducer } from './reducers/topupReducer';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['ride', 'auth'],
};
const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
  driver: driverReducer,
  ride: rideReducer,
  subscriptions: subscriptionReducer,
  topup: topupReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
