import {createStore, applyMiddleware} from 'redux'; // Import applyMiddleware from redux
import {combineReducers} from 'redux';
import {thunk} from 'redux-thunk'; // Correct import of redux-thunk
import {authReducer} from './reducers/authReducers';
import {vehicleReducer} from './reducers/vehicleReducer';
import {driverReducer} from './reducers/driverReducer';
import rideReducer from './reducers/rideReducer';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['ride'],
};
// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer, // Add auth reducer here
  vehicle: vehicleReducer, // Register here
  driver: driverReducer, // Register driver reducer
  ride: rideReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch; // ✅ Add this
export default store;
