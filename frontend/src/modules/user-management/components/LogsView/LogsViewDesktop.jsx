import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors } from "../../../../common/styles/styles";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { useTranslation } from "react-i18next";
import { useGetLogsQuery } from "../../../../store/api/logsApi";
import { LogsViewMobile } from "./LogsViewMobil";
import { AlertInline } from "../../../../common/components/ui/AlertInline";
import { useNotification } from "../../../../common/hooks";
import { MobileFilterPanel } from "../../../../common/components/ui/MobileFilterPanel";
import { useLogsTableConfig } from "./useLogsTableConfig";

export const LogsView = () => {
  const { t } = useTranslation();

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Notification hook
  const { notificationRef, showError } = useNotification();

  // Fetch logs from backend with automatic refetch on mount
  const { data, isLoading, error, refetch } = useGetLogsQuery(
    {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: "",
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
    handleFilterChange,
    clearFilters,
    rows,
    formatTimestamp,
    getEventTypeColor,
    getStatusColor,
    cleanIpAddress,
    emptyMessage,
    totalRows,
  } = useLogsTableConfig(logs);

  // Mobile filter config
  const mobileFilterConfig = useMemo(
    () => [
      {
        key: "eventId",
        label: t("userManagement.logs.eventId"),
        type: "text",
        value: filters.eventId,
      },
      {
        key: "timestamp",
        label: t("userManagement.logs.timestamp"),
        type: "date",
        value: filters.timestamp,
      },
      {
        key: "userId",
        label: t("userManagement.logs.userId"),
        type: "text",
        value: filters.userId,
      },
      {
        key: "eventType",
        label: t("userManagement.logs.eventType"),
        type: "select",
        value: filters.eventType,
        options: [
          { label: "CREATE", value: "CREATE" },
          { label: "UPDATE", value: "UPDATE" },
          { label: "DELETE", value: "DELETE" },
          { label: "LOGIN", value: "LOGIN" },
          { label: "LOGOUT", value: "LOGOUT" },
          { label: "AUDIO_PLAYBACK", value: "AUDIO_PLAYBACK" },
        ],
      },
      {
        key: "entity",
        label: t("userManagement.logs.entity"),
        type: "text",
        value: filters.entity,
      },
      {
        key: "description",
        label: t("userManagement.logs.description"),
        type: "text",
        value: filters.description,
      },
      {
        key: "ipAddress",
        label: t("userManagement.logs.ipAddress"),
        type: "text",
        value: filters.ipAddress,
      },
      {
        key: "status",
        label: t("userManagement.logs.status"),
        type: "select",
        value: filters.status,
        options: [
          { label: "SUCCESS", value: "SUCCESS" },
          { label: "FAILURE", value: "FAILURE" },
          { label: "WARNING", value: "WARNING" },
        ],
      },
    ],
    [t, filters],
  );

  return (
    <>
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
        headerActions={
          <Tooltip title={t("userManagement.logs.filters")}>
            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              size="small"
              sx={{ backgroundColor: colors?.backgroundOpenSubSection }}
            >
              <FilterListIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        }
        subHeader={
          <MobileFilterPanel
            isOpen={isOpen}
            filters={mobileFilterConfig}
            onFilterChange={handleFilterChange}
            onSearch={refetch}
            onClear={clearFilters}
            loading={isLoading}
          />
        }
      />

      {/* Error Snackbar */}
      <AlertInline ref={notificationRef} asSnackbar />
    </>
  );
};
