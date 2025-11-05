import * as React from "react";
import { DataGrid, Toolbar, ToolbarButton } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  IconButton,
  CircularProgress,
  Chip,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useTranslation } from "react-i18next";
import { AdvancedFilters } from "./AdvancedFilters";
import { companies } from "./company.js";

// Function to create columns with audio playback handlers
const createColumns = (
  t,
  toggleAudio,
  downloadAudio,
  currentlyPlaying,
  loadingAudioUrl,
  handlePrefetchAudio
) => [
  { field: "id", headerName: "ID", hide: true },
  {
    field: "interactionId",
    headerName: t("audioRecordings.table.interactionId"),
    width: 300,
    //flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
  {
    field: "company",
    headerName: t("audioRecordings.table.company"),
    width: 100,
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
  {
    field: "callType",
    headerName: t("audioRecordings.table.callType"),
    width: 100,
    align: "center",
    headerAlign: "center",
    sortable: true,
    renderCell: (params) => (
      <Chip
        label={params.value || t("audioRecordings.table.unknown")}
        size="small"
        color={params.value ? "primary" : "default"}
      />
    ),
  },
  {
    field: "startTime",
    headerName: t("audioRecordings.table.startTime"),
    width: 190,
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
  {
    field: "endTime",
    headerName: t("audioRecordings.table.endTime"),
    width: 190,
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
  {
    field: "customerPhone",
    headerName: t("audioRecordings.table.customerPhone"),
    width: 180,
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
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
    headerName: t("audioRecordings.table.agentName"),
    width: 200,
    //flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
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
    headerName: t("audioRecordings.table.actions"),
    width: 150,
    //flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: "center",
    headerAlign: "center",
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
];

const transformRecordings = (rowsTable, formatDate) => {
  return rowsTable.map((data, index) => ({
    id: index,
    interactionId: data.interaction_id,
    company: data.company_name,
    callType: data.call_type,
    startTime: formatDate(data.start_time),
    endTime: formatDate(data.end_time),
    customerPhone: data.customer_phone,
    agentName: data.agent_name,
    audioFileName: data.audiofilename,
    // Keep original data for audio playback
    interaction_id: data.interaction_id,
    audiofilename: data.audiofilename,
  }));
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
}) => {
  const { t } = useTranslation();

  // Wrapper component for AdvancedFilters to work as DataGrid toolbar
  const AdvancedFiltersToolbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {t("audioRecordings.results.title")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1 }}
            >
              {totalCount} {t("audioRecordings.results.totalRecordings")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="company-filter-label">Company</InputLabel>
              <Select
                labelId="company-filter-label"
                value={filters.company || ""}
                onChange={(e) => setCompanyFilter(e.target.value || null)}
                label="Company"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0c7b3f",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0c7b3f",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0c7b3f",
                  },
                }}
              >
                <MenuItem value="">
                  <em>All Companies</em>
                </MenuItem>
                {companies.map((company, index) => (
                  <MenuItem key={index} value={company.name}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Filters" sx={{ marginRight: "1rem" }}>
              <ToolbarButton onClick={() => setIsOpen(!isOpen)}>
                <FilterListIcon fontSize="small" />
              </ToolbarButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {isOpen && (
          <Box sx={{ px: 2, pb: 2 }}>
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
            />
          </Box>
        )}
      </>
    );
  };

  // Transform recordings data for DataGrid
  const rows = React.useMemo(
    () => transformRecordings(dataViewInfo, formatDateTime),
    [dataViewInfo, formatDateTime]
  );

  // Create columns with audio handlers
  const columns = React.useMemo(
    () =>
      createColumns(
        t,
        toggleAudio,
        downloadAudio,
        currentlyPlaying,
        loadingAudioUrl,
        handlePrefetchAudio
      ),
    [
      t,
      toggleAudio,
      downloadAudio,
      currentlyPlaying,
      loadingAudioUrl,
      handlePrefetchAudio,
    ]
  );

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
        height: 700,
        width: { md: "95%", lg: "100%" },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        slots={{ toolbar: AdvancedFiltersToolbar }}
        showToolbar
        // Server-side pagination
        paginationMode="server"
        rowCount={totalCount}
        paginationModel={{
          page: page - 1, // DataGrid uses 0-based index
          pageSize: itemsPerPage,
        }}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[ 10, 25, 50, 100]}
        // Sorting configuration
        sortingOrder={["asc", "desc"]}
        initialState={{
          columns: {
            columnVisibilityModel: { id: false },
          },
          //   sorting: {
          //     sortModel: [{ field: "agentName", sort: "asc" }],
          //   },
        }}
        //disableRowSelectionOnClick
        sx={{
          padding: "1rem 0 0 0",
          borderRadius: "1rem",
          // Header styles - Fondo gris
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5 !important",
            borderBottom: "2px solid #e0e0e0",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f5f5 !important", // color de la celda del
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.875rem",
          },
          // Sorting icons
          "& .MuiDataGrid-sortIcon": {
            color: "#0c7b3f",
          },
          "& .MuiDataGrid-columnHeader--sorted": {
            backgroundColor: "#e8f5e9 !important",
          },
          // Filler column también en gris
          "& .MuiDataGrid-filler": {
            backgroundColor: "#f5f5f5 !important",
            width: "0 !important",
            minWidth: "0 !important",
            maxWidth: "0 !important",
          },
          // Ajustar el scrollbar area
          "& .MuiDataGrid-scrollbarFiller": {
            display: "none !important",
          },
          "& .MuiDataGrid-scrollbar--vertical": {
            position: "absolute",
            right: 0,
          },
          // Cell styles
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f0f0f0",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          // Row hover effect
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },
        }}
      />
    </Box>
  );
};
