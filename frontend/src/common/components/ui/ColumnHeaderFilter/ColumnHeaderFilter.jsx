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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "dayjs/locale/en";
import { useTranslation } from "react-i18next";
import {
  buttonIconNoLabel,
  colors,
  dataGridTable,
  filterStyles,
  selectMenuProps,
} from "../../../styles/styles";
import { SelectMenuItem } from "../SelectMenuItem/SelectMenuItem";
import { LoadingProgress } from "../LoadingProgress";

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

  const OPTIONAL_STYLE = {
    SYNOPSIS: "synopsis",
  };

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
        const locale = t("common.locale") === "es-ES" ? "es" : "en";

        return (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={locale}
          >
            <DatePicker
              label={label || headerName}
              value={filterValue ? dayjs(filterValue) : null}
              onChange={(newValue) => {
                const formattedDate = newValue
                  ? newValue.format("YYYY-MM-DD")
                  : "";
                handleFilterChange(formattedDate);
              }}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  InputProps: {
                    sx: {
                      backgroundColor: colors.surface,
                      borderRadius: "3rem",
                      height: "2.2rem",
                      "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
                        borderColor: `${colors.focusRing} !important`,
                      },
                      "&:hover .MuiPickersOutlinedInput-notchedOutline": {
                        borderColor: colors.focusRing,
                      },
                    },
                  },
                  InputLabelProps: {
                    sx: {
                      top: "-0.4rem",
                      "&.Mui-focused": {
                        color: colors.focusRing,
                      },
                      "&.MuiInputLabel-shrink": {
                        top: "0",
                      },
                    },
                  },
                  sx: {
                    flex: 1,
                    mt: "0.5rem",
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: colors.focusRing,
                      },
                    "& .MuiInputBase-input": {
                      color: filterValue
                        ? colors.textPrimary
                        : colors.textMuted,
                      padding: "0 14px",
                    },
                  },
                },
                popper: {
                  sx: {
                    "& .MuiPaper-root": {
                      borderRadius: "1.5rem",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      padding: "0rem",
                      border: `1px solid ${colors.border}`,
                    },
                    "& .MuiPickersCalendarHeader-root": {
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "0.5rem",
                      marginTop: 0,
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: colors.primary,
                      fontWeight: 500,
                      fontSize: "0.8rem",
                      margin: 0,
                    },
                    "& .MuiPickersCalendarHeader-switchViewButton": {
                      color: colors.primary,
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                      },
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      color: colors.primary,
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                      },
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      color: colors.textSecondary,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      margin: "0.25rem",
                    },
                    "& .MuiPickersDay-root": {
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: colors.textPrimary,
                      margin: "0.15rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                        transform: "scale(1.05)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: colors.primary,
                        color: colors.textWhite,
                        fontWeight: 700,
                        boxShadow: `0 2px 8px ${colors.primary}40`,
                        "&:hover": {
                          backgroundColor: colors.primaryHover,
                        },
                        "&:focus": {
                          backgroundColor: colors.primary,
                        },
                      },
                      "&.MuiPickersDay-today": {
                        border: `2px solid ${colors.primary}`,
                        backgroundColor: "transparent",
                        fontWeight: 600,
                        "&:not(.Mui-selected)": {
                          color: colors.primary,
                        },
                      },
                      "&.Mui-disabled": {
                        color: colors.textIcon,
                        opacity: 0.4,
                      },
                    },
                    "& .MuiDialogActions-root": {
                      paddingTop: "1rem",
                    },
                    "& .MuiButton-root": {
                      borderRadius: "0.75rem",
                      fontWeight: 600,
                      textTransform: "none",
                      padding: "0.5rem 1.5rem",
                      "&.MuiButton-text": {
                        color: colors.primary,
                        "&:hover": {
                          backgroundColor: colors.primaryLight,
                        },
                      },
                    },
                    "& .MuiYearCalendar-root": {
                      "& .MuiPickersYear-yearButton": {
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        "&.Mui-selected": {
                          backgroundColor: colors.primary,
                          color: colors.textWhite,
                          fontWeight: 700,
                          "&:hover": {
                            backgroundColor: colors.primaryHover,
                          },
                        },
                        "&:hover": {
                          backgroundColor: colors.primaryLight,
                        },
                      },
                    },
                    "& .MuiMonthCalendar-root": {
                      "& .MuiPickersMonth-monthButton": {
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        "&.Mui-selected": {
                          backgroundColor: colors.primary,
                          color: colors.textWhite,
                          fontWeight: 700,
                          "&:hover": {
                            backgroundColor: colors.primaryHover,
                          },
                        },
                        "&:hover": {
                          backgroundColor: colors.primaryLight,
                        },
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
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
