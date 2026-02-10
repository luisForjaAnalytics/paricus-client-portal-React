import { forwardRef, useMemo, useCallback } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { selectMenuProps, modalCard, colors } from "../../../styles/styles";
import { getPriorityStyles } from "../../../utils/getStatusProperty";

const CHECK_ICON_SX = { fontSize: "1rem", color: colors.primary };
const UNCHECK_ICON_SX = { fontSize: "1rem" };
const DOT_BASE_SX = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  marginRight: "0.3rem",
};

/**
 * SelectMenuItem - Reusable Select component with normalized options
 *
 * Supports single/multiple selection, checkmarks, priority dots, and Select All.
 * Compatible with React Hook Form via `field` prop.
 *
 * @example Single select
 * <SelectMenuItem name="status" label="Status" options={statusOptions} value={status} onChange={setStatus} />
 *
 * @example Multiple select with Select All
 * <SelectMenuItem name="clients" label="Clients" options={clientOptions} value={selected} onChange={setSelected} multiple showCheck selectAllLabel="selectAll" />
 */
export const SelectMenuItem = forwardRef(
  (
    {
      name,
      label,
      options = [],
      value,
      onChange,
      field,
      error = false,
      required = false,
      disabled = false,
      fullWidth = true,
      size = "medium",
      sx,
      formControlSx,
      menuItemSx,
      inputLabelSx,
      showDot = false,
      showCheck = false,
      multiple = false,
      selectAllLabel,
      chipSx,
    },
    ref
  ) => {
    const { t } = useTranslation();

    // Normalize options — supports both strings and objects
    const normalizedOptions = useMemo(() => {
      if (!Array.isArray(options)) return [];
      return options.map((opt) =>
        typeof opt === "string" ? { value: opt, labelKey: opt } : opt
      );
    }, [options]);

    // Early return after hooks
    if (normalizedOptions.length === 0 && !Array.isArray(options)) {
      console.warn("SelectMenuItem: options must be an array");
      return null;
    }

    // Resolve the current value safely
    const currentValue = value ?? (multiple ? [] : "");

    // Check if all options are selected (multiple mode)
    const allValues = useMemo(
      () => normalizedOptions.map((o) => o.value),
      [normalizedOptions]
    );
    const allSelected =
      multiple &&
      normalizedOptions.length > 0 &&
      Array.isArray(currentValue) &&
      allValues.every((v) => currentValue.includes(v));

    // Dispatch value to either field (React Hook Form) or onChange
    const dispatch = useCallback(
      (newValue) => {
        try {
          if (field?.onChange) {
            field.onChange(newValue);
          } else if (onChange) {
            onChange(newValue);
          }
        } catch (err) {
          console.error("SelectMenuItem: dispatch error", err);
        }
      },
      [field, onChange]
    );

    const handleChange = useCallback(
      (event) => {
        try {
          const newValue = event.target.value;

          // Handle "Select All" toggle in multiple mode
          if (multiple && selectAllLabel && newValue.includes("__select_all__")) {
            dispatch(allSelected ? [] : allValues);
            return;
          }

          dispatch(newValue);
        } catch (err) {
          console.error("SelectMenuItem: onChange error", err);
        }
      },
      [multiple, selectAllLabel, allSelected, allValues, dispatch]
    );

    // Check if a specific option is selected
    const isSelected = useCallback(
      (optionValue) => {
        if (multiple) {
          return Array.isArray(currentValue) && currentValue.includes(optionValue);
        }
        return currentValue === optionValue;
      },
      [multiple, currentValue]
    );

    // Get dot color for priority indicators
    const getDotColor = useCallback((optionValue) => {
      try {
        const key = String(optionValue).toLowerCase();
        const styles = getPriorityStyles(key);
        return styles?.color || "#757575";
      } catch {
        return "#757575";
      }
    }, []);

    // Render check icon based on selection state
    const renderCheckIcon = (selected) =>
      selected ? (
        <CheckBox sx={CHECK_ICON_SX} />
      ) : (
        <CheckBoxOutlineBlank sx={UNCHECK_ICON_SX} />
      );

    // Render chip(s) for multiple select display
    const renderMultipleValue = useCallback(
      (selected) => {
        if (!selected || selected.length === 0) return null;
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            <Chip
              label={
                allSelected && selectAllLabel
                  ? t(selectAllLabel)
                  : `${selected.length} ${t("selectMenuItem.selected", "selected")}`
              }
              size="small"
              color={allSelected ? "primary" : "default"}
              sx={chipSx}
            />
          </Box>
        );
      },
      [allSelected, selectAllLabel, chipSx, t]
    );

    const fontSize = size === "small" ? "0.75rem" : "inherit";
    const labelId = `${name}-select-label`;
    const selectId = `${name}-select`;

    return (
      <FormControl
        fullWidth={fullWidth}
        required={required}
        error={error}
        disabled={disabled}
        size={size}
        sx={formControlSx}
      >
        <InputLabel
          id={labelId}
          sx={inputLabelSx || modalCard?.multiOptionFilter?.inputLabelSection}
        >
          {t(label)}
        </InputLabel>
        <Select
          ref={ref}
          labelId={labelId}
          id={selectId}
          value={currentValue}
          onChange={handleChange}
          label={t(label)}
          MenuProps={selectMenuProps}
          multiple={multiple}
          {...(multiple && {
            input: <OutlinedInput label={t(label)} />,
            renderValue: renderMultipleValue,
          })}
          sx={{
            ...modalCard?.multiOptionFilter?.selectSection,
            height: multiple ? "auto" : "3rem",
            ...sx,
          }}
          {...(field && {
            name: field.name,
            onBlur: field.onBlur,
          })}
        >
          {/* Select All option (multiple mode only) */}
          {multiple && selectAllLabel && (
            <MenuItem
              value="__select_all__"
              sx={{ color: "text.primary", ...menuItemSx }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {showCheck && renderCheckIcon(allSelected)}
                <Typography fontSize={fontSize} fontWeight="bold">
                  {t(selectAllLabel)}
                </Typography>
              </Box>
            </MenuItem>
          )}

          {/* Option items */}
          {normalizedOptions.map((option, index) => (
            <MenuItem
              key={option.value ?? index}
              value={option.value}
              sx={{ color: "text.primary", ...menuItemSx }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {showCheck && renderCheckIcon(isSelected(option.value))}
                {showDot && (
                  <Box
                    sx={{
                      ...DOT_BASE_SX,
                      backgroundColor: getDotColor(option.value),
                    }}
                  />
                )}
                <Typography fontSize={fontSize}>
                  {t(option.labelKey)}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

SelectMenuItem.displayName = "SelectMenuItem";

SelectMenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        labelKey: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  onChange: PropTypes.func,
  field: PropTypes.object,
  error: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  sx: PropTypes.object,
  formControlSx: PropTypes.object,
  menuItemSx: PropTypes.object,
  inputLabelSx: PropTypes.object,
  showDot: PropTypes.bool,
  showCheck: PropTypes.bool,
  multiple: PropTypes.bool,
  selectAllLabel: PropTypes.string,
  chipSx: PropTypes.object,
};
