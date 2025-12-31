import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Chip,
  Typography,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  colors,
} from "../../../../common/styles/styles";
import { UniversalDataGrid, useDataGridColumns } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { useTranslation } from "react-i18next";
import { useGetLogsQuery } from "../../../../store/api/logsApi";
import { useDispatch } from "react-redux";
import { logsApi } from "../../../../store/api/logsApi";
import { LogsViewMobile } from "./LogsViewMobil";
import AdvancedFilters from "./AdvancedFilters";

export const LogsView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Pagination and filter states
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState({
    eventId: "",
    userId: "",
    eventType: "",
    entity: "",
    description: "",
    ipAddress: "",
    status: "",
    timestamp: "",
  });

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

  // Fetch logs from backend
  const { data, isLoading, error, refetch } = useGetLogsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: "", // We'll filter on frontend
  });

  // Invalidate logs cache when component mounts to force fresh data
  useEffect(() => {
    // Invalidate the logs cache to force a refetch
    dispatch(logsApi.util.invalidateTags(["Logs"]));
  }, [dispatch]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      eventId: "",
      userId: "",
      eventType: "",
      entity: "",
      description: "",
      ipAddress: "",
      status: "",
      timestamp: "",
    });
  };

  // Filter logs based on advanced filters
  const filteredLogs = useMemo(() => {
    const allLogs = data?.logs || [];

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
  }, [data?.logs, filters]);

  const logs = filteredLogs;
  const totalRows = filteredLogs.length;

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const locale = t("common.locale") || "en-US";
      const date = new Date(timestamp);
      return date.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (err) {
      console.log(`ERROR formatTimestamp: ${err}`);
      return timestamp;
    }
  };

  // Clean IPv6-mapped IPv4 addresses
  const cleanIpAddress = (ip) => {
    try {
      if (!ip) return "N/A";
      // Remove ::ffff: prefix if present
      return ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;
    } catch (err) {
      console.log(`ERROR cleanIpAddress: ${err}`);
      return "N/A";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
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
      console.log(`ERROR getStatusColor: ${err}`);
      return "default";
    }
  };

  // Get event type color
  const getEventTypeColor = (eventType) => {
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
      console.log(`ERROR getEventTypeColor: ${err}`);
      return "default";
    }
  };

  // DataGrid columns
  const columns = useDataGridColumns([
    {
      field: "id",
      headerNameKey: "userManagement.logs.eventId",
      width: 280,
    },
    {
      field: "timestamp",
      headerNameKey: "userManagement.logs.timestamp",
      width: 200,
      valueFormatter: (value) => formatTimestamp(value),
    },
    {
      field: "userId",
      headerNameKey: "userManagement.logs.userId",
      width: 100,
    },
    {
      field: "eventType",
      headerNameKey: "userManagement.logs.eventType",
      width: 140,
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
      headerNameKey: "userManagement.logs.entity",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500} sx={{ marginTop: 2 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "description",
      headerNameKey: "userManagement.logs.description",
      flex: 1,
      minWidth: 300,
      align: "left",
    },
    {
      field: "ipAddress",
      headerNameKey: "userManagement.logs.ipAddress",
      width: 150,
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
      headerNameKey: "userManagement.logs.status",
      width: 200,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
  ]);

  // Toolbar component for logs table with filter button
  const LogsToolbar = useMemo(() => {
    return () => (
      <>
        {isOpen && (
          <Box
            sx={{
              padding: "0.2rem 0 1rem 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.subSectionBackground,
              borderBottom: `1px solid ${colors.subSectionBorder}`,
            }}
          >
            <AdvancedFilters
              filters={filters}
              setFilters={setFilters}
              refetch={refetch}
              isDebouncing={false}
              loading={isLoading}
              clearFilters={clearFilters}
            />
          </Box>
        )}
      </>
    );
  }, [t, totalRows, isOpen, filters, isLoading]);

  return (
    <Box sx={{ px: 3 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("userManagement.logs.errorLoading")}:{" "}
          {error?.data?.error ||
            error?.error ||
            t("userManagement.logs.unknownError")}
        </Alert>
      )}

      {/* DataGrid */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          minHeight: "auto",
          width: "100%",
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 1,
            marginRight: 2,
          }}
        >
          <Tooltip title={t("userManagement.logs.filters")}>
            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              size="small"
              sx={{
                backgroundColor: colors?.backgroundOpenSubSection,
              }}
            >
              <FilterListIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>
        <UniversalDataGrid
          rows={logs}
          columns={columns}
          loading={isLoading}
          emptyMessage={t("userManagement.logs.noLogsFound") || "No logs found"}
          slots={{ toolbar: LogsToolbar }}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          autoHeight
        />
      </Box>

      {/* Mobile View */}
      <LogsViewMobile
        logs={logs}
        isLoading={isLoading}
        error={error}
        formatTimestamp={formatTimestamp}
        getEventTypeColor={getEventTypeColor}
        getStatusColor={getStatusColor}
        cleanIpAddress={cleanIpAddress}
      />
    </Box>
  );
};
