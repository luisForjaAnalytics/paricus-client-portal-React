import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesSearchApi = createApi({
  reducerPath: "articlesSearchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_INTRANET_API_URL}`,
    prepareHeaders: (headers) => {
      // API Key para autenticación externa
      headers.set("X-API-Key", `${import.meta.env.VITE_API_KEY}`);
      return headers;
    },
  }),
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
    // Obtener artículo por ID
    getArticleSearch: builder.query({
      query: (articleSearch) => `/articles/PA_US_1?search=${articleSearch}`,
      providesTags: (result, error, articleSearch) => [
        { type: "Articles", id: articleSearch },
      ],
    }),

  }),
});

export const {
  useGetArticleSearchQuery,
  useLazyGetArticleSearchQuery,
} = articlesSearchApi;
