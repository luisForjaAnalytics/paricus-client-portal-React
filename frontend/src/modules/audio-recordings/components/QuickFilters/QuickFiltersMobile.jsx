import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Chip,
  CircularProgress,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  TablePagination,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  FilterListOff as FilterListOffIcon,
} from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../common/styles/styles";

function Row(props) {
  const {
    row,
    toggleAudio,
    downloadAudio,
    currentlyPlaying,
    loadingAudioUrl,
    handlePrefetchAudio,
  } = props;
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const isPlaying = currentlyPlaying === row.interaction_id;
  const isLoadingUrl = loadingAudioUrl === row.interaction_id;
  const hasAudio = row.audiofilename;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.companyName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                fontWeight="bold"
              >
                {t("audioRecordings.table.interactionId")}: {row.interaction_id}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Call Type */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("audioRecordings.table.callType")}:
                  </Typography>
                  <Chip
                    label={row.call_type || t("audioRecordings.table.unknown")}
                    size="small"
                    color={row.call_type ? "primary" : "default"}
                  />
                </Box>

                {/* Start Time */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("audioRecordings.table.startTime")}:
                  </Typography>
                  <Typography variant="body2">{row.start_time}</Typography>
                </Box>

                {/* End Time */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("audioRecordings.table.endTime")}:
                  </Typography>
                  <Typography variant="body2">{row.end_time}</Typography>
                </Box>

                {/* Customer Phone */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("audioRecordings.table.customerPhone")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PhoneIcon
                      fontSize="small"
                      sx={{ color: "action.active" }}
                    />
                    <Typography variant="body2">
                      {row.customer_phone_number || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Agent Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("audioRecordings.table.agentName")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SupportAgentIcon
                      fontSize="small"
                      sx={{ color: "action.active" }}
                    />
                    <Typography variant="body2">
                      {row.agent_name || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("audioRecordings.table.actions")}:
                  </Typography>
                  {!hasAudio ? (
                    <Chip
                      label={t("audioRecordings.table.noAudio")}
                      size="small"
                      color="default"
                    />
                  ) : (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
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
                            onClick={() => toggleAudio(row)}
                            disabled={isLoadingUrl}
                            onMouseEnter={() =>
                              !isPlaying &&
                              handlePrefetchAudio &&
                              handlePrefetchAudio(row.interaction_id)
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
                            onClick={() => downloadAudio(row)}
                            disabled={isLoadingUrl}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    interaction_id: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    call_type: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    customer_phone_number: PropTypes.string,
    agent_name: PropTypes.string,
    audiofilename: PropTypes.string,
  }).isRequired,
  toggleAudio: PropTypes.func.isRequired,
  downloadAudio: PropTypes.func.isRequired,
  currentlyPlaying: PropTypes.string,
  loadingAudioUrl: PropTypes.string,
  handlePrefetchAudio: PropTypes.func,
};

export const QuickFiltersMobile = ({
  dataViewInfo = [],
  formatDateTime,
  toggleAudio,
  downloadAudio,
  currentlyPlaying,
  loadingAudioUrl,
  handlePrefetchAudio,
  filters,
  setFilters,
  refetch,
  setLoadCallTypes,
  isDebouncing,
  loading,
  clearFilters,
  callTypes,
  page = 1,
  itemsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Transform data to include formatted dates
  const rows = React.useMemo(() => {
    return dataViewInfo.map((data) => ({
      ...data,
      start_time: formatDateTime(data.start_time),
      end_time: formatDateTime(data.end_time),
    }));
  }, [dataViewInfo, formatDateTime]);

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1); // Convert from 0-based to 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(1); // Reset to first page
  };

  // Green theme styling for TextField and Select components
  const greenFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "${colors.primary}",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "${colors.primary}",
      },
    },
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        display: { md: "none" },
        mt: 1,
        maxHeight: "90vh", // limits table height to 75% of viewport
        overflowY: "auto", // enables vertical scrolling
        overflowX: "hidden",
        scrollbarWidth: "thin", // Firefox scrollbar
        "&::-webkit-scrollbar": {
          width: "6px", // Chrome/Edge scrollbar width
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c5c5c5", // scrollbar color
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#9e9e9e",
        },
      }}
    >
      <Table aria-label="collapsible table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#f5f5f5" }} />
            <TableCell sx={{ backgroundColor: "#f5f5f5" }}>
              <Typography variant="subtitle2" fontWeight="600"  >
                {t("audioRecordings.table.company")}
              </Typography>
            </TableCell>
          </TableRow>
          {/* Filters Row */}
          <TableRow>
            <TableCell
              colSpan={2}
              sx={{
                backgroundColor: "#f5f5f5",
                borderBottom: filtersOpen
                  ? "none"
                  : "1px solid rgba(224, 224, 224, 1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  py: 0.5,
                  height:10
                }}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <FilterListIcon fontSize="small" color="action" />
                <Typography variant="body2" fontWeight="500">
                  Filters
                </Typography>
                <IconButton size="small" sx={{ ml: "auto" }}>
                  {filtersOpen ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
          {/* Filters Content */}
          <TableRow>
            <TableCell
              colSpan={2}
              style={{ paddingBottom: 0, paddingTop: 0 }}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
                <Box sx={{ py: 2, px: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t(
                          "audioRecordings.advancedFilters.interactionId"
                        )}
                        placeholder={t(
                          "audioRecordings.advancedFilters.interactionIdPlaceholder"
                        )}
                        value={filters.interactionId}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            interactionId: e.target.value,
                          }))
                        }
                        sx={greenFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t(
                          "audioRecordings.advancedFilters.customerPhone"
                        )}
                        placeholder={t(
                          "audioRecordings.advancedFilters.customerPhonePlaceholder"
                        )}
                        value={filters.customerPhone}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            customerPhone: e.target.value,
                          }))
                        }
                        sx={greenFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t("audioRecordings.advancedFilters.agentName")}
                        placeholder={t(
                          "audioRecordings.advancedFilters.agentNamePlaceholder"
                        )}
                        value={filters.agentName}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            agentName: e.target.value,
                          }))
                        }
                        sx={greenFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth size="small" sx={greenFieldStyles}>
                        <InputLabel id="call-type-label-mobile">
                          {t("audioRecordings.advancedFilters.callType")}
                        </InputLabel>
                        <Select
                          labelId="call-type-label-mobile"
                          value={filters.callType}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              callType: e.target.value,
                            }))
                          }
                          onOpen={() => setLoadCallTypes(true)}
                          label={t("audioRecordings.advancedFilters.callType")}
                        >
                          <MenuItem value="">
                            {t("audioRecordings.advancedFilters.allTypes")}
                          </MenuItem>
                          {callTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          label={t("audioRecordings.advancedFilters.startDate")}
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={filters.startDate}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                          sx={{ flex: 1, ...greenFieldStyles }}
                        />
                        <TextField
                          size="small"
                          label={t("audioRecordings.advancedFilters.endDate")}
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={filters.endDate}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          sx={{ flex: 1, ...greenFieldStyles }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => refetch()}
                          disabled={loading || isDebouncing}
                          startIcon={
                            loading ? (
                              <CircularProgress size={14} />
                            ) : (
                              <SearchIcon fontSize="small" />
                            )
                          }
                          sx={{
                            flex: 1,
                            borderRadius: "0.8rem",
                            backgroundColor: "${colors.primary}",
                            "&:hover": {
                              backgroundColor: "#0a6333",
                            },
                            "&:disabled": {
                              backgroundColor: "#0c7b404b",
                            },
                          }}
                        >
                          {loading
                            ? t("audioRecordings.advancedFilters.loading")
                            : t("audioRecordings.advancedFilters.search")}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={clearFilters}
                          startIcon={<FilterListOffIcon fontSize="small" />}
                          sx={{
                            flex: 1,
                            backgroundColor: "${colors.primary}",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "#0a6333",
                            },
                            borderRadius: "0.8rem",
                          }}
                        >
                          {t("audioRecordings.advancedFilters.clearAll")}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              key={row.interaction_id}
              row={row}
              toggleAudio={toggleAudio}
              downloadAudio={downloadAudio}
              currentlyPlaying={currentlyPlaying}
              loadingAudioUrl={loadingAudioUrl}
              handlePrefetchAudio={handlePrefetchAudio}
            />
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalCount}
        page={page - 1} // Convert from 1-based to 0-based
        onPageChange={handleChangePage}
        rowsPerPage={itemsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage={t("audioRecordings.results.perPageLabel")}
        sx={{
          borderTop: "1px solid rgba(224, 224, 224, 1)",
          backgroundColor: "#f5f5f5",
          position: "sticky",
          bottom: 0, // keeps pagination visible even when scrolling
          zIndex: 10,
        }}
      />
    </TableContainer>
  );
};
