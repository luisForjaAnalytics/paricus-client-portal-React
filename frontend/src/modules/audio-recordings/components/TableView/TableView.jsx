import * as React from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { Box, IconButton, CircularProgress, Chip } from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useTranslation } from "react-i18next";
import { AdvancedFilters } from "../AdvancedFilters/AdvancedFilters";
import { companies } from "../AdvancedFilters/company.js";
import { colors } from "../../../../common/styles/styles";
import { UniversalDataGrid, useDataGridColumns } from "../../../../common/components/ui/UniversalDataGrid";

const transformRecordings = (rowsTable, formatDate) => {
  try {
    return rowsTable.map((data, index) => ({
      id: index,
      interactionId: data.interaction_id,
      company: data.companyName,
      callType: data.call_type,
      startTime: formatDate(data.start_time),
      endTime: formatDate(data.end_time),
      customerPhone: data.customer_phone_number,
      agentName: data.agent_name,
      audioFileName: data.audiofilename,
      // Keep original data for audio playback
      interaction_id: data.interaction_id,
      audiofilename: data.audiofilename,
    }));
  } catch (err) {
    console.error(`ERROR: transformRecordings - ${err.message}`, err);
    return [];
  }
};

export const TableView = ({
  dataViewInfo = [],
  loading = false,
  formatDateTime,
  toggleAudio,
  downloadAudio,
  currentlyPlaying,
  loadingAudioUrl,
  handlePrefetchAudio,
  page = 1,
  itemsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  filters,
  refetch,
  setFilters,
  setLoadCallTypes,
  isDebouncing,
  clearFilters,
  callTypes,
  setCompanyFilter,
  setAudioFilter,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();

  // Transform recordings data for DataGrid
  const rows = React.useMemo(
    () => transformRecordings(dataViewInfo, formatDateTime),
    [dataViewInfo, formatDateTime]
  );

  // DataGrid columns using useDataGridColumns hook
  const columns = useDataGridColumns([
    {
      field: "interactionId",
      headerNameKey: "audioRecordings.table.interactionId",
      width: 300,
    },
    {
      field: "company",
      headerNameKey: "audioRecordings.table.company",
      width: 100,
      flex: 1,
    },
    {
      field: "callType",
      headerNameKey: "audioRecordings.table.callType",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || t("audioRecordings.table.unknown")}
          color="success"
          size="small"
        />
      ),
    },
    {
      field: "startTime",
      headerNameKey: "audioRecordings.table.startTime",
      width: 190,
      flex: 1,
    },
    {
      field: "endTime",
      headerNameKey: "audioRecordings.table.endTime",
      width: 190,
      flex: 1,
    },
    {
      field: "customerPhone",
      headerNameKey: "audioRecordings.table.customerPhone",
      width: 180,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifyContent: "center",
          }}
        >
          <PhoneIcon fontSize="small" sx={{ color: "action.active" }} />
          {params.value || "N/A"}
        </Box>
      ),
    },
    {
      field: "agentName",
      headerNameKey: "audioRecordings.table.agentName",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifyContent: "left",
          }}
        >
          <SupportAgentIcon fontSize="small" sx={{ color: "action.active" }} />
          {params.value || "N/A"}
        </Box>
      ),
    },
    {
      field: "actions",
      headerNameKey: "audioRecordings.table.actions",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const recording = params.row;
        const isPlaying = currentlyPlaying === recording.interactionId;
        const isLoadingUrl = loadingAudioUrl === recording.interactionId;
        const hasAudio = recording.audioFileName;

        if (!hasAudio) {
          return (
            <Chip
              label={t("audioRecordings.table.noAudio")}
              size="small"
              color="default"
            />
          );
        }

        return (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            {/* Play/Stop button */}
            <Tooltip
              title={
                isPlaying
                  ? t("audioRecordings.tooltips.stop")
                  : t("audioRecordings.tooltips.play")
              }
            >
              <span>
                <IconButton
                  size="small"
                  color={isPlaying ? "error" : "primary"}
                  onClick={() => toggleAudio(recording)}
                  disabled={isLoadingUrl}
                  onMouseEnter={() =>
                    !isPlaying &&
                    handlePrefetchAudio &&
                    handlePrefetchAudio(recording.interactionId)
                  }
                >
                  {isLoadingUrl ? (
                    <CircularProgress size={20} />
                  ) : isPlaying ? (
                    <StopIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            {/* Download button */}
            <Tooltip title={t("audioRecordings.tooltips.download")}>
              <span>
                <IconButton
                  size="small"
                  color="default"
                  onClick={() => downloadAudio(recording)}
                  disabled={isLoadingUrl}
                >
                  <DownloadIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ]);

  // Wrapper component for AdvancedFilters to work as DataGrid toolbar
  const AdvancedFiltersToolbar = React.useMemo(() => {
    return () => {
      if (!isOpen) return null;

      return (
        <Box
          sx={{
            padding: "0.2rem 0 1rem 0",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            backgroundColor: colors.subSectionBackground,
            borderBottom: `1px solid ${colors.subSectionBorder}`,
          }}
        >
          <AdvancedFilters
            filters={filters}
            refetch={refetch}
            setFilters={setFilters}
            setLoadCallTypes={setLoadCallTypes}
            isDebouncing={isDebouncing}
            loading={loading}
            clearFilters={clearFilters}
            callTypes={callTypes}
            setCompanyFilter={setCompanyFilter}
            setAudioFilter={setAudioFilter}
            companies={companies}
          />
        </Box>
      );
    };
  }, [
    filters,
    isOpen,
    refetch,
    setFilters,
    setLoadCallTypes,
    isDebouncing,
    loading,
    clearFilters,
    callTypes,
    setAudioFilter,
  ]);

  // Handle pagination model change (DataGrid uses 0-based page index)
  const handlePaginationChange = React.useCallback(
    (model) => {
      // If page size changed, reset to first page
      if (model.pageSize !== itemsPerPage) {
        onPageSizeChange(model.pageSize);
        onPageChange(1); // Reset to page 1
      } else if (model.page !== page - 1) {
        onPageChange(model.page + 1); // Convert to 1-based
      }
    },
    [page, itemsPerPage, onPageChange, onPageSizeChange]
  );

  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        height: "auto",
        width: { md: "95%", lg: "100%" },
      }}
    >
      <UniversalDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        emptyMessage={t("audioRecordings.noRecordings") || "No recordings found"}
        slots={{ toolbar: AdvancedFiltersToolbar }}
        paginationMode="server"
        rowCount={totalCount}
        paginationModel={{
          page: page - 1,
          pageSize: itemsPerPage,
        }}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          columns: {
            columnVisibilityModel: { id: false },
          },
        }}
      />
    </Box>
  );
};

