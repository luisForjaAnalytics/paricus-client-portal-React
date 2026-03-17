import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: createBaseQuery("/profile"),
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
      invalidatesTags: ['Profile'],
    }),

    // Upload avatar image (uses /auth/avatar, not /profile)
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/auth/avatar`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Delete avatar image
    deleteAvatar: builder.mutation({
      query: () => ({
        url: `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/auth/avatar`,
        method: "DELETE",
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = profileApi;
