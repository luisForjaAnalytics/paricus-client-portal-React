import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  primaryButton,
  modalCard,
  titlesTypography,
  colors,
} from "../../../../common/styles/styles";
import { ActionButton } from "../../../../common/components/ui/ActionButton";
import { CancelButton } from "../../../../common/components/ui/CancelButton";
import { AlertInline } from "../../../../common/components/ui/AlertInline";

export const AddNewClientModal = ({
  editingClient,
  showCreateDialog,
  showConfirmDialog,
  handleSave,
  handleCloseDialog,
  clientForm,
  isSaving,
  isFormValid,
  clientToDeactivate,
  confirmDeactivation,
  notificationRef,
  setClientForm,
  setShowConfirmDialog
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            sx: modalCard?.dialogSection,
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                ...titlesTypography?.primaryTitle,
                textAlign: "center",
              }}
            >
              {editingClient ? t("clients.editClient") : t("clients.addClient")}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          
          <TextField
            label={t("clients.form.clientName")}
            required
            fullWidth
            value={clientForm.name}
            onChange={(e) =>
              setClientForm({ ...clientForm, name: e.target.value })
            }
            sx={modalCard?.inputSection}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={clientForm.isProspect}
                onChange={(e) =>
                  setClientForm({ ...clientForm, isProspect: e.target.checked })
                }
                sx={{
                  "&.Mui-checked": {
                    color: colors.primary,
                  },
                }}
              />
            }
            label={t("clients.form.isProspect")}
            sx={{ margin: "1rem 0 0 0rem", display: "block" }}
          />
          {editingClient && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={clientForm.isActive}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, isActive: e.target.checked })
                  }
                  sx={{
                    "&.Mui-checked": {
                      color: colors.primary,
                    },
                  }}
                />
              }
              label={t("clients.form.active")}
              sx={{ margin: "1rem 0 0 0rem", display: "block" }}
            />
          )}
        </DialogContent>
        <DialogActions
          sx={{
            margin: "0 0 0 0",
            justifyContent: "center",
          }}
        >
          <ActionButton
            handleClick={handleSave}
            disabled={isSaving || !isFormValid()}
            text={isSaving ? t("common.saving") : t("common.save")}
            sx={{ width: "20%" }}
          />
          <CancelButton
            handleClick={handleCloseDialog}
            text={t("common.cancel")}
          />
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("clients.confirmDeactivation")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("clients.deactivationWarning")} "{clientToDeactivate?.name}"?{" "}
            {t("clients.deactivationWarningContinue")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <CancelButton
            handleClick={() => setShowConfirmDialog(false)}
            text={t("common.cancel")}
          />
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeactivation}
            sx={primaryButton}
          >
            {t("clients.actions.deactivate")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <AlertInline ref={notificationRef} asSnackbar />
    </>
  );
};
