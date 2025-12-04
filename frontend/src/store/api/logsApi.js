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
          limit = 10,
          sortBy = "timestamp",
          sortOrder = "desc",
          search = "",
          eventType = "",
          entity = "",
          status = "",
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
          ...(search && { search }),
          ...(eventType && { eventType }),
          ...(entity && { entity }),
          ...(status && { status }),
        });

        return `?${queryParams.toString()}`;
      },
      transformResponse: (response) => ({
        data: response.data || [],
        pagination: response.pagination || {},
      }),
      providesTags: ["Logs"],
    }),

    // Get a specific log by ID
    getLogById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Logs", id }],
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
  useCreateLogMutation,
  useDeleteLogMutation,
} = logsApi;
