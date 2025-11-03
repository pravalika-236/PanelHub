import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import facultyReducer from './slices/facultySlice';
import { useEffect } from 'react';

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  faculty: facultyReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export const useClearOnTabClose = () => {
  useEffect(() => {
    if (!sessionStorage.getItem('tabActive')) {
      sessionStorage.setItem('tabActive', 'true');
    }

    const handleBeforeUnload = (event) => {
      if (sessionStorage.getItem('tabActive')) {
        sessionStorage.removeItem('tabActive');
        persistor.purge();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

export default store;
