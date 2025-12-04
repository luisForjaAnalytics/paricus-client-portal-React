import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { authReducer, clearCredentials } from "./auth/authSlice";
import { invoicesApi } from "./api/invoicesApi";
import { reportsApi } from "./api/reportsApi";
import { adminApi } from "./api/adminApi";
import { audioRecordingsApi } from "./api/audioRecordingsApi";
import { profileApi } from "./api/profileApi";
import { articlesApi } from "./api/articlesApi";
import { logsApi } from "./api/logsApi";

// Middleware to clear RTK Query cache on logout
const resetCacheMiddleware = (storeAPI) => (next) => (action) => {
  // Check if the action is a logout action
  if (
    action.type === clearCredentials.type ||
    authApi.endpoints.logout.matchFulfilled(action)
  ) {
    // Clear all API caches
    storeAPI.dispatch(invoicesApi.util.resetApiState());
    storeAPI.dispatch(reportsApi.util.resetApiState());
    storeAPI.dispatch(adminApi.util.resetApiState());
    storeAPI.dispatch(audioRecordingsApi.util.resetApiState());
    storeAPI.dispatch(profileApi.util.resetApiState());
    storeAPI.dispatch(articlesApi.util.resetApiState());
    storeAPI.dispatch(logsApi.util.resetApiState());
    storeAPI.dispatch(authApi.util.resetApiState());
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [invoicesApi.reducerPath]: invoicesApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [audioRecordingsApi.reducerPath]: audioRecordingsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    [logsApi.reducerPath]: logsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      resetCacheMiddleware, // Add cache reset middleware
      authApi.middleware,
      invoicesApi.middleware,
      reportsApi.middleware,
      adminApi.middleware,
      audioRecordingsApi.middleware,
      profileApi.middleware,
      articlesApi.middleware,
      logsApi.middleware
    ),
});
