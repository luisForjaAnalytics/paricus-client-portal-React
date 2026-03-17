import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: createBaseQuery("/auth"),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Update profile information
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Update password
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/profile/password",
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Upload avatar image
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Delete avatar image
    deleteAvatar: builder.mutation({
      query: () => ({
        url: "/avatar",
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
