import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Alert, Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * AlertInline - Componente unificado para alertas y notificaciones
 *
 * MODO INLINE (por defecto):
 * Alertas persistentes dentro del contenido
 * <AlertInline message="Error message" severity="error" />
 *
 * MODO SNACKBAR (con ref):
 * Notificaciones flotantes temporales
 * const alertRef = useRef();
 * alertRef.current?.showSuccess("Guardado exitosamente");
 * <AlertInline ref={alertRef} asSnackbar />
 */
export const AlertInline = forwardRef(
  (
    {
      // Props para modo inline
      message,
      children,
      severity = "error",
      variant = "standard",
      icon,
      onClose,
      sx = {},
      // Props para modo snackbar
      asSnackbar = false,
      autoHideDuration = 4000,
      position = { vertical: "bottom", horizontal: "center" },
    },
    ref
  ) => {
    const { t } = useTranslation();

    // Estado interno para modo snackbar
    const [snackbarState, setSnackbarState] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    // Métodos expuestos via ref para modo snackbar
    const showSuccess = useCallback(
      (msg) => {
        setSnackbarState({
          open: true,
          message: msg || t("common.operationSuccess"),
          severity: "success",
        });
      },
      [t]
    );

    const showError = useCallback(
      (msg) => {
        setSnackbarState({
          open: true,
          message: msg || t("common.operationError"),
          severity: "error",
        });
      },
      [t]
    );

    const showWarning = useCallback(
      (msg) => {
        setSnackbarState({
          open: true,
          message: msg || t("common.warning"),
          severity: "warning",
        });
      },
      [t]
    );

    const showInfo = useCallback(
      (msg) => {
        setSnackbarState({
          open: true,
          message: msg || t("common.info"),
          severity: "info",
        });
      },
      [t]
    );

    const hide = useCallback(() => {
      setSnackbarState((prev) => ({ ...prev, open: false }));
    }, []);

    // Exponer métodos al padre via ref
    useImperativeHandle(
      ref,
      () => ({
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hide,
      }),
      [showSuccess, showError, showWarning, showInfo, hide]
    );

    const handleSnackbarClose = (_event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      hide();
    };

    // Estilos base del Alert
    const alertStyles = { borderRadius: "1.5rem", ...sx };

    // MODO SNACKBAR: Notificación flotante temporal
    if (asSnackbar) {
      return (
        <Snackbar
          open={snackbarState.open}
          autoHideDuration={autoHideDuration}
          onClose={handleSnackbarClose}
          anchorOrigin={position}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarState.severity}
            variant={variant}
            sx={alertStyles}
          >
            {snackbarState.message}
          </Alert>
        </Snackbar>
      );
    }

    // MODO INLINE: Alerta persistente dentro del contenido
    return (
      <Alert
        severity={severity}
        variant={variant}
        icon={icon}
        onClose={onClose}
        sx={alertStyles}
      >
        {children || message}
      </Alert>
    );
  }
);

AlertInline.displayName = "AlertInline";

AlertInline.propTypes = {
  // Props para modo inline
  message: PropTypes.string,
  children: PropTypes.node,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
  icon: PropTypes.node,
  onClose: PropTypes.func,
  sx: PropTypes.object,
  // Props para modo snackbar
  asSnackbar: PropTypes.bool,
  autoHideDuration: PropTypes.number,
  position: PropTypes.shape({
    vertical: PropTypes.oneOf(["top", "bottom"]),
    horizontal: PropTypes.oneOf(["left", "center", "right"]),
  }),
};
