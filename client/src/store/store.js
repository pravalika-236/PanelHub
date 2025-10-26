import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import facultyReducer from './slices/facultySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    faculty: facultyReducer,
  },
});

export default store;
