import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterListOff as FilterListOffIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  colors,
  filterStyles,
  buttonIconNoLabel,
} from "../../../../common/styles/styles";

export const TicketAdvancedFilters = ({
  filters,
  refetch,
  setFilters,
  isDebouncing,
  loading,
  clearFilters,
}) => {
  const { t } = useTranslation();

  const priorities = ["low", "medium", "high"];
  const statuses = ["open", "in progress", "resolved", "closed"];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "0.5rem 0 -0.5rem 0",
        gap: 1,
        paddingLeft: "0.4rem",
        alignItems: "center",
      }}
    >
      <Box sx={filterStyles?.boxFilterbyGroup}>
        {/* Subject */}
        <Box sx={{ minWidth: "200px" }}>
          <TextField
            fullWidth
            label={t("tickets.filters.subject")}
            placeholder={t("tickets.filters.subjectPlaceholder")}
            value={filters.subject || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                subject: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>

        {/* From */}
        <Box sx={{ minWidth: "150px" }}>
          <TextField
            fullWidth
            label={t("tickets.filters.from")}
            placeholder={t("tickets.filters.fromPlaceholder")}
            value={filters.from || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                from: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>
      </Box>

      <Box sx={filterStyles?.boxFilterbyGroup}>
        {/* Assigned To */}
        <Box sx={{ minWidth: "150px" }}>
          <TextField
            fullWidth
            label={t("tickets.filters.assignedTo")}
            placeholder={t("tickets.filters.assignedToPlaceholder")}
            value={filters.assignedTo || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                assignedTo: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>

        {/* Priority */}
        <Box sx={{ minWidth: "150px" }}>
          <FormControl
            sx={{
              width: "100%",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiOutlinedInput-root": {
                height: "2.6rem",
              },
              "& .MuiInputLabel-root": {
                top: "-0.4rem",
                "&.Mui-focused": {
                  color: colors.focusRing,
                },
                "&.MuiInputLabel-shrink": {
                  top: "0",
                },
              },
              "& .MuiSelect-icon": {
                color: `${colors.textIcon} !important`,
              },
              "& .MuiSelect-iconOutlined": {
                color: `${colors.textIcon} !important`,
              },
            }}
          >
            <InputLabel
              id="priority-label"
              sx={filterStyles?.multiOptionFilter?.inputLabelSection}
            >
              {t("tickets.filters.priority")}
            </InputLabel>
            <Select
              labelId="priority-label"
              id="priority-select"
              value={filters.priority || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
              sx={filterStyles?.multiOptionFilter?.selectSection}
              label={t("tickets.filters.priority")}
            >
              <MenuItem value="">
                <em>{t("tickets.filters.allPriorities")}</em>
              </MenuItem>
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={filterStyles?.boxFilterbyGroup}>
        {/* Status */}
        <Box sx={{ minWidth: "150px" }}>
          <FormControl
            fullWidth
            sx={{
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiOutlinedInput-root": {
                height: "2.6rem",
              },
              "& .MuiInputLabel-root": {
                top: "-0.4rem",
                "&.Mui-focused": {
                  color: colors.focusRing,
                },
                "&.MuiInputLabel-shrink": {
                  top: "0",
                },
              },
              "& .MuiSelect-icon": {
                color: `${colors.textIcon} !important`,
              },
              "& .MuiSelect-iconOutlined": {
                color: `${colors.textIcon} !important`,
              },
            }}
          >
            <InputLabel
              id="status-label"
              sx={filterStyles?.multiOptionFilter?.inputLabelSection}
            >
              {t("tickets.filters.status")}
            </InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={filters.status || ""}
              label={t("tickets.filters.status")}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              sx={filterStyles?.multiOptionFilter?.selectSection}
            >
              <MenuItem value="">
                <em>{t("tickets.filters.allStatuses")}</em>
              </MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Last Update Date */}
        <Box sx={{ minWidth: "150px" }}>
          <TextField
            fullWidth
            label={t("tickets.filters.lastUpdate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.lastUpdate || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                lastUpdate: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          marginTop: "-0.5rem",
        }}
      >
        {/* Action Buttons */}
        <Box sx={{ marginTop: "0.5rem" }}>
          <Tooltip title={loading ? t("common.loading") : t("common.search")}>
            <span>
              <IconButton
                onClick={() => refetch()}
                disabled={loading || isDebouncing}
                sx={buttonIconNoLabel}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <SearchIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Box sx={{ marginTop: "0.5rem" }}>
          <Tooltip title={t("common.clear")}>
            <IconButton onClick={clearFilters} sx={buttonIconNoLabel}>
              <FilterListOffIcon
                fontSize="small"
                sx={{ color: colors.primary }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

TicketAdvancedFilters.propTypes = {
  filters: PropTypes.shape({
    subject: PropTypes.string,
    from: PropTypes.string,
    assignedTo: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    lastUpdate: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  isDebouncing: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default TicketAdvancedFilters;
