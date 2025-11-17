import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { authReducer } from "./auth/authSlice";
import { invoicesApi } from "./api/invoicesApi";
import { reportsApi } from "./api/reportsApi";
import { adminApi } from "./api/adminApi";
import { audioRecordingsApi } from "./api/audioRecordingsApi";
import { profileApi } from "./api/profileApi";
import { articlesApi } from "./api/articlesApi";

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      invoicesApi.middleware,
      reportsApi.middleware,
      adminApi.middleware,
      audioRecordingsApi.middleware,
      profileApi.middleware,
      articlesApi.middleware
    ),
});
