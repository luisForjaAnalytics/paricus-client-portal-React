import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/tickets`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Tickets", "AssignableUsers"],
  endpoints: (builder) => ({
    // GET /api/tickets/assignable-users - Get users that can be assigned tickets
    getAssignableUsers: builder.query({
      query: () => "/assignable-users",
      transformResponse: (response) => response.data || [],
      providesTags: ["AssignableUsers"],
    }),

    // GET /api/tickets - Get all tickets for user's client
    getTickets: builder.query({
      query: () => "",
      transformResponse: (response) => response.data || [],
      providesTags: ["Tickets"],
    }),

    // GET /api/tickets/:id - Get single ticket
    getTicket: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data || null,
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
    }),

    // POST /api/tickets - Create new ticket
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: "",
        method: "POST",
        body: ticketData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Tickets"],
    }),

    // PUT /api/tickets/:id - Update ticket
    updateTicket: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updates,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        "Tickets",
        { type: "Tickets", id },
      ],
    }),

    // POST /api/tickets/:id/details - Add detail/update
    addTicketDetail: builder.mutation({
      query: ({ id, detail }) => ({
        url: `/${id}/details`,
        method: "POST",
        body: { detail },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        "Tickets",
        { type: "Tickets", id },
      ],
    }),

    // DELETE /api/tickets/:id - Delete ticket
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),

    // POST /api/tickets/:id/attachments - Upload image attachment
    uploadTicketAttachment: builder.mutation({
      query: ({ ticketId, file }) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: `/${ticketId}/attachments`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { ticketId }) => [
        "Tickets",
        { type: "Tickets", id: ticketId },
      ],
    }),

    // GET /api/tickets/:ticketId/attachments/:attachmentId/url - Get attachment URL
    getAttachmentUrl: builder.query({
      query: ({ ticketId, attachmentId }) =>
        `/${ticketId}/attachments/${attachmentId}/url`,
      transformResponse: (response) => response.url,
    }),

    // DELETE /api/tickets/:ticketId/attachments/:attachmentId - Delete attachment
    deleteTicketAttachment: builder.mutation({
      query: ({ ticketId, attachmentId }) => ({
        url: `/${ticketId}/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        "Tickets",
        { type: "Tickets", id: ticketId },
      ],
    }),

    // POST /api/tickets/:ticketId/details/:detailId/attachments - Upload detail attachment
    uploadDetailAttachment: builder.mutation({
      query: ({ ticketId, detailId, file }) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: `/${ticketId}/details/${detailId}/attachments`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { ticketId }) => [
        "Tickets",
        { type: "Tickets", id: ticketId },
      ],
    }),

    // GET /api/tickets/:ticketId/details/:detailId/attachments/:attachmentId/url - Get detail attachment URL
    getDetailAttachmentUrl: builder.query({
      query: ({ ticketId, detailId, attachmentId }) =>
        `/${ticketId}/details/${detailId}/attachments/${attachmentId}/url`,
      transformResponse: (response) => response.url,
    }),

    // DELETE /api/tickets/:ticketId/details/:detailId/attachments/:attachmentId - Delete detail attachment
    deleteDetailAttachment: builder.mutation({
      query: ({ ticketId, detailId, attachmentId }) => ({
        url: `/${ticketId}/details/${detailId}/attachments/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        "Tickets",
        { type: "Tickets", id: ticketId },
      ],
    }),
  }),
});

export const {
  useGetAssignableUsersQuery,
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useAddTicketDetailMutation,
  useDeleteTicketMutation,
  useUploadTicketAttachmentMutation,
  useLazyGetAttachmentUrlQuery,
  useDeleteTicketAttachmentMutation,
  useUploadDetailAttachmentMutation,
  useLazyGetDetailAttachmentUrlQuery,
  useDeleteDetailAttachmentMutation,
} = ticketsApi;
