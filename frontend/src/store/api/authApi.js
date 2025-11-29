import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokenExpiry } from "../helper/tokenUtils";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        const { token, user } = response;
        const tokenExpiry = getTokenExpiry(token);

        // Guardar en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokenExpiry", tokenExpiry);

        return { token, user, tokenExpiry };
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        return { success: true };
      },
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password, confirmPassword },
      }),
    }),

    getCSRFToken: builder.query({
      query: () => "/csrf-token",
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem("csrfToken", response.token);
        }
        return response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGetCSRFTokenQuery,
} = authApi;
