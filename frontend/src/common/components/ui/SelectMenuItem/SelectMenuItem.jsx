import { forwardRef } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { selectMenuProps, modalCard } from "../../../styles/styles";
import { getPriorityStyles } from "../../../utils/getStatusProperty";

/**
 * SelectMenuItem - Componente reutilizable para Select con opciones
 *
 * @param {Object} props
 * @param {string} props.name - Nombre del campo (para id y labelId)
 * @param {string} props.label - Key de traducción para el label
 * @param {Array} props.options - Array de opciones: [{ value, labelKey, dot? }] o strings
 * @param {string|number} props.value - Valor seleccionado
 * @param {Function} props.onChange - Función callback cuando cambia el valor
 * @param {Object} props.field - Props de React Hook Form field (opcional)
 * @param {boolean} props.error - Si hay error de validación
 * @param {boolean} props.required - Si es campo requerido
 * @param {boolean} props.disabled - Si está deshabilitado
 * @param {boolean} props.fullWidth - Si ocupa todo el ancho
 * @param {string} props.size - Tamaño del select ("small" | "medium")
 * @param {Object} props.sx - Estilos adicionales para el Select
 * @param {Object} props.formControlSx - Estilos adicionales para el FormControl
 * @param {Object} props.menuItemSx - Estilos adicionales para los MenuItem
 * @param {boolean} props.showDot - Mostrar indicador de color (para priority)
 * @param {string} props.dotColorKey - Key para obtener color del dot (default: usa getPriorityStyles)
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
    },
    ref
  ) => {
    const { t } = useTranslation();

    // Validación de props
    if (!options || !Array.isArray(options)) {
      console.warn("SelectMenuItem: options debe ser un array");
      return null;
    }

    // Normalizar opciones - soporta tanto objetos como strings
    const normalizedOptions = options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, labelKey: opt };
      }
      return opt;
    });

    // Manejar cambio de valor
    const handleChange = (event) => {
      try {
        const newValue = event.target.value;
        if (field?.onChange) {
          field.onChange(newValue);
        } else if (onChange) {
          onChange(newValue);
        }
      } catch (err) {
        console.error(`SelectMenuItem: onChange Error ${err}`);
      }
    };

    // Obtener color del dot basado en el valor
    const getDotColor = (optionValue) => {
      try {
        const styles = getPriorityStyles(optionValue.toLowerCase());
        return styles?.color || "#757575";
      } catch {
        return "#757575";
      }
    };

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
          value={value ?? ""}
          onChange={handleChange}
          label={t(label)}
          MenuProps={selectMenuProps}
          sx={{
            ...modalCard?.multiOptionFilter?.selectSection,
            height: "3rem",
            ...sx,
          }}
          {...(field && {
            name: field.name,
            onBlur: field.onBlur,
          })}
        >
          {normalizedOptions.map((option, index) => (
            <MenuItem
              key={option.value || index}
              value={option.value}
              sx={{ color: "text.primary", ...menuItemSx }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {showDot && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      marginRight: "0.3rem",
                      backgroundColor: getDotColor(option.value),
                    }}
                  />
                )}
                <Typography
                  fontSize={size === "small" ? "0.75rem" : "inherit"}
                >
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
};
