import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getUsersList } from './admin.slice';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_API_KEY,
  authDomain: import.meta.env.VITE_API_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_API_PROJECT_ID,
  storageBucket: import.meta.env.VITE_API_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_API_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_API_APP_ID,
  measurementId: import.meta.env.VITE_API_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export interface UserState {
  isAuth: boolean;
  email: string | null;
  displayName?: string | null;
  uid: string | null;
}

const initialState: UserState = {
  isAuth: localStorage.getItem('isAuth') === 'true' || false,
  email: null,
  uid: null,
};

export const fetchSignIn = createAsyncThunk(
  'user/signInWithEmailAndPassword',
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('isAuth', 'true');

    thunkAPI.dispatch(getUsersList());

    return {
      email: data.user.email,
      displayName: auth.currentUser?.displayName,
      uid: auth.currentUser?.uid,
    };
  }
);
export const fetchSignUp = createAsyncThunk(
  'user/createUserWithEmailAndPassword',
  async (
    {
      email,
      password,
      displayName,
    }: { email: string; password: string; displayName: string },
    thunkAPI
  ) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
    }

    localStorage.setItem('isAuth', 'true');

    await thunkAPI.dispatch(getUsersList());

    return {
      email: data.user.email,
      displayName: auth.currentUser?.displayName,
      uid: auth.currentUser?.uid,
    };
  }
);

export const fetchSignOut = createAsyncThunk('user/signOut', async () => {
  await auth.signOut();
  localStorage.setItem('isAuth', 'false');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      {
        payload,
      }: {
        payload: {
          email: string | null;
          displayName?: string | null;
          uid: string | null;
        };
      }
    ) => {
      state.isAuth = !!payload.email;
      state.email = payload.email;
      state.displayName = payload.displayName;
      state.uid = payload.uid;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSignIn.fulfilled, (state, action) => {
      state.isAuth = true;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.uid = action.payload.uid || null;
    });
    builder.addCase(fetchSignOut.fulfilled, (state) => {
      state.isAuth = false;
      state.email = null;
      state.displayName = null;
      state.uid = null;
    });
    builder.addCase(fetchSignUp.fulfilled, (state, action) => {
      state.isAuth = true;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.uid = action.payload.uid || null;
    });
  },
});

export const { setUser } = userSlice.actions;

export const getUser = (state: RootState) => state.userReducer;

export default userSlice.reducer;
