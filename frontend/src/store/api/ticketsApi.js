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
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
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

    // POST /api/tickets/:id/descriptions - Add description/comment
    addTicketDescription: builder.mutation({
      query: ({ id, description }) => ({
        url: `/${id}/descriptions`,
        method: "POST",
        body: { description },
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
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useAddTicketDescriptionMutation,
  useDeleteTicketMutation,
} = ticketsApi;
