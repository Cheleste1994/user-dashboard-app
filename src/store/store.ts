import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user.slice';

export const store = configureStore({
  reducer: {
    userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
