import { useState, useEffect } from "react";
import {
  useGetAudioRecordingsQuery,
  useGetCallTypesQuery,
  usePrefetch,
} from "../../../store/api/audioRecordingsApi";

/**
 * Custom hook for audio recordings data and filters
 * Handles all data fetching, filtering, and pagination logic
 */
export const useAudioRecordings = () => {
  // Filters - Internal state for immediate UI updates
  const [filters, setFilters] = useState({
    interactionId: "",
    customerPhone: "",
    agentName: "",
    callType: "",
    startDate: "",
    endDate: "",
    company: null,
    hasAudio: "true",
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State
  const [error, setError] = useState(null);
  const [dbConfigured, setDbConfigured] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce filter changes for text fields
  useEffect(() => {
    const textFields = {
      interactionId: filters.interactionId,
      customerPhone: filters.customerPhone,
      agentName: filters.agentName,
      callType: filters.callType,
      startDate: filters.startDate,
      endDate: filters.endDate,
    };

    const hasTextInput =
      filters.interactionId || filters.customerPhone || filters.agentName;
    if (hasTextInput) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      setDebouncedFilters((prev) => ({
        ...prev,
        ...textFields,
      }));
      setIsDebouncing(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [
    filters.interactionId,
    filters.customerPhone,
    filters.agentName,
    filters.callType,
    filters.startDate,
    filters.endDate,
  ]);

  // Update company filter immediately (no debounce)
  useEffect(() => {
    setDebouncedFilters((prev) => ({ ...prev, company: filters.company }));
  }, [filters.company]);

  // Update hasAudio filter immediately (no debounce)
  useEffect(() => {
    setDebouncedFilters((prev) => ({ ...prev, hasAudio: filters.hasAudio }));
  }, [filters.hasAudio]);

  // RTK Query hooks
  const {
    data: recordingsData,
    isLoading: loading,
    error: apiError,
    refetch,
  } = useGetAudioRecordingsQuery(
    {
      page,
      limit: itemsPerPage,
      ...debouncedFilters,
    },
    {
      refetchOnMountOrArgChange: 600,
      refetchOnFocus: true,
      refetchOnReconnect: false,
    },
  );

  // Lazy load call types only when dropdown is opened
  const [loadCallTypes, setLoadCallTypes] = useState(false);
  const { data: callTypes = [] } = useGetCallTypesQuery(undefined, {
    refetchOnMountOrArgChange: false,
    skip: !loadCallTypes,
  });

  const prefetchAudioRecordings = usePrefetch("getAudioRecordings");

  // Extract data from query
  const recordings = recordingsData?.data || [];
  const totalCount = recordingsData?.totalCount || 0;

  // Computed values
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      if (apiError.status === 503) {
        setDbConfigured(false);
        setError("Database not configured. Please contact your administrator.");
      } else {
        setError(apiError.data?.message || "Failed to load recordings");
      }
    } else {
      setError(null);
      setDbConfigured(true);
    }
  }, [apiError]);

  const clearFilters = () => {
    setFilters({
      interactionId: "",
      customerPhone: "",
      agentName: "",
      callType: "",
      startDate: "",
      endDate: "",
      company: null,
      hasAudio: null,
    });
    setPage(1);
  };

  const setCompanyFilter = (company) => {
    setFilters((prev) => ({ ...prev, company }));
    setPage(1);
  };

  const setAudioFilter = (hasAudio) => {
    setFilters((prev) => ({ ...prev, hasAudio }));
    setPage(1);
  };

  const getCallTypeColor = (callType) => {
    const types = {
      inbound: "info",
      outbound: "success",
      internal: "warning",
      missed: "error",
    };
    return types[callType?.toLowerCase()] || "default";
  };

  return {
    // Data
    recordings,
    totalCount,
    totalPages,
    callTypes,

    // State
    loading,
    error,
    setError,
    dbConfigured,
    isDebouncing,
    isOpen,
    setIsOpen,

    // Filters
    filters,
    setFilters,
    setLoadCallTypes,

    // Pagination
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,

    // Actions
    refetch,
    clearFilters,
    setCompanyFilter,
    setAudioFilter,

    // Utilities
    getCallTypeColor,
  };
};
