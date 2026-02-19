import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterListOff as FilterListOffIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  filterStyles,
  colors,
  buttonIconNoLabel,
  selectMenuProps,
} from "../../../styles/styles";
import { LoadingProgress } from "../LoadingProgress";

// Estilos compartidos del calendario (días, header, botones, etc.)
const calendarStyles = {
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
    "&:hover": { backgroundColor: colors.primaryLight },
  },
  "& .MuiPickersArrowSwitcher-button": {
    color: colors.primary,
    "&:hover": { backgroundColor: colors.primaryLight },
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
      "&:hover": { backgroundColor: colors.primaryHover },
      "&:focus": { backgroundColor: colors.primary },
    },
    "&.MuiPickersDay-today": {
      border: `2px solid ${colors.primary}`,
      backgroundColor: "transparent",
      fontWeight: 600,
      "&:not(.Mui-selected)": { color: colors.primary },
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
      "&:hover": { backgroundColor: colors.primaryLight },
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
        "&:hover": { backgroundColor: colors.primaryHover },
      },
      "&:hover": { backgroundColor: colors.primaryLight },
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
        "&:hover": { backgroundColor: colors.primaryHover },
      },
      "&:hover": { backgroundColor: colors.primaryLight },
    },
  },
};

const paperStyles = {
  borderRadius: "1.5rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  padding: "0rem",
  border: `1px solid ${colors.border}`,
};

const datePickerSlotProps = {
  textField: {
    size: "small",
    fullWidth: true,
    InputProps: {
      sx: {
        backgroundColor: colors.surface,
        borderRadius: "3rem",
        height: "2.2rem",
        width: "18vh",
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
        "&.Mui-focused": { color: colors.focusRing },
        "&.MuiInputLabel-shrink": { top: "0" },
      },
    },
    sx: {
      flex: 1,
      mt: "0.5rem",
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.focusRing,
      },
      "& .MuiInputBase-input": {
        padding: "0 14px",
      },
    },
  },
  // Desktop: calendario se abre como Popper (dropdown)
  popper: {
    sx: {
      "& .MuiPaper-root": paperStyles,
      ...calendarStyles,
    },
  },
  // Mobile: calendario se abre como Dialog (modal)
  dialog: {
    sx: {
      "& .MuiDialog-paper": paperStyles,
      ...calendarStyles,
    },
  },
  // Ocultar toolbar "SELECT DATE" del modo mobile
  toolbar: { hidden: true },
};

const selectSx = {
  ...filterStyles.formControlSection,
  width: "100%",
  mt: "0.5rem",
};

export const MobileFilterPanel = ({
  isOpen,
  filters,
  onFilterChange,
  onSearch,
  onClear,
  loading = false,
  isDebouncing = false,
}) => {
  const { t } = useTranslation();
  const locale = t("common.locale") === "es-ES" ? "es" : "en";

  const renderFilter = ({
    key,
    label,
    type,
    value,
    placeholder,
    options = [],
  }) => {
    switch (type) {
      case "text":
        return (
          <TextField
            fullWidth
            size="small"
            label={label}
            placeholder={placeholder || label}
            value={value || ""}
            onChange={(e) => onFilterChange(key, e.target.value)}
            sx={filterStyles.inputFilter}
          />
        );

      case "select":
        return (
          <FormControl fullWidth size="small" sx={selectSx}>
            <InputLabel sx={filterStyles.multiOptionFilter?.inputLabelSection}>
              {label}
            </InputLabel>
            <Select
              value={value || ""}
              onChange={(e) => onFilterChange(key, e.target.value)}
              label={label}
              MenuProps={selectMenuProps}
              sx={filterStyles.multiOptionFilter?.selectSection}
            >
              <MenuItem value="">
                <em>{t("common.all")}</em>
              </MenuItem>
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "date":
        return (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={locale}
          >
            <DatePicker
              label={label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => {
                const formatted = newValue ? newValue.format("YYYY-MM-DD") : "";
                onFilterChange(key, formatted);
              }}
              slotProps={datePickerSlotProps}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Collapse in={isOpen} timeout={300} unmountOnExit>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          mb: 2,
          backgroundColor: colors.surface,
          borderRadius: "1rem",
          border: `1px solid ${colors.border}`,
          justifyContent: "center",
          //width:'20vh' //Table width
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0.5,
            justifyItems: "center",
          }}
        >
          {filters.map((filterConfig) => (
            <Box key={filterConfig.key} sx={{ width: "100%" }}>
              {renderFilter(filterConfig)}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 2,
          }}
        >
          <Tooltip title={t("common.search")}>
            <span>
              <IconButton
                onClick={onSearch}
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
          <Tooltip title={t("common.clear")}>
            <IconButton onClick={onClear} sx={buttonIconNoLabel}>
              <FilterListOffIcon
                fontSize="small"
                sx={{ color: colors.primary }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Collapse>
  );
};
