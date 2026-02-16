import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Chip, Typography, Tooltip, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors } from "../../../../common/styles/styles";
import {
  UniversalDataGrid,
  useDataGridColumns,
} from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { useTranslation } from "react-i18next";
import { useGetLogsQuery } from "../../../../store/api/logsApi";
import { LogsViewMobile } from "./LogsViewMobil";
//import AdvancedFilters from "./AdvancedFilters";
import { AlertInline } from "../../../../common/components/ui/AlertInline";
import { useNotification } from "../../../../common/hooks";
import { formatTimestamp as formatTimestampUtil } from "../../../../common/utils/formatters";

import { LoadingProgress } from "../../../../common/components/ui/LoadingProgress";
import { useLogsTableConfig } from "./useLogsTableConfig";

export const LogsView = () => {
  const { t } = useTranslation();

  // Pagination and filter states
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterss, setFilters] = useState({
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

  // Notification hook
  const { notificationRef, showError } = useNotification();

  // Fetch logs from backend with automatic refetch on mount
  const { data, isLoading, error, refetch } = useGetLogsQuery(
    {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: "", // We'll filter on frontend
    },
    { refetchOnMountOrArgChange: true },
  );

  // Show error snackbar when error occurs
  useEffect(() => {
    if (error) {
      const errorMsg =
        error?.data?.error ||
        error?.error ||
        t("userManagement.logs.unknownError");
      showError(`${t("userManagement.logs.errorLoading")}: ${errorMsg}`);
    }
  }, [error, t]);

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

  // const logs = filteredLogs;
  // const totalRows = filteredLogs.length;
  // const locale = t("common.locale") || "en-US";

  // DataGrid columns
  // const columns = useDataGridColumns([
  //   {
  //     field: "id",
  //     headerNameKey: "userManagement.logs.eventId",
  //     width: 280,
  //   },
  //   {
  //     field: "timestamp",
  //     headerNameKey: "userManagement.logs.timestamp",
  //     width: 200,
  //     valueFormatter: (value) => formatTimestamp(value),
  //   },
  //   {
  //     field: "userId",
  //     headerNameKey: "userManagement.logs.userId",
  //     width: 100,
  //   },
  //   {
  //     field: "eventType",
  //     headerNameKey: "userManagement.logs.eventType",
  //     width: 140,
  //     renderCell: (params) => (
  //       <Chip
  //         label={params.value}
  //         color={getEventTypeColor(params.value)}
  //         size="small"
  //         variant="outlined"
  //         sx={{ marginTop: 0.5 }}
  //       />
  //     ),
  //   },
  //   {
  //     field: "entity",
  //     headerNameKey: "userManagement.logs.entity",
  //     width: 120,
  //     renderCell: (params) => (
  //       <Typography variant="body2" fontWeight={500} sx={{ marginTop: 2 }}>
  //         {params.value}
  //       </Typography>
  //     ),
  //   },
  //   {
  //     field: "description",
  //     headerNameKey: "userManagement.logs.description",
  //     flex: 1,
  //     minWidth: 300,
  //     align: "left",
  //   },
  //   {
  //     field: "ipAddress",
  //     headerNameKey: "userManagement.logs.ipAddress",
  //     width: 150,
  //     renderCell: (params) => (
  //       <Typography
  //         variant="body2"
  //         sx={{ fontFamily: "monospace", marginTop: 2 }}
  //       >
  //         {cleanIpAddress(params.value)}
  //       </Typography>
  //     ),
  //   },
  //   {
  //     field: "status",
  //     headerNameKey: "userManagement.logs.status",
  //     width: 200,
  //     renderCell: (params) => (
  //       <Chip
  //         label={params.value}
  //         variant="outlined"
  //         color={getStatusColor(params.value)}
  //         size="small"
  //       />
  //     ),
  //   },
  // ]);

  const logs = data ?? [];
  const {
    filteredLogs,
    desktopColumns,
    mobileColumns,
    mobileRows,
    renderPrimaryIcon,
    filters,
    isOpen,
    setIsOpen,
    rows,
    formatTimestamp,
    getEventTypeColor,
    getStatusColor,
    cleanIpAddress,
    emptyMessage,
    totalRows,
  } = useLogsTableConfig(logs);

  return (
    <Box sx={{ px: 3 }}>
      {/* Mobile Header with Filter Button */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: "1.1rem", color: colors.textPrimary }}
        >
          {t("userManagement.logs.label")}
        </Typography>
        <Box sx={{ position: "absolute", right: 0 }}>
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
      </Box>

      {/* Desktop Filter Button */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          alignItems: "center",
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

      {/* Desktop DataGrid */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: { md: "95%", lg: "100%" },
        }}
      >
        <UniversalDataGrid
          rows={rows}
          columns={desktopColumns}
          loading={isLoading}
          emptyMessage={t("userManagement.logs.noLogsFound") || "No logs found"}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
          autoHeight
        />
      </Box>

      {/* Mobile View */}
      <LogsViewMobile
        logs={filteredLogs}
        isLoading={isLoading}
        error={error}
        formatTimestamp={formatTimestamp}
        getEventTypeColor={getEventTypeColor}
        getStatusColor={getStatusColor}
        cleanIpAddress={cleanIpAddress}
      />

      {/* Error Snackbar */}
      <AlertInline ref={notificationRef} asSnackbar />
    </Box>
  );
};
