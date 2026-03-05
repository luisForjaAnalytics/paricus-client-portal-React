import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Block as BlockIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useTranslation } from "react-i18next";
import { colors, modalCard } from "../../../styles/styles";
import { ActionButton } from "../ActionButton";
import { CancelButton } from "../CancelButton";
import { LoadingProgress } from "../LoadingProgress";
import { logger } from "../../../utils/logger";

/**
 * DeactivateButton - Botón de activación/desactivación con diálogo de confirmación
 *
 * Props:
 * - handleDeactivate: función async que ejecuta la acción (recibe item)
 * - item: objeto a activar/desactivar (client, user, etc.)
 * - itemName: nombre del item para mostrar en el diálogo (ej: "Flex Mobile")
 * - itemType: tipo de item para traducción (ej: "client", "user")
 * - isActive: estado actual del item (true = activo, false = inactivo)
 * - title: tooltip del botón
 * - onSuccess: callback después de ejecutar exitosamente
 * - onError: callback después de un error
 */
export const DeactivateButton = ({
  handleDeactivate,
  item,
  itemName,
  itemType = "item",
  title,
  icon,
  sx,
  color = "",
  size = "medium",
  disabled = false,
  isActive = true,
  onSuccess,
  onError,
  confirmTitle,
  confirmMessage,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const handleClickOpen = () => {
    if (disabled) return;
    setOpen(true);
  };

  const handleClose = () => {
    if (isDeactivating) return;
    setOpen(false);
  };

  const handleConfirmDeactivate = async () => {
    if (!handleDeactivate) {
      logger.error("DeactivateButton: handleDeactivate prop is required");
      return;
    }

    setIsDeactivating(true);

    try {
      await handleDeactivate(item);

      setOpen(false);

      if (onSuccess) {
        onSuccess(item);
      }
    } catch (error) {
      logger.error("DeactivateButton error:", error);

      if (onError) {
        onError(error, item);
      }
    } finally {
      setIsDeactivating(false);
    }
  };

  const dialogTitle =
    confirmTitle ||
    (isActive
      ? t("common.confirmDeactivateTitle", {
          item: t(`common.${itemType}`) || t("common.item"),
        })
      : t("common.confirmActivateTitle", {
          item: t(`common.${itemType}`) || t("common.item"),
        }));

  const dialogMessage =
    confirmMessage ||
    (isActive
      ? t("common.confirmDeactivateMessage", {
          item: itemName || t(`common.${itemType}`) || t("common.item"),
        })
      : t("common.confirmActivateMessage", {
          item: itemName || t(`common.${itemType}`) || t("common.item"),
        }));

  return (
    <>
      <Tooltip title={title || t("common.deactivate")}>
        <span>
          <IconButton
            color={color}
            size={size}
            onClick={handleClickOpen}
            disabled={disabled}
            sx={{ ...sx }}
          >
            {icon || (
              <PermIdentityIcon
                fontSize={size}
                sx={{ color: !isActive ? colors.textIcon : colors.desactivateButton }}
              />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        aria-labelledby="deactivate-dialog-title"
        slotProps={{
          paper: {
            sx: modalCard?.dialogSection,
          },
        }}
        aria-describedby="deactivate-dialog-description"
      >
        <DialogTitle id="deactivate-dialog-title">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ color: colors.error }} />
            {dialogTitle}
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="deactivate-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1, justifyContent: "center" }}>
          <ActionButton
            handleClick={handleConfirmDeactivate}
            disabled={isDeactivating}
            text={
              isDeactivating
                ? (isActive ? t("common.deactivating") : t("common.activating"))
                : (isActive ? t("common.deactivate") : t("common.activate"))
            }
            icon={
              isDeactivating ? <LoadingProgress size={16} /> : <BlockIcon />
            }
          />
          <CancelButton
            handleClick={handleClose}
            disabled={isDeactivating}
            text={t("common.cancel")}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

DeactivateButton.propTypes = {
  handleDeactivate: PropTypes.func.isRequired,
  item: PropTypes.any,
  itemName: PropTypes.string,
  itemType: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.node,
  sx: PropTypes.object,
  color: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  confirmTitle: PropTypes.string,
  confirmMessage: PropTypes.string,
};

export default DeactivateButton;
