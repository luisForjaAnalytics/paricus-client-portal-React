import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// All available KB prefixes (for BPO Admin to query all)
const ALL_KB_PREFIXES = ["PA_US_1", "PA_US_2", "PA_US_3", "PA_US_4"];

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
  tagTypes: ["ArticlesSearch"],
  endpoints: (builder) => ({
    // Buscar artículos (requires kbPrefix and search term)
    getArticleSearch: builder.query({
      async queryFn({ kbPrefix, search }, _queryApi, _extraOptions, fetchWithBQ) {
        if (!search?.trim()) {
          return { data: [] };
        }

        // If kbPrefix is null (BPO Admin), search in all prefixes
        if (!kbPrefix) {
          try {
            const results = await Promise.all(
              ALL_KB_PREFIXES.map((prefix) =>
                fetchWithBQ(`/articles/${prefix}?search=${encodeURIComponent(search)}`)
              )
            );

            // Combine all search results from all prefixes
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

        // For regular clients, search in their specific prefix
        const result = await fetchWithBQ(
          `/articles/${kbPrefix}?search=${encodeURIComponent(search)}`
        );
        if (result.error) return { error: result.error };

        // Add the prefix to each article
        const articles = (result.data || []).map((article) => ({
          ...article,
          kbPrefix,
        }));

        return { data: articles };
      },
      providesTags: (result, error, { search }) => [
        { type: "ArticlesSearch", id: search },
      ],
    }),
  }),
});

export const {
  useGetArticleSearchQuery,
  useLazyGetArticleSearchQuery,
} = articlesSearchApi;
