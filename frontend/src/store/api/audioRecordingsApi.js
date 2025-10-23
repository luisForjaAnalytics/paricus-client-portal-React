import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const audioRecordingsApi = createApi({
  reducerPath: "audioRecordingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/audio-recordings`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['AudioRecordings'],
  // Keep cached data for 3 minutes after component unmounts
  keepUnusedDataFor: 180,
  endpoints: (builder) => ({
    // Get audio recordings with filters and pagination
    getAudioRecordings: builder.query({
      query: (params = {}) => ({
        url: "",
        params: {
          page: params.page || 1,
          limit: params.limit || 25,
          ...(params.interactionId && { interactionId: params.interactionId }),
          ...(params.customerPhone && { customerPhone: params.customerPhone }),
          ...(params.agentName && { agentName: params.agentName }),
          ...(params.callType && { callType: params.callType }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.company && { company: params.company }),
          ...(params.hasAudio !== null && { hasAudio: params.hasAudio }),
        },
      }),
      transformResponse: (response) => ({
        data: response.data || [],
        totalCount: response.pagination?.totalCount || 0,
      }),
      providesTags: ['AudioRecordings'],
    }),

    // Get call types for filters
    getCallTypes: builder.query({
      query: () => "/filters/call-types",
      transformResponse: (response) => response.data || [],
    }),

    // Get audio URL for a specific recording
    getAudioUrl: builder.query({
      query: (interactionId) => `/${interactionId}/audio-url`,
      transformResponse: (response) => response.audioUrl,
    }),
  }),
});

export const {
  useGetAudioRecordingsQuery,
  useGetCallTypesQuery,
  useLazyGetAudioUrlQuery,
} = audioRecordingsApi;
