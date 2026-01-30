import PropTypes from "prop-types";
import { Alert } from "@mui/material";

/**
 * AlertInline - Componente para mostrar mensajes de alerta inline (persistentes)
 * Ideal para estados de error de carga de datos, validaciones, etc.
 *
 * Para notificaciones temporales (feedback de acciones), usar SuccessErrorSnackbar
 *
 * Uso simple:
 * <AlertInline message="Error message" severity="error" />
 *
 * Uso con contenido complejo:
 * <AlertInline severity="warning">
 *   <Typography>Custom content</Typography>
 * </AlertInline>
 */
export const AlertInline = ({
  message,
  children,
  severity = "error",
  variant = "standard",
  icon,
  onClose,
  sx = {},
}) => {
  return (
    <Alert
      severity={severity}
      variant={variant}
      icon={icon}
      onClose={onClose}
      sx={{ borderRadius: "1.5rem", ...sx }}
    >
      {children || message}
    </Alert>
  );
};

AlertInline.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
  icon: PropTypes.node,
  onClose: PropTypes.func,
  sx: PropTypes.object,
};
