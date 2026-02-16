import PropTypes from "prop-types";
import {
  Box,
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
import { LoadingProgress } from "../../../../common/components/ui/LoadingProgress";

export const AdvancedFilters = ({
  filters,
  refetch,
  setFilters,
  isDebouncing,
  loading,
  clearFilters,
}) => {
  const { t } = useTranslation();

  const eventTypes = [
    "CREATE",
    "UPDATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "AUDIO_PLAYBACK",
  ];
  const statuses = ["SUCCESS", "FAILURE", "WARNING"];

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
        {/* Event ID */}
        <Box sx={{ minWidth: "150px" }}>
          <TextField
            fullWidth
            label={t("userManagement.logs.eventId")}
            placeholder="Search by Event ID..."
            value={filters.eventId || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                eventId: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>

        {/* Timestamp */}
        <Box sx={{ minWidth: "150px" }}>
          <TextField
            fullWidth
            label={t("userManagement.logs.timestamp")}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.timestamp || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                timestamp: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>
      </Box>

      <Box sx={filterStyles?.boxFilterbyGroup}>
        {/* User ID */}
        <Box sx={{ minWidth: "100px" }}>
          <TextField
            fullWidth
            label={t("userManagement.logs.userId")}
            placeholder="User ID..."
            value={filters.userId || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                userId: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>

        {/* Event Type */}
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
              id="event-type-label"
              sx={filterStyles?.multiOptionFilter?.inputLabelSection}
            >
              {t("userManagement.logs.eventType")}
            </InputLabel>
            <Select
              labelId="event-type-label"
              id="event-type-select"
              value={filters.eventType || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  eventType: e.target.value,
                }))
              }
              sx={filterStyles?.multiOptionFilter?.selectSection}
              label={t("userManagement.logs.eventType")}
            >
              <MenuItem value="">All Types</MenuItem>
              {eventTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={filterStyles?.boxFilterbyGroup}>
        {/* Entity */}
        <Box sx={{ minWidth: "120px" }}>
          <TextField
            fullWidth
            label={t("userManagement.logs.entity")}
            placeholder="Entity..."
            value={filters.entity || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                entity: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>

        {/* Description */}
        <Box sx={{ minWidth: "200px" }}>
          <TextField
            fullWidth
            label={t("userManagement.logs.description")}
            placeholder="Search description..."
            value={filters.description || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>
      </Box>

      <Box sx={filterStyles?.boxFilterbyGroup}>
        {/* IP Address */}
        <Box sx={{ minWidth: "150px" }}>
          <TextField
            fullWidth
            label={t("userManagement.logs.ipAddress")}
            placeholder="IP Address..."
            value={filters.ipAddress || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                ipAddress: e.target.value,
              }))
            }
            sx={filterStyles?.inputFilter}
          />
        </Box>
        {/* Status */}
        <Box sx={{ minWidth: "140px" }}>
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
              {t("userManagement.logs.status")}
            </InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={filters.status || ""}
              label={t("userManagement.logs.status")}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              sx={filterStyles?.multiOptionFilter?.selectSection}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        {/* Action Buttons as Box Items */}
        <Box sx={{ marginTop: "0.5rem" }}>
          <Tooltip title={loading ? t("common.loading") : t("common.search")}>
            <span>
              <IconButton
                onClick={() => refetch()}
                disabled={loading || isDebouncing}
                sx={buttonIconNoLabel}
              >
                {loading ? (
                  <LoadingProgress size={20} />
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

AdvancedFilters.propTypes = {
  filters: PropTypes.shape({
    eventId: PropTypes.string,
    userId: PropTypes.string,
    eventType: PropTypes.string,
    entity: PropTypes.string,
    description: PropTypes.string,
    ipAddress: PropTypes.string,
    status: PropTypes.string,
    timestamp: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  isDebouncing: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default AdvancedFilters;
