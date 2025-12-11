import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors, filterStyles } from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

export const CompanyFilter = ({
  setCompanyFilter,
  filters,
  companies,
  isOpen,
  setIsOpen,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2 }}
    >
      <FormControl
        size="small"
        sx={{
          minWidth: 150,
          "&:hover .MuiInputLabel-root": {
            color: filters.company ? colors.focusRing : undefined,
          },
        }}
      >
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

      <Tooltip
        title={t("audioRecordings.quickFilter.filters")}
        sx={{ marginRight: "1rem" }}
      >
        <IconButton onClick={() => setIsOpen(!isOpen)} size="small">
          <FilterListIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

CompanyFilter.propTypes = {
  setCompanyFilter: PropTypes.func.isRequired,
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
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
