import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Users', 'Clients', 'Roles'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (response) => response.users || [],
      providesTags: ['Users'],
    }),

    // Create user
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    // Get all clients
    getClients: builder.query({
      query: () => "/clients",
      transformResponse: (response) => response.clients || [],
      providesTags: ['Clients'],
    }),

    // Create client
    createClient: builder.mutation({
      query: (clientData) => ({
        url: "/clients",
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: ['Clients'],
    }),

    // Update client
    updateClient: builder.mutation({
      query: ({ id, ...clientData }) => ({
        url: `/clients/${id}`,
        method: 'PUT',
        body: clientData,
      }),
      invalidatesTags: ['Clients'],
    }),

    // Delete client (deactivate)
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),

    // Get all roles
    getRoles: builder.query({
      query: () => "/roles",
      transformResponse: (response) => {
        const roles = response.roles || [];
        return roles.map((role) => ({
          id: role.id,
          client_id: role.clientId,
          role_name: role.roleName,
          description: role.description,
        }));
      },
      providesTags: ['Roles'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetRolesQuery,
} = adminApi;