TableView.propTypes = {
  dataViewInfo: PropTypes.arrayOf(
    PropTypes.shape({
      interaction_id: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      call_type: PropTypes.string,
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      customer_phone_number: PropTypes.string,
      agent_name: PropTypes.string,
      audiofilename: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  formatDateTime: PropTypes.func.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  downloadAudio: PropTypes.func.isRequired,
  currentlyPlaying: PropTypes.string,
  loadingAudioUrl: PropTypes.string,
  handlePrefetchAudio: PropTypes.func.isRequired,
  page: PropTypes.number,
  itemsPerPage: PropTypes.number,
  totalCount: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    interactionId: PropTypes.string,
    customerPhone: PropTypes.string,
    agentName: PropTypes.string,
    callType: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    company: PropTypes.string,
    hasAudio: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setLoadCallTypes: PropTypes.func.isRequired,
  isDebouncing: PropTypes.bool.isRequired,
  clearFilters: PropTypes.func.isRequired,
  callTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCompanyFilter: PropTypes.func.isRequired,
  setAudioFilter: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

TableView.defaultProps = {
  dataViewInfo: [],
  loading: false,
  currentlyPlaying: null,
  loadingAudioUrl: null,
  page: 1,
  itemsPerPage: 10,
  totalCount: 0,
};

export default TableView;
