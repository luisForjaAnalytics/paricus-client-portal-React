import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/profile`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Update profile information
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "",
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Update password
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/password",
        method: 'PUT',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = profileApi;
