import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.test.intranet.paricus.com/api/v1/external",
    prepareHeaders: (headers) => {
      // API Key para autenticación externa
      headers.set("X-API-Key", "7b30ceff1bada39f5421788849af77a18a22d3862f03395793ccd3f29a6c5897");
      return headers;
    },
  }),
  tagTypes: ['Articles'],
  endpoints: (builder) => ({
    // Obtener artículo por ID
    getArticleById: builder.query({
      query: (articleId) => `/articles/PA_US_1/${articleId}`,
      providesTags: (result, error, articleId) => [{ type: 'Articles', id: articleId }],
    }),

    // Obtener todos los artículos (si el endpoint lo soporta)
    getAllArticles: builder.query({
      query: () => "/articles/PA_US_1",
      providesTags: ['Articles'],
    }),
  }),
});

export const {
  useGetArticleByIdQuery,
  useLazyGetArticleByIdQuery,
  useGetAllArticlesQuery,
  useLazyGetAllArticlesQuery,
} = articlesApi;
