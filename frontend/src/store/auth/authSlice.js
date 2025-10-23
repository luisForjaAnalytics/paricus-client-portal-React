import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../helper/tokenUtils";
import { authApi } from "../api/authApi";

const getInitialState = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const tokenExpiryStr = localStorage.getItem("tokenExpiry");
  const permissionsStr = localStorage.getItem("permissions");

  if (token && userStr && !isTokenExpired(tokenExpiryStr)) {
    return {
      user: JSON.parse(userStr),
      token,
      isAuthenticated: true,
      tokenExpiry: parseInt(tokenExpiryStr),
      permissions: permissionsStr ? JSON.parse(permissionsStr) : [],
    };
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    tokenExpiry: null,
    permissions: [],
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, tokenExpiry } = action.payload;
      state.user = user;
      state.token = token;
      state.tokenExpiry = tokenExpiry;
      state.isAuthenticated = true;
      state.permissions = user?.permissions || [];

      // Persist to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiry", tokenExpiry);
      localStorage.setItem("permissions", JSON.stringify(user?.permissions || []));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.permissions = [];
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const { token, user, tokenExpiry } = action.payload;
        state.user = user;
        state.token = token;
        state.tokenExpiry = tokenExpiry;
        state.isAuthenticated = true;
        state.permissions = user?.permissions || [];

        // Persist to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokenExpiry", tokenExpiry);
        localStorage.setItem("permissions", JSON.stringify(user?.permissions || []));
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.tokenExpiry = null;
        state.isAuthenticated = false;
        state.permissions = [];
        localStorage.clear();
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
