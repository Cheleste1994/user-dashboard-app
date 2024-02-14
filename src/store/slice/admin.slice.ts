import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AdminState {
  isLoading: boolean;
  isAuth: boolean;
  email: string | null;
  uid: string | null;
  users: UserState[];
}

export interface UserState {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  disabled: boolean;
  metadata: {
    lastSignInTime: string;
    creationTime: string;
    lastRefreshTime: string;
  };
  passwordHash: string;
  passwordSalt: string;
  tokensValidAfterTime: string;
  providerData: {
    uid: string;
    email: string;
    providerId: string;
  };
}

const URL_API = import.meta.env.VITE_SERVER_API;

const initialState: AdminState = {
  isLoading: false,
  isAuth: false,
  uid: null,
  email: null,
  users: [],
};

export const getUsersList = createAsyncThunk('admin/getUsersList', async () => {
  const responseList = await fetch(URL_API + '/users/list');
  const users = (await responseList.json()) as UserState[];

  const checkUsername = users.map((user) => ({
    ...user,
    displayName: user.displayName || 'None',
  }));
  const sort = checkUsername.sort((a, b) =>
    (a?.displayName || '') < (b?.displayName || '') ? -1 : 1
  );
  return sort;
});

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ uid, disabled }: { uid: string; disabled: boolean }, thunkAPI) => {
    const response = await fetch(URL_API + '/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, disabled }),
    });
    const users = await response.json();

    thunkAPI.dispatch(getUsersList());

    return users as UserState;
  }
);

export const deleteUsers = createAsyncThunk(
  'admin/deleteUsers',
  async (usersUid: string[], thunkAPI) => {
    const response = await fetch(URL_API + '/users/:userId', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usersArr: usersUid }),
    });

    await response.json();

    thunkAPI.dispatch(getUsersList());
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (
      state,
      { payload }: { payload: { email: string | null; uid: string | null } }
    ) => {
      state.email = payload.email;
      state.uid = payload.uid;
      state.isAuth = true;
    },
    sortName: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      if (payload === 'asc') {
        state.users = state.users.sort((a, b) =>
          (a?.displayName || '') < (b?.displayName || '') ? -1 : 1
        );
      } else {
        state.users = state.users.sort((a, b) =>
          (a?.displayName || '') > (b?.displayName || '') ? -1 : 1
        );
      }
    },
    sortEmail: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      if (payload === 'asc') {
        state.users = state.users.sort((a, b) =>
          (a?.email || '') < (b?.email || '') ? -1 : 1
        );
      } else {
        state.users = state.users.sort((a, b) =>
          (a?.email || '') > (b?.email || '') ? -1 : 1
        );
      }
    },
    sortLastLogin: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      if (payload === 'asc') {
        state.users = state.users.sort((a, b) =>
          (a?.metadata.lastSignInTime || '') <
          (b?.metadata.lastSignInTime || '')
            ? -1
            : 1
        );
      } else {
        state.users = state.users.sort((a, b) =>
          (a?.metadata.lastSignInTime || '') >
          (b?.metadata.lastSignInTime || '')
            ? -1
            : 1
        );
      }
    },
    sortStatus: (state, { payload }: { payload: 'asc' | 'desc' }) => {
      if (payload === 'asc') {
        state.users = state.users.sort((a) => (a?.disabled ? -1 : 1));
      } else {
        state.users = state.users.sort((a) => (a?.disabled ? 1 : -1));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUsersList.rejected, () => ({
        isAuth: false,
        uid: null,
        email: null,
        isLoading: false,
        users: [],
      }));
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(deleteUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteUsers.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setAdmin, sortName, sortEmail, sortLastLogin, sortStatus } =
  adminSlice.actions;

export const getUsersState = (state: RootState) => state.adminReducer;

export default adminSlice.reducer;
