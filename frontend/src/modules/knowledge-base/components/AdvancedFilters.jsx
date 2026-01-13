import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterListOff as FilterListOffIcon,
  ForkLeft,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  buttonIconNoLabel,
  colors,
  filterStyles,
} from "../../../common/styles/styles";

export const AdvancedFilters = ({
  filters,
  refetch,
  setFilters,
  isDebouncing,
  loading,
  clearFilters,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        margin: "0.5rem 0 -0.5rem 0",
        gap: 2,
      }}
    >
      <Box>
        <TextField
          fullWidth
          label={t("knowledgeBase.filters.articleName")}
          placeholder={t("knowledgeBase.filters.articleNamePlaceholder")}
          value={filters.articleName || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              articleName: e.target.value,
            }))
          }
          sx={filterStyles?.inputFilter}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
          label={t("knowledgeBase.filters.synopsis")}
          placeholder={t("knowledgeBase.filters.synopsisPlaceholder")}
          value={filters.synopsis || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              synopsis: e.target.value,
            }))
          }
          sx={filterStyles?.inputFilter}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
          label={t("knowledgeBase.filters.updatedAt")}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.updatedAt || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              updatedAt: e.target.value,
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
        {/* Action Buttons */}
        <Box sx={{ marginTop: "0.5rem" }}>
          <Tooltip
            title={
              loading
                ? t("knowledgeBase.filters.loading")
                : t("knowledgeBase.filters.search")
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
          <Tooltip title={t("knowledgeBase.filters.clearAll")}>
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
    articleName: PropTypes.string,
    synopsis: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  isDebouncing: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default AdvancedFilters;
