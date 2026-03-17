import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Creates an authenticated base query for internal API endpoints.
 * Automatically attaches the JWT token from auth state.
 * @param {string} endpoint - API path segment (e.g., "/admin", "/invoices")
 */
export const createBaseQuery = (endpoint = "") =>
  fetchBaseQuery({
    baseUrl: `${API_URL}${endpoint}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  });
