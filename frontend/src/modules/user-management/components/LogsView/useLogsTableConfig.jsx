import { useMemo, useCallback, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { ListAlt as ListAltIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../common/styles/styles";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";
import { formatTimestamp as formatTimestampUtil } from "../../../../common/utils/formatters";

/**
 * useLogsTableConfig - Shared hook for Logs table configuration
 * Provides columns, rows transformation, filters and actions for Desktop and Mobile views.
 * Uses ColumnHeaderFilter for inline DataGrid header filters.
 */
export const useLogsTableConfig = (logs = []) => {
  const { t } = useTranslation();
  const locale = t("common.locale") || "en-US";
  const formatTimestamp = useCallback(
    (ts) => formatTimestampUtil(ts, locale),
    [locale],
  );

  // Filter state
  const [filters, setFilters] = useState({
    eventId: "",
    timestamp: "",
    userId: "",
    eventType: "",
    entity: "",
    description: "",
    ipAddress: "",
    status: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  // Handler for filter changes
  const handleFilterChange = useCallback((filterKey, value) => {
    try {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: value,
      }));
    } catch (error) {
      console.error("useLogsTableConfig handleFilterChange error:", error);
    }
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    try {
      setFilters({
        eventId: "",
        timestamp: "",
        userId: "",
        eventType: "",
        entity: "",
        description: "",
        ipAddress: "",
        status: "",
      });
    } catch (error) {
      console.error("useLogsTableConfig clearFilters error:", error);
    }
  }, []);

  // Options for select filters
  const eventTypeOptions = useMemo(
    () => [
      { name: "CREATE", value: "CREATE" },
      { name: "UPDATE", value: "UPDATE" },
      { name: "DELETE", value: "DELETE" },
      { name: "LOGIN", value: "LOGIN" },
      { name: "LOGOUT", value: "LOGOUT" },
      { name: "AUDIO_PLAYBACK", value: "AUDIO_PLAYBACK" },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { name: "SUCCESS", value: "SUCCESS" },
      { name: "FAILURE", value: "FAILURE" },
      { name: "WARNING", value: "WARNING" },
    ],
    [],
  );

  // Clean IPv6-mapped IPv4 addresses
  const cleanIpAddress = useCallback((ip) => {
    try {
      if (!ip) return "N/A";
      return ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;
    } catch (err) {
      console.error(`useLogsTableConfig cleanIpAddress: ${err}`);
      return "N/A";
    }
  }, []);

  // Status chip color
  const getStatusColor = useCallback((status) => {
    try {
      switch (status) {
        case "SUCCESS":
          return "success";
        case "FAILURE":
          return "error";
        case "WARNING":
          return "warning";
        default:
          return "default";
      }
    } catch (err) {
      console.error(`useLogsTableConfig getStatusColor: ${err}`);
      return "default";
    }
  }, []);

  // Event type chip color
  const getEventTypeColor = useCallback((eventType) => {
    try {
      switch (eventType) {
        case "CREATE":
          return "success";
        case "UPDATE":
          return "info";
        case "DELETE":
          return "error";
        case "LOGIN":
          return "primary";
        case "LOGOUT":
          return "default";
        case "AUDIO_PLAYBACK":
          return "secondary";
        default:
          return "default";
      }
    } catch (err) {
      console.error(`useLogsTableConfig getEventTypeColor: ${err}`);
      return "default";
    }
  }, []);

  // Filter logs based on filters
  const filteredLogs = useMemo(() => {
    const allLogs = logs?.logs || [];

    // If no filters are active, return all logs
    if (
      !filters.eventId &&
      !filters.userId &&
      !filters.eventType &&
      !filters.entity &&
      !filters.description &&
      !filters.ipAddress &&
      !filters.status &&
      !filters.timestamp
    ) {
      return allLogs;
    }

    return allLogs.filter((log) => {
      const matchesEventId = filters.eventId
        ? log.id?.toLowerCase().includes(filters.eventId.toLowerCase())
        : true;

      const matchesUserId = filters.userId
        ? String(log.userId)?.includes(filters.userId)
        : true;

      const matchesEventType = filters.eventType
        ? log.eventType === filters.eventType
        : true;

      const matchesEntity = filters.entity
        ? log.entity?.toLowerCase().includes(filters.entity.toLowerCase())
        : true;

      const matchesDescription = filters.description
        ? log.description
            ?.toLowerCase()
            .includes(filters.description.toLowerCase())
        : true;

      const matchesIpAddress = filters.ipAddress
        ? log.ipAddress?.includes(filters.ipAddress)
        : true;

      const matchesStatus = filters.status
        ? log.status === filters.status
        : true;

      const matchesTimestamp = filters.timestamp
        ? log.timestamp?.startsWith(filters.timestamp)
        : true;

      return (
        matchesEventId &&
        matchesUserId &&
        matchesEventType &&
        matchesEntity &&
        matchesDescription &&
        matchesIpAddress &&
        matchesStatus &&
        matchesTimestamp
      );
    });
  }, [logs?.logs, filters]);
  const rows = filteredLogs;
  const totalRows = filteredLogs.length;
  // Desktop columns with ColumnHeaderFilter
  const desktopColumns = useMemo(() => {
    try {
      return [
        {
          field: "id",
          headerName: t("userManagement.logs.eventId"),
          width: 280,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.eventId")}
              filterType="text"
              filterKey="eventId"
              filterValue={filters.eventId}
              onFilterChange={handleFilterChange}
              placeholder={t("userManagement.logs.eventId")}
              isOpen={isOpen}
            />
          ),
        },
        {
          field: "timestamp",
          headerName: t("userManagement.logs.timestamp"),
          //width: 200,
          flex: 1,
          align: "center",
          headerAlign: "center",
          valueFormatter: (value) => formatTimestamp(value),
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.timestamp")}
              filterType="date"
              filterKey="timestamp"
              filterValue={filters.timestamp}
              onFilterChange={handleFilterChange}
              isOpen={isOpen}
            />
          ),
        },
        {
          field: "userId",
          headerName: t("userManagement.logs.userId"),
          width: 140,
          //flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.userId")}
              filterType="text"
              filterKey="userId"
              filterValue={filters.userId}
              onFilterChange={handleFilterChange}
              placeholder={t("userManagement.logs.userId")}
              isOpen={isOpen}
            />
          ),
        },
        {
          field: "eventType",
          headerName: t("userManagement.logs.eventType"),
          width: 180,
          //flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.eventType")}
              filterType="select"
              filterKey="eventType"
              filterValue={filters.eventType}
              onFilterChange={handleFilterChange}
              options={eventTypeOptions}
              labelKey="name"
              valueKey="value"
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => (
            <Chip
              label={params.value}
              color={getEventTypeColor(params.value)}
              size="small"
              variant="outlined"
              sx={{ marginTop: 0.5 }}
            />
          ),
        },
        {
          field: "entity",
          headerName: t("userManagement.logs.entity"),
          //width: 120,
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.entity")}
              filterType="text"
              filterKey="entity"
              filterValue={filters.entity}
              onFilterChange={handleFilterChange}
              placeholder={t("userManagement.logs.entity")}
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => (
            <Typography variant="body2" fontWeight={500} sx={{ marginTop: 2 }}>
              {params.value}
            </Typography>
          ),
        },
        {
          field: "description",
          headerName: t("userManagement.logs.description"),
          flex: 1,
          //minWidth: 300,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.description")}
              filterType="text"
              filterKey="description"
              filterValue={filters.description}
              onFilterChange={handleFilterChange}
              placeholder={t("userManagement.logs.description")}
              isOpen={isOpen}
            />
          ),
        },
        {
          field: "ipAddress",
          headerName: t("userManagement.logs.ipAddress"),
          //width: 150,
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.ipAddress")}
              filterType="text"
              filterKey="ipAddress"
              filterValue={filters.ipAddress}
              onFilterChange={handleFilterChange}
              placeholder={t("userManagement.logs.ipAddress")}
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => (
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", marginTop: 2 }}
            >
              {cleanIpAddress(params.value)}
            </Typography>
          ),
        },
        {
          field: "status",
          headerName: t("userManagement.logs.status"),
          //width: 160,
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("userManagement.logs.status")}
              filterType="select"
              filterKey="status"
              filterValue={filters.status}
              onFilterChange={handleFilterChange}
              options={statusOptions}
              labelKey="name"
              valueKey="value"
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => (
            <Chip
              label={params.value}
              variant="outlined"
              color={getStatusColor(params.value)}
              size="small"
            />
          ),
        },
        // {
        //   field: "actions",
        //   headerName: t("common.actions"),
        //   width: 100,
        //   align: "center",
        //   headerAlign: "center",
        //   sortable: false,
        //   renderHeader: () => (
        //     <ColumnHeaderFilter
        //       headerName={t("common.actions")}
        //       filterType="actions"
        //       isOpen={isOpen}
        //       onClearFilters={clearFilters}
        //     />
        //   ),
        //   renderCell: () => null,
        // },
      ];
    } catch (error) {
      console.error("useLogsTableConfig desktopColumns error:", error);
      return [];
    }
  }, [
    t,
    filters,
    handleFilterChange,
    isOpen,
    eventTypeOptions,
    statusOptions,
    clearFilters,
    formatTimestamp,
    getEventTypeColor,
    getStatusColor,
    cleanIpAddress,
  ]);

  // Mobile columns
  const mobileColumns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("userManagement.logs.eventId"),
        labelWidth: 100,
        renderCell: ({ value }) => (
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        field: "formattedTimestamp",
        headerName: t("userManagement.logs.timestamp"),
        labelWidth: 100,
      },
      {
        field: "userId",
        headerName: t("userManagement.logs.userId"),
        labelWidth: 100,
      },
      {
        field: "eventType",
        headerName: t("userManagement.logs.eventType"),
        labelWidth: 100,
        renderCell: ({ value }) => (
          <Chip
            label={value}
            color={getEventTypeColor(value)}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        field: "entity",
        headerName: t("userManagement.logs.entity"),
        labelWidth: 100,
        renderCell: ({ value }) => (
          <Typography variant="body2" fontWeight={500}>
            {value}
          </Typography>
        ),
      },
      {
        field: "description",
        headerName: t("userManagement.logs.description"),
        labelWidth: 100,
      },
      {
        field: "formattedIpAddress",
        headerName: t("userManagement.logs.ipAddress"),
        labelWidth: 100,
        renderCell: ({ value }) => (
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {value}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: t("userManagement.logs.status"),
        labelWidth: 100,
        renderCell: ({ value }) => (
          <Chip
            label={value}
            variant="outlined"
            color={getStatusColor(value)}
            size="small"
          />
        ),
      },
    ],
    [t, getEventTypeColor, getStatusColor],
  );

  // Mobile rows (add formatted fields)
  const mobileRows = useMemo(
    () =>
      filteredLogs.map((log) => ({
        ...log,
        formattedTimestamp: formatTimestamp(log.timestamp),
        formattedIpAddress: cleanIpAddress(log.ipAddress),
      })),
    [filteredLogs, formatTimestamp, cleanIpAddress],
  );

  // Mobile primary icon
  const renderPrimaryIcon = <ListAltIcon fontSize="small" sx={{ color: colors.primary }} />;

  return {
    filteredLogs,
    desktopColumns,
    mobileColumns,
    mobileRows,
    renderPrimaryIcon,
    filters,
    isOpen,
    totalRows,
    rows,
    setIsOpen,
    handleFilterChange,
    clearFilters,
    formatTimestamp,
    getEventTypeColor,
    getStatusColor,
    cleanIpAddress,
    emptyMessage: t("userManagement.logs.noLogsFound") || "No logs found",
  };
};
