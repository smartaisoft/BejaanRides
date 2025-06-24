import {createStore, applyMiddleware} from 'redux'; // Import applyMiddleware from redux
import {combineReducers} from 'redux';
import {thunk} from 'redux-thunk'; // Correct import of redux-thunk
import { authReducer } from './reducers/authReducers';

// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer, // Add auth reducer here
});

// Create the Redux store and apply the redux-thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply redux-thunk middleware

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch; // ✅ Add this
export default store;
