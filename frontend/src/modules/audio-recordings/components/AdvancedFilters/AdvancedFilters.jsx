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
  buttonIconNoLabel,
  colors,
  filterStyles,
} from "../../../../common/styles/styles";
import { useSelector } from "react-redux";

export const AdvancedFilters = ({
  filters,
  refetch,
  setFilters,
  setLoadCallTypes,
  isDebouncing,
  loading,
  clearFilters,
  callTypes,
  setCompanyFilter,
  companies,
}) => {
  // Auth store
  const authUser = useSelector((state) => state.auth.user);

  // Computed values
  const isBPOAdmin = authUser?.permissions?.includes("admin_invoices");
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: "0.5rem 0.5rem -0.5rem 0.5rem",
        gap: 2,
      }}
    >
      <Box>
        <TextField
          fullWidth
          label={t("audioRecordings.advancedFilters.interactionId")}
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
          sx={filterStyles?.inputFilter}
        />
      </Box>
      <Box>
        {isBPOAdmin && (
          <FormControl sx={filterStyles?.formControlSection}>
            <InputLabel
              id="company-filter-label"
              sx={filterStyles?.multiOptionFilter?.inputLabelSection}
            >
              {t("audioRecordings.quickFilter.company")}
            </InputLabel>
            <Select
              labelId="company-filter-label"
              value={filters.company || ""}
              onChange={(e) => setCompanyFilter(e.target.value || null)}
              label={t("audioRecordings.quickFilter.company")}
              sx={filterStyles?.multiOptionFilter?.selectSection}
            >
              <MenuItem value="">
                <em>{t("audioRecordings.quickFilter.allCompanies")}</em>
              </MenuItem>
              {companies.map((company, index) => (
                <MenuItem key={index} value={company.name}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Box>
        <FormControl sx={filterStyles?.formControlSection}>
          <InputLabel
            id="call-type-label"
            sx={filterStyles?.multiOptionFilter?.inputLabelSection}
          >
            {t("audioRecordings.advancedFilters.callType")}
          </InputLabel>
          <Select
            labelId="call-type-label"
            id="call-type-select"
            value={filters.callType}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                callType: e.target.value,
              }))
            }
            onOpen={() => setLoadCallTypes(true)}
            sx={filterStyles?.multiOptionFilter?.selectSection}
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
      </Box>

      <Box>
        <TextField
          fullWidth
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
          sx={filterStyles?.inputFilter}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
          label={t("audioRecordings.advancedFilters.endDate")}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
          sx={filterStyles?.inputFilter}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
          label={t("audioRecordings.advancedFilters.customerPhone")}
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
          sx={filterStyles?.inputFilter}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
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
          sx={filterStyles?.inputFilter}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          marginTop: "-0.5rem",
        }}
      >
        {/* Action Buttons as Box Items */}
        <Box sx={{ marginTop: "0.5rem" }}>
          <Tooltip
            title={
              loading
                ? t("audioRecordings.advancedFilters.loading")
                : t("audioRecordings.advancedFilters.search")
            }
          >
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
          <Tooltip title={t("audioRecordings.advancedFilters.clearAll")}>
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
  loading: PropTypes.bool.isRequired,
  clearFilters: PropTypes.func.isRequired,
  callTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AdvancedFilters;
