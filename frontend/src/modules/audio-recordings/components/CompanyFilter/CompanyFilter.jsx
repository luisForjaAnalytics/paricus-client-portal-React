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
import { colors } from "../../../../common/styles/styles";
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
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel
          id="company-filter-label"
          sx={{

            "&.Mui-focused.MuiInputLabel-animated": {
              color: colors.focusRing,
            },
          }}
        >
          {t("audioRecordings.quickFilter.company")}
        </InputLabel>
        <Select
          labelId="company-filter-label"
          value={filters.company || ""}
          onChange={(e) => setCompanyFilter(e.target.value || null)}
          label={t("audioRecordings.quickFilter.company")}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.textMuted,
              borderRadius: "3rem",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.focusRing,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.focusRing,
            },
          }}
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
