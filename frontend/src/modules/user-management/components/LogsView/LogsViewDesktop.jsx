import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon } from "@mui/icons-material";
import { colors, typography, card } from "../../../../common/styles/styles";
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
        ? log.description?.toLowerCase().includes(filters.description.toLowerCase())
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
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("userManagement.logs.eventId"),
        width: 280,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "timestamp",
        headerName: t("userManagement.logs.timestamp"),
        width: 200,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) => formatTimestamp(value),
      },
      {
        field: "userId",
        headerName: t("userManagement.logs.userId"),
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "eventType",
        headerName: t("userManagement.logs.eventType"),
        width: 140,
        align: "center",
        headerAlign: "center",
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
        width: 120,
        align: "center",
        headerAlign: "center",
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
        minWidth: 300,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "ipAddress",
        headerName: t("userManagement.logs.ipAddress"),
        width: 150,
        align: "center",
        headerAlign: "center",
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
        width: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
          />
        ),
      },
    ],
    [t, formatTimestamp, getEventTypeColor, cleanIpAddress, getStatusColor]
  );

  return (
    <Box sx={{ px: 3 }}>
      {/* Header with Search */}
      <Card
        sx={{
          display: { xs: "none", md: "block" },
          padding: "0 2rem 0 2rem",
          mb: 3,
          width: "100%",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
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
        </CardContent>
      </Card>

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
        <DataGrid
          rows={logs}
          columns={columns}
          loading={isLoading}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            ...card,
            padding: "0 0 0 0",
            border: `1px solid ${colors.border}`,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.background} !important`,
              borderBottom: `2px solid ${colors.border}`,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: `${colors.background} !important`,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: typography.fontWeight.bold,
              textTransform: "uppercase",
              fontSize: typography.fontSize.tableHeader,
              fontFamily: typography.fontFamily,
              color: colors.textMuted,
              letterSpacing: "0.05em",
            },
            "& .MuiDataGrid-sortIcon": {
              color: colors.primary,
            },
            "& .MuiDataGrid-columnHeader--sorted": {
              backgroundColor: `${colors.primaryLight} !important`,
            },
            "& .MuiDataGrid-filler": {
              backgroundColor: `${colors.background} !important`,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.border}`,
              fontSize: typography.fontSize.body,
              fontFamily: typography.fontFamily,
              color: colors.textPrimary,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.background,
            },
          }}
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
