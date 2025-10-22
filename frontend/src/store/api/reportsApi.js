import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/reports`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    // Get client folders
    getClientFolders: builder.query({
      query: () => "/client-folders",
      transformResponse: (response) => response.folders || [],
      providesTags: ['Reports'],
    }),

    // Get reports for a specific client folder
    getClientReports: builder.query({
      query: (folder) => `/client/${folder}`,
      transformResponse: (response) => response.reports || [],
      providesTags: (result, error, folder) => [{ type: 'Reports', id: folder }],
    }),

    // Upload report
    uploadReport: builder.mutation({
      query: ({ folder, formData }) => ({
        url: `/upload/${folder}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { folder }) => [{ type: 'Reports', id: folder }, 'Reports'],
    }),

    // Download report
    downloadReport: builder.query({
      query: ({ folder, fileName }) => `/download/${folder}/${encodeURIComponent(fileName)}`,
    }),

    // Delete report
    deleteReport: builder.mutation({
      query: ({ folder, fileName }) => ({
        url: `/${folder}/${encodeURIComponent(fileName)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { folder }) => [{ type: 'Reports', id: folder }, 'Reports'],
    }),

    // Get all clients (for access management)
    getClients: builder.query({
      query: () => ({
        url: '/admin/clients',
        baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}`,
      }),
      transformResponse: (response) => response.clients || [],
    }),

    // Get folder access permissions
    getFolderAccess: builder.query({
      query: () => "/client-folder-access",
      transformResponse: (response) => response.data || [],
      providesTags: ['Reports'],
    }),

    // Grant folder access
    grantFolderAccess: builder.mutation({
      query: (body) => ({
        url: "/client-folder-access",
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reports'],
    }),

    // Revoke folder access
    revokeFolderAccess: builder.mutation({
      query: ({ clientId, folderName }) => ({
        url: `/client-folder-access/${clientId}/${folderName}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetClientFoldersQuery,
  useGetClientReportsQuery,
  useUploadReportMutation,
  useLazyDownloadReportQuery,
  useDeleteReportMutation,
  useGetClientsQuery,
  useGetFolderAccessQuery,
  useGrantFolderAccessMutation,
  useRevokeFolderAccessMutation,
} = reportsApi;
