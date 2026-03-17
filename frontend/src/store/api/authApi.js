import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";
import { getTokenExpiry } from "../helper/tokenUtils";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery(),
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
        return { token, user, tokenExpiry };
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    verifyCode: builder.mutation({
      query: (code) => ({
        url: "/auth/verify-code",
        method: "POST",
        body: { code },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password, confirmPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = authApi;
