import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * SuccessErrorSnackbar - Componente centralizado para mostrar notificaciones
 *
 * Uso con ref (recomendado para control externo):
 * const snackbarRef = useRef();
 * snackbarRef.current.showSuccess("Operación exitosa");
 * snackbarRef.current.showError("Error en la operación");
 *
 * Uso con props (para control desde el padre):
 * <SuccessErrorSnackbar
 *   open={isOpen}
 *   message="Mensaje"
 *   severity="success"
 *   onClose={handleClose}
 * />
 */
export const SuccessErrorSnackbar = forwardRef(
  (
    {
      open: externalOpen,
      message: externalMessage,
      severity: externalSeverity,
      onClose: externalOnClose,
      autoHideDuration = 4000,
      position = { vertical: "bottom", horizontal: "center" },
    },
    ref
  ) => {
    const { t } = useTranslation();

    // Estado interno para uso con ref
    const [internalState, setInternalState] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    // Determinar si usar estado externo o interno
    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalState.open;
    const message = isControlled ? externalMessage : internalState.message;
    const severity = isControlled ? externalSeverity : internalState.severity;

    // Métodos expuestos via ref
    const showSuccess = useCallback((msg) => {
      try {
        setInternalState({
          open: true,
          message: msg || t("common.operationSuccess"),
          severity: "success",
        });
      } catch (error) {
        console.error("SuccessErrorSnackbar showSuccess error:", error);
      }
    }, [t]);

    const showError = useCallback((msg) => {
      try {
        setInternalState({
          open: true,
          message: msg || t("common.operationError"),
          severity: "error",
        });
      } catch (error) {
        console.error("SuccessErrorSnackbar showError error:", error);
      }
    }, [t]);

    const showWarning = useCallback((msg) => {
      try {
        setInternalState({
          open: true,
          message: msg || t("common.warning"),
          severity: "warning",
        });
      } catch (error) {
        console.error("SuccessErrorSnackbar showWarning error:", error);
      }
    }, [t]);

    const showInfo = useCallback((msg) => {
      try {
        setInternalState({
          open: true,
          message: msg || t("common.info"),
          severity: "info",
        });
      } catch (error) {
        console.error("SuccessErrorSnackbar showInfo error:", error);
      }
    }, [t]);

    const hide = useCallback(() => {
      setInternalState((prev) => ({ ...prev, open: false }));
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

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      if (isControlled && externalOnClose) {
        externalOnClose();
      } else {
        hide();
      }
    };

    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={position}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    );
  }
);

SuccessErrorSnackbar.displayName = "SuccessErrorSnackbar";

SuccessErrorSnackbar.propTypes = {
  // Props para modo controlado (desde el padre)
  open: PropTypes.bool,
  message: PropTypes.string,
  severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
  onClose: PropTypes.func,
  // Props comunes
  autoHideDuration: PropTypes.number,
  position: PropTypes.shape({
    vertical: PropTypes.oneOf(["top", "bottom"]),
    horizontal: PropTypes.oneOf(["left", "center", "right"]),
  }),
};


