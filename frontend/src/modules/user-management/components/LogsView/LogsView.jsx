import { useState, useMemo, useEffect } from "react";
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

export const LogsView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Pagination and filter states
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch logs from backend
  const { data, isLoading, error } = useGetLogsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch,
  });

  // Invalidate logs cache when component mounts to force fresh data
  useEffect(() => {
    // Invalidate the logs cache to force a refetch
    dispatch(logsApi.util.invalidateTags(["Logs"]));
  }, [dispatch]);

  const logs = data?.data || [];
  const totalRows = data?.pagination?.totalCount || 0;

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
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
  };

  // Get event type color
  const getEventTypeColor = (eventType) => {
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
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Event ID",
        width: 280,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "timestamp",
        headerName: "Timestamp",
        width: 200,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) => formatTimestamp(value),
      },
      {
        field: "userId",
        headerName: "User ID",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "eventType",
        headerName: "Event Type",
        width: 140,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={getEventTypeColor(params.value)}
            size="small"
            variant="outlined"
          />
        ),
      },
      {
        field: "entity",
        headerName: "Entity",
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        minWidth: 300,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "ipAddress",
        headerName: "IP Address",
        width: 150,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {params.value || "N/A"}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
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
    []
  );

  return (
    <Box sx={{ px: 3 }}>
      {/* Header with Search */}
      <Card
        sx={{
          display: { xs: "none", md: "block" },
          padding: "0 2rem 0 2rem",
          mb: 3,
          width:'100%'
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
            <TextField
              sx={{ flex: 1 }}
              label="Search Logs"
              placeholder="Search by ID, user, event, entity, description, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading logs:{" "}
          {error?.data?.error || error?.error || "Unknown error"}
        </Alert>
      )}

      {/* DataGrid */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
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
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.background,
            },
          }}
        />
      </Box>
    </Box>
  );
};
