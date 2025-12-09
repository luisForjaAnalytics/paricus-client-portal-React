import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const logsApi = createApi({
  reducerPath: "logsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/logs`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Logs"],
  endpoints: (builder) => ({
    // Get all logs with pagination and filtering
    getLogs: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 50,
          userId = "",
          eventType = "",
          entity = "",
          status = "",
          startDate = "",
          endDate = "",
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(userId && { userId }),
          ...(eventType && { eventType }),
          ...(entity && { entity }),
          ...(status && { status }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });

        return `?${queryParams.toString()}`;
      },
      transformResponse: (response) => ({
        logs: response.logs || [],
        pagination: response.pagination || {},
      }),
      providesTags: ["Logs"],
    }),

    // Get a specific log by ID
    getLogById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.log,
      providesTags: (result, error, id) => [{ type: "Logs", id }],
    }),

    // Get log statistics
    getLogStats: builder.query({
      query: () => "/stats",
      transformResponse: (response) => response.stats,
    }),

    // Cleanup old logs
    cleanupLogs: builder.mutation({
      query: (days) => ({
        url: `/cleanup/${days}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Logs"],
    }),

    // Create a new log
    createLog: builder.mutation({
      query: (logData) => ({
        url: "",
        method: "POST",
        body: logData,
      }),
      invalidatesTags: ["Logs"],
    }),

    // Delete a log
    deleteLog: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Logs"],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogByIdQuery,
  useGetLogStatsQuery,
  useCreateLogMutation,
  useDeleteLogMutation,
  useCleanupLogsMutation,
} = logsApi;
