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
    getArticleById: builder.query({
      query: (articleId) => `/articles/PA_US_1/${articleId}`,
      providesTags: (result, error, articleId) => [
        { type: "Articles", id: articleId },
      ],
    }),

    // Obtener todos los artículos (si el endpoint lo soporta)
    getAllArticles: builder.query({
      query: () => "/articles/PA_US_1",
      providesTags: ["Articles"],
    }),
  }),
});

export const {
  useGetArticleByIdQuery,
  useLazyGetArticleByIdQuery,
  useGetAllArticlesQuery,
  useLazyGetAllArticlesQuery,
} = articlesSearchApi;
