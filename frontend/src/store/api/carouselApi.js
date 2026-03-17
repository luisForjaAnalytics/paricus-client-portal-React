import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";

export const carouselApi = createApi({
  reducerPath: "carouselApi",
  baseQuery: createBaseQuery("/carousel"),
  tagTypes: ["CarouselImages"],
  endpoints: (builder) => ({
    // Get carousel images (optionally filtered by clientId)
    getCarouselImages: builder.query({
      query: (clientId) => ({
        url: "/",
        params: clientId != null ? { clientId } : {},
      }),
      transformResponse: (response) => response.data || [],
      providesTags: (result, error, clientId) => [
        { type: "CarouselImages", id: clientId ?? "GLOBAL" },
      ],
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
