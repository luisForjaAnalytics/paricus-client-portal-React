import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// All available KB prefixes (for BPO Admin to query all)
const ALL_KB_PREFIXES = ["PA_US_1", "PA_US_2", "PA_US_3", "PA_US_4"];

export const articlesApi = createApi({
  reducerPath: "articlesApi",
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
    // Obtener artículo por ID (requires kbPrefix and articleId)
    getArticleById: builder.query({
      query: ({ kbPrefix, articleId }) => `/articles/${kbPrefix}/${articleId}`,
      providesTags: (result, error, { articleId }) => [
        { type: "Articles", id: articleId },
      ],
    }),

    // Obtener todos los artículos para un cliente específico
    getAllArticles: builder.query({
      async queryFn(kbPrefix, _queryApi, _extraOptions, fetchWithBQ) {
        // If kbPrefix is null (BPO Admin), fetch from all prefixes
        if (!kbPrefix) {
          try {
            const results = await Promise.all(
              ALL_KB_PREFIXES.map((prefix) =>
                fetchWithBQ(`/articles/${prefix}`)
              )
            );

            // Combine all articles from all prefixes
            const allArticles = results.flatMap((result, index) => {
              if (result.error) return [];
              const articles = result.data || [];
              // Add the prefix to each article so we know which client it belongs to
              return articles.map((article) => ({
                ...article,
                kbPrefix: ALL_KB_PREFIXES[index],
              }));
            });

            return { data: allArticles };
          } catch (error) {
            return { error: { status: 500, data: error.message } };
          }
        }

        // For regular clients, fetch from their specific prefix
        const result = await fetchWithBQ(`/articles/${kbPrefix}`);
        if (result.error) return { error: result.error };

        // Add the prefix to each article
        const articles = (result.data || []).map((article) => ({
          ...article,
          kbPrefix,
        }));

        return { data: articles };
      },
      providesTags: ["Articles"],
    }),
  }),
});

export const {
  useGetArticleByIdQuery,
  useLazyGetArticleByIdQuery,
  useGetAllArticlesQuery,
  useLazyGetAllArticlesQuery,
} = articlesApi;
