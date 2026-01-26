import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { colors, filterStyles } from "../../../common/styles/styles";
import { useTranslation } from "react-i18next";

// Custom hook for debounced value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const ArticleSearch = ({
  onDebouncedValueChange,
  isLoading = false,
  debounceMs = 400,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");

  // Debounce the search value
  const debouncedSearch = useDebounce(searchValue, debounceMs);

  // Notify parent when debounced value changes
  useEffect(() => {
    onDebouncedValueChange?.(debouncedSearch);
  }, [debouncedSearch, onDebouncedValueChange]);

  return (
    <TextField
      fullWidth
      size="small"
      placeholder={
        t("knowledgeBase.filters.articleSearch") || "Search articles..."
      }
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      sx={{ ...filterStyles.inputFilter, padding: "0 40vh 0 40vh" }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: colors.primary }} />
              ) : (
                <SearchIcon
                  sx={{ color: "action.active", marginRight: "0.5rem" }}
                />
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

ArticleSearch.propTypes = {
  onDebouncedValueChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  debounceMs: PropTypes.number,
};
