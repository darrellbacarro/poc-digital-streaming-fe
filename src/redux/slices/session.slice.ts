import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  getLoggedInUserData,
  login,
  logout,
  updateFavorites
} from "../../utils/api";
import { User } from "../models";

export type SessionState = {
  token?: string | null;
  userData?: User | null;
};

export const doLogin = createAsyncThunk(
  "session/login",
  async (data: { email: string; password: string }) => {
    const res = await login(data.email, data.password);
    return res;
  }
);

export const doLogout = createAsyncThunk("session/logout", async () => {
  await logout();
  return null;
});

export const getLoggedInUser = createAsyncThunk(
  "session/getLoggedInUser",
  async () => {
    const res = await getLoggedInUserData();
    return res.data;
  }
);

export const doUpdateFavorites = createAsyncThunk(
  "session/doUpdateFavorites",
  async (data: { movieId: string; isFavorite: boolean }, { getState }) => {
    const {
      session: { userData },
    } = getState() as RootState;
    const res = await updateFavorites({ ...data, userId: userData?.id! });
    return res.data;
  }
);

const initialState: SessionState = {
  token: null,
  userData: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    clearSession: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      const {
        data: { user, token },
      } = action.payload;
      state.userData = user;
      state.token = token;
    });

    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = null;
      state.userData = null;
    });

    builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
      state.userData = action.payload;
    });

    builder.addCase(doUpdateFavorites.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
  },
});

export const { clearSession } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
