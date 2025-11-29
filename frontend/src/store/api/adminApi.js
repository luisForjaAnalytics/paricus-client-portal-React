import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Custom base query with CSRF token support
const baseQueryWithCSRF = async (args, api, extraOptions) => {
  const baseUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin`;

  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);

      // Get CSRF token from localStorage
      const csrfToken = localStorage.getItem('csrfToken');
      if (csrfToken) {
        headers.set("X-CSRF-Token", csrfToken);
      }

      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // If CSRF token is returned in response, store it
  if (result.data?.csrfToken) {
    localStorage.setItem('csrfToken', result.data.csrfToken);
  }

  // Handle CSRF errors
  if (result.error?.status === 403) {
    const errorMsg = result.error?.data?.error || '';
    const isCsrfError = errorMsg.includes('CSRF') || errorMsg.includes('csrf');

    if (isCsrfError) {
      console.log('CSRF token error detected:', errorMsg);

      // Store new token if provided in error response
      if (result.error.data?.csrfToken) {
        console.log('New CSRF token received, storing and retrying...');
        localStorage.setItem('csrfToken', result.error.data.csrfToken);

        // Retry the original request with new token
        const retryQuery = fetchBaseQuery({
          baseUrl,
          prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            headers.set("X-CSRF-Token", result.error.data.csrfToken);
            return headers;
          },
        });

        result = await retryQuery(args, api, extraOptions);
        console.log('Retry result:', result.error ? 'Failed' : 'Success');
      } else {
        console.error('No new CSRF token provided in error response');
      }
    }
  }

  return result;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithCSRF,
  tagTypes: ['Users', 'Clients', 'Roles', 'Permissions', 'RolePermissions'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (response) => response.users || [],
      providesTags: ['Users'],
      keepUnusedDataFor: 300, // 5 minutes cache
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
      keepUnusedDataFor: 300, // 5 minutes cache
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
          client_name: role.clientName,
          role_name: role.roleName,
          description: role.description,
          permissions_count: role.permissions?.length || 0,
          created_at: role.createdAt,
        }));
      },
      providesTags: ['Roles'],
      keepUnusedDataFor: 300, // 5 minutes cache
    }),

    // Create role
    createRole: builder.mutation({
      query: (roleData) => ({
        url: "/roles",
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Roles'],
    }),

    // Update role
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: ['Roles'],
    }),

    // Delete role
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles'],
    }),

    // Get all permissions
    getPermissions: builder.query({
      query: () => "/permissions",
      transformResponse: (response) => response.permissions || [],
      providesTags: ['Permissions'],
    }),

    // Get role permissions
    getRolePermissions: builder.query({
      query: (roleId) => `/roles/${roleId}/permissions`,
      transformResponse: (response) => response.permissions?.map(p => p.permissionId) || [],
      providesTags: (result, error, roleId) => [{ type: 'RolePermissions', id: roleId }],
    }),

    // Update role permissions
    updateRolePermissions: builder.mutation({
      query: ({ roleId, permissions }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'RolePermissions', id: roleId },
        'Roles',
      ],
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
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useGetRolePermissionsQuery,
  useLazyGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
} = adminApi;
