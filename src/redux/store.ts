import {createStore, applyMiddleware} from 'redux'; // Import applyMiddleware from redux
import {combineReducers} from 'redux';
import {thunk} from 'redux-thunk'; // Correct import of redux-thunk
import { authReducer } from './reducers/authReducers';
import { vehicleReducer } from './reducers/vehicleReducer';
import { driverReducer } from './reducers/driverReducer';

// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer, // Add auth reducer here
  vehicle: vehicleReducer, // Register here
  driver:driverReducer, // Register driver reducer

});

// Create the Redux store and apply the redux-thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply redux-thunk middleware

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch; // ✅ Add this
export default store;
