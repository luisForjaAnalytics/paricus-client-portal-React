import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const carouselApi = createApi({
  reducerPath: "carouselApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/carousel`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["CarouselImages"],
  endpoints: (builder) => ({
    // Get all carousel images
    getCarouselImages: builder.query({
      query: () => "/",
      transformResponse: (response) => response.data || [],
      providesTags: ["CarouselImages"],
      keepUnusedDataFor: 300,
    }),

    // Save carousel images (FormData with files + slotIndices)
    saveCarouselImages: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CarouselImages"],
    }),

    // Delete a carousel image
    deleteCarouselImage: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CarouselImages"],
    }),
  }),
});

export const {
  useGetCarouselImagesQuery,
  useSaveCarouselImagesMutation,
  useDeleteCarouselImageMutation,
} = carouselApi;
