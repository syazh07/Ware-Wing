import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const initialState = {
  token: localStorage.getItem("jwt_token"),
  role: localStorage.getItem("user_role"),
  username: localStorage.getItem("username"),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      authService.logout();

      state.token = null;
      state.role = null;
      state.username = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload;

        state.token = payload.accessToken;
        state.role = payload.role;
        state.username = payload.username;

        localStorage.setItem("jwt_token", payload.accessToken);
        localStorage.setItem("user_role", payload.role);
        localStorage.setItem("username", payload.username);
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;