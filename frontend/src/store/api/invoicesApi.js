import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const invoicesApi = createApi({
  reducerPath: "invoicesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/invoices`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ✅ 1. Obtener carpetas del cliente
    getClientFolders: builder.query({
      query: () => "/client-folders",
    }),

    // ✅ 2. Obtener estadísticas de una carpeta
    getFolderStats: builder.query({
      query: (folder) => `/stats/${folder}`,
      transformResponse: (data, meta, folder) => ({
        folder,
        folderDisplay: folder
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        hasAccess: true,
        ...data.stats,
      }),
    }),

    // ✅ 3. Obtener facturas y estadísticas del cliente
    getClientInvoicesAndStats: builder.query({
      async queryFn(clientFolder, _queryApi, _extraOptions, baseQuery) {
        try {
          // Llamadas paralelas
          const [invoices, stats] = await Promise.all([
            baseQuery(`/client/${clientFolder}`),
            baseQuery(`/stats/${clientFolder}`),
          ]);

          if (invoices.error) throw invoices.error;
          if (stats.error) throw stats.error;

          return {
            data: {
              invoices: invoices.data.invoices || [],
              stats: stats.data.stats || null,
            },
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Invoices'],
    }),

    // ✅ 4. Obtener facturas del usuario actual (non-admin)
    getMyInvoices: builder.query({
      query: () => "/",
      transformResponse: (response) => ({
        invoices: response.invoices || [],
        stats: response.stats || null,
      }),
      providesTags: ['Invoices'],
    }),

    // Upload invoice
    uploadInvoice: builder.mutation({
      query: ({ clientFolder, formData }) => ({
        url: `/upload/${clientFolder}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Invoices'],
    }),

    // Update invoice
    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Invoices'],
    }),

    // Delete invoice
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoices'],
    }),

    // Update payment link
    updatePaymentLink: builder.mutation({
      query: ({ id, paymentLink }) => ({
        url: `/payment-link/${id}`,
        method: 'PUT',
        body: { paymentLink },
      }),
      invalidatesTags: ['Invoices'],
    }),

    // Get download URL
    getDownloadUrl: builder.query({
      query: ({ clientFolder, fileName }) => `/download/${clientFolder}/${fileName}`,
    }),
    // Get all clients data (admin - loads all folders and stats)
    getAllClientsData: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        try {
          // Get folders first
          const foldersResponse = await baseQuery('/client-folders');
          if (foldersResponse.error) throw foldersResponse.error;

          const folders = foldersResponse.data.folders || [];

          // Get stats for each folder
          const statsPromises = folders.map((folder) =>
            baseQuery(`/stats/${folder}`)
              .then((res) => ({
                folder,
                folderDisplay: folder
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                hasAccess: true,
                ...res.data.stats,
              }))
              .catch((err) => {
                if (err.status === 404) {
                  console.warn(`Client folder ${folder} not properly configured`);
                  return null;
                }
                return {
                  folder,
                  folderDisplay: folder
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                  hasAccess: true,
                  totalRevenue: 0,
                  outstandingBalance: 0,
                  overdueAmount: 0,
                  totalInvoices: 0,
                  paidCount: 0,
                  unpaidCount: 0,
                  overdueCount: 0,
                };
              })
          );

          const allStats = await Promise.all(statsPromises);
          const validStats = allStats.filter((stat) => stat !== null);

          const overall = {
            totalRevenue: validStats.reduce((sum, client) => sum + (client.totalRevenue || 0), 0),
            outstandingBalance: validStats.reduce((sum, client) => sum + (client.outstandingBalance || 0), 0),
            overdueAmount: validStats.reduce((sum, client) => sum + (client.overdueAmount || 0), 0),
            totalClients: validStats.length,
            totalInvoices: validStats.reduce((sum, client) => sum + (client.totalInvoices || 0), 0),
            totalPaidInvoices: validStats.reduce((sum, client) => sum + (client.paidCount || 0), 0),
            totalUnpaidInvoices: validStats.reduce((sum, client) => sum + (client.unpaidCount || 0), 0),
            totalOverdueInvoices: validStats.reduce((sum, client) => sum + (client.overdueCount || 0), 0),
          };

          return {
            data: {
              folders,
              clientBreakdowns: validStats,
              overallStats: overall,
            },
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Invoices'],
    }),
  }),
  tagTypes: ['Invoices'],
});

export const {
  useGetClientFoldersQuery,
  useGetFolderStatsQuery,
  useGetClientInvoicesAndStatsQuery,
  useGetMyInvoicesQuery,
  useGetAllClientsDataQuery,
  useUploadInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdatePaymentLinkMutation,
  useGetDownloadUrlQuery,
  useLazyGetDownloadUrlQuery,
} = invoicesApi;
