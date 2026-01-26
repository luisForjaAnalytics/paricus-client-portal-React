import { memo } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { boxTypography, headerTitleBox } from "../../../styles/styles";

/**
 * HeaderBoxTypography - Componente reutilizable para títulos de sección
 *
 * @param {string} text - Texto del título (requerido)
 * @param {string} variant - Variante de Typography (h4, h5, h6, subtitle1, subtitle2)
 * @param {object} sx - Estilos adicionales para el Box contenedor
 * @param {object} typographySx - Estilos adicionales para el Typography
 * @param {node} icon - Icono opcional a mostrar antes del texto
 * @param {string} component - Componente HTML a renderizar (h1, h2, div, etc.)
 */
const HeaderBoxTypographyComponent = ({
  text,
  variant = "h5",
  sx = {},
  typographySx = {},
  icon = null,
  component = "h2",
}) => {
  // Validación: si no hay texto, no renderizar nada
  if (!text || typeof text !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "HeaderBoxTypography: 'text' prop is required and must be a string"
      );
    }
    return null;
  }

  return (
    <Box
      sx={{
        ...headerTitleBox,
        ...sx,
      }}
    >
      {icon && (
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 1,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        variant={variant}
        component={component}
        sx={{
          ...boxTypography.typography,
          ...typographySx,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

HeaderBoxTypographyComponent.propTypes = {
  /** Texto del título - requerido */
  text: PropTypes.string.isRequired,
  /** Variante de Typography de MUI */
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
  ]),
  /** Estilos adicionales para el Box contenedor */
  sx: PropTypes.object,
  /** Estilos adicionales para el Typography */
  typographySx: PropTypes.object,
  /** Icono opcional a mostrar antes del texto */
  icon: PropTypes.node,
  /** Componente HTML semántico a renderizar */
  component: PropTypes.string,
};

// Memoizar para evitar re-renders innecesarios
export const HeaderBoxTypography = memo(HeaderBoxTypographyComponent);

// Nombre para DevTools
HeaderBoxTypography.displayName = "HeaderBoxTypography";

export default HeaderBoxTypography;
