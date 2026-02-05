import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../helper/tokenUtils";
import { authApi } from "../api/authApi";

/**
 * Safely parse JSON string with fallback value
 * @param {string|null} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
const safeJsonParse = (jsonString, fallback = null) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse stored data:", error);
    return fallback;
  }
};

const getInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const tokenExpiryStr = localStorage.getItem("tokenExpiry");
    const permissionsStr = localStorage.getItem("permissions");

    if (token && userStr && !isTokenExpired(tokenExpiryStr)) {
      const user = safeJsonParse(userStr, null);
      const permissions = safeJsonParse(permissionsStr, []);

      if (user) {
        return {
          user,
          token,
          isAuthenticated: true,
          tokenExpiry: parseInt(tokenExpiryStr, 10) || null,
          permissions,
        };
      }
    }
  } catch (error) {
    console.error("Error initializing auth state:", error);
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
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state, action) => {
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
