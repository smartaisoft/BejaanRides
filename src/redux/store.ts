// import { createStore, applyMiddleware, combineReducers } from 'redux';
// import thunk from 'redux-thunk'; // Middleware for async actions
// import { authReducer } from './reducers/authReducers';

// // Combine reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
// });

// // Create the store with middleware
// export const store = createStore(rootReducer, applyMiddleware(thunk));

// // Type of the RootState for useSelector
// export type RootState = ReturnType<typeof rootReducer>;

// src/redux/store.ts
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
