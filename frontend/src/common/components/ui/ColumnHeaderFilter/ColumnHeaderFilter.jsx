import PropTypes from "prop-types";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterListOff as FilterListOffIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  buttonIconNoLabel,
  colors,
  dataGridTable,
  filterStyles,
  selectMenuProps,
} from "../../../styles/styles";
import { SelectMenuItem } from "../SelectMenuItem/SelectMenuItem";

/**
 * ColumnHeaderFilter - Componente de filtro para headers de DataGrid
 *
 * @param {string} headerName - Nombre del header de la columna
 * @param {string} filterType - Tipo de filtro: "text", "select", "date"
 * @param {string} filterKey - Key del filtro en el objeto filters
 * @param {any} filterValue - Valor actual del filtro
 * @param {function} onFilterChange - Función para cambiar el filtro
 * @param {array} options - Opciones para select (solo si filterType="select")
 * @param {string} placeholder - Placeholder para inputs de texto
 * @param {function} onOpen - Callback cuando se abre el select (para cargar opciones dinámicas)
 * @param {boolean} isOpen - Controla si el filtro está visible
 * @param {string} label - Label para el input (opcional)
 */
export const ColumnHeaderFilter = ({
  headerName,
  filterType = "text",
  filterKey,
  filterValue,
  onFilterChange,
  options = [],
  placeholder = "",
  onOpen,
  labelKey = "name",
  valueKey = "name",
  isOpen = false,
  label = "",
  // Props para filterType="actions"
  onSearch,
  onClearFilters,
  loading = false,
  isDebouncing = false,
}) => {
  const { t } = useTranslation();

  const OPTIONAL_STYLE ={
    SYNOPSIS:'synopsis'
  }

  const handleFilterChange = (value) => {
    onFilterChange?.(filterKey, value);
  };

  const renderFilterInput = () => {
    switch (filterType) {
      case "actions":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip
              title={
                loading
                  ? t("audioRecordings.advancedFilters.loading")
                  : t("audioRecordings.advancedFilters.search")
              }
            >
              <span>
                <IconButton
                  onClick={() => onSearch?.()}
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

            <Tooltip title={t("audioRecordings.advancedFilters.clearAll")}>
              <IconButton onClick={onClearFilters} sx={buttonIconNoLabel}>
                <FilterListOffIcon
                  fontSize="small"
                  sx={{ color: colors.primary }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        );

      case "select":
        return (
          <FormControl
            fullWidth
            size="small"
            sx={filterStyles.formControlSection}
          >
            <InputLabel
              id={`${filterKey}-filter-label`}
              sx={filterStyles.multiOptionFilter?.inputLabelSection}
            >
              {label || headerName}
            </InputLabel>
            <Select
              labelId={`${filterKey}-filter-label`}
              value={filterValue || ""}
              onChange={(e) => handleFilterChange(e.target.value)}
              label={label || headerName}
              onOpen={onOpen}
              MenuProps={selectMenuProps}
              sx={filterStyles.multiOptionFilter?.selectSection}
            >
              <MenuItem value="">
                <em>{t("common.all")}</em>
              </MenuItem>
              {options.map((option, index) => (
                <MenuItem
                  key={option[valueKey] || index}
                  value={option[valueKey] || option}
                >
                  {option[labelKey] || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "date":
        return (
          <TextField
            fullWidth
            size="small"
            type="date"
            label={label || headerName}
            slotProps={{ inputLabel: { shrink: true } }}
            value={filterValue || ""}
            onChange={(e) => handleFilterChange(e.target.value)}
            sx={{
              ...filterStyles.inputFilter,
              "& .MuiOutlinedInput-input": {
                color: filterValue ? colors.textPrimary : colors.textMuted,
              },
            }}
          />
        );

      case "text":
      default:
        return (
          <TextField
            fullWidth
            size="small"
            label={label || headerName}
            placeholder={placeholder || headerName}
            value={filterValue || ""}
            onChange={(e) => handleFilterChange(e.target.value)}
            sx={
              filterKey !== OPTIONAL_STYLE.SYNOPSIS
                ? { ...filterStyles.inputFilter }
                : {
                    ...filterStyles.inputFilter,
                    "& .MuiInputLabel-root": {
                      top: "-0.4rem",
                      //ml:'2rem',
                      left: "7vh",
                      "&.Mui-focused": {
                        color: colors.focusRing,
                        left: "0vh",
                      },
                    },
                  }
            }
          />
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        width: "100%",
        py: isOpen ? 0.5 : 0,
      }}
    >
      {/* Filter Input - Encima del título, solo visible cuando isOpen es true */}
      {isOpen && (
        <Box
          sx={{
            width: "100%",
            minWidth: 100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {renderFilterInput()}
        </Box>
      )}

      {/* Header Title - Centrado */}
      <Typography sx={dataGridTable.columnHeaderTitle}>{headerName}</Typography>
    </Box>
  );
};

ColumnHeaderFilter.propTypes = {
  headerName: PropTypes.string.isRequired,
  filterType: PropTypes.oneOf(["text", "select", "date", "actions"]),
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onOpen: PropTypes.func,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  isOpen: PropTypes.bool,
  label: PropTypes.string,
  // Props para filterType="actions"
  onSearch: PropTypes.func,
  onClearFilters: PropTypes.func,
  loading: PropTypes.bool,
  isDebouncing: PropTypes.bool,
};
