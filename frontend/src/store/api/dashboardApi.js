import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DashboardStats", "RecentRecordings", "Announcements"],
  endpoints: (builder) => ({
    // Get dashboard stats
    // Optional clientId param for BPO Admin to view specific client's data
    getDashboardStats: builder.query({
      query: (clientId) => ({
        url: "/stats",
        params: clientId ? { clientId } : undefined,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, clientId) => [
        { type: "DashboardStats", id: clientId || "ALL" },
      ],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get recent recordings (last 3)
    getRecentRecordings: builder.query({
      query: () => "/recent-recordings",
      transformResponse: (response) => response.data || [],
      providesTags: ["RecentRecordings"],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // DEPRECATED: Articles now come from external API (articlesApi)
    // Get recent articles (last 3)
    /*
    getRecentArticles: builder.query({
      query: () => "/recent-articles",
      transformResponse: (response) => response.data || [],
      providesTags: ["RecentArticles"],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    */

    // Refresh dashboard stats manually
    refreshDashboardStats: builder.mutation({
      query: () => "/stats",
      invalidatesTags: ["DashboardStats"],
    }),

    // ========================================
    // ANNOUNCEMENTS ENDPOINTS
    // ========================================

    // Get all announcements (filtered by user role on backend)
    getAnnouncements: builder.query({
      query: () => "/announcements",
      transformResponse: (response) => response.data || [],
      providesTags: ["Announcements"],
      // Cache for 2 minutes
      keepUnusedDataFor: 120,
    }),

    // Get single announcement by ID
    getAnnouncement: builder.query({
      query: (id) => `/announcements/${id}`,
      transformResponse: (response) => response.data || null,
      providesTags: (result, error, id) => [{ type: "Announcements", id }],
    }),

    // Create announcement (BPO Admin only)
    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcements"],
    }),

    // Delete announcement (BPO Admin only)
    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentRecordingsQuery,
  useRefreshDashboardStatsMutation,
  useGetAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = dashboardApi;
