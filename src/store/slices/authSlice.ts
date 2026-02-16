import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: null | {
    id: string;
    email: string;
    name?: string;
    role?: string;
    avatar?: string;
    token?: string;
  };
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: 'loading'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      state.status = 'authenticated';
    },
    logout: (state) => {
      state.user = null;
      state.status = 'unauthenticated';
    },
    authCheckFinished: (state) => {
      if (state.status === 'loading') {
        state.status = 'unauthenticated';
      }
    }
  }
});

export const { loginSuccess, logout, authCheckFinished } = authSlice.actions;
export default authSlice.reducer;
