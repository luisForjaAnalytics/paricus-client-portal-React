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
    }),

    // ✅ 4. Obtener facturas del usuario actual (non-admin)
    getMyInvoices: builder.query({
      query: () => "/",
      transformResponse: (response) => ({
        invoices: response.invoices || [],
        stats: response.stats || null,
      }),
    }),
  }),
  tagTypes: ['Invoices'],
});

export const {
  useGetClientFoldersQuery,
  useGetFolderStatsQuery,
  useGetClientInvoicesAndStatsQuery,
  useGetMyInvoicesQuery,
} = invoicesApi;
