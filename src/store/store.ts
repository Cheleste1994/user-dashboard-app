import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user.slice';
import adminReducer from './slice/admin.slice';

export const store = configureStore({
  reducer: {
    userReducer,
    adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
