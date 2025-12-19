import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  primaryButton,
  outlinedButton,
  modalCard,
  titlesTypography,
  colors,
  primaryIconButton,
} from "../../../../common/styles/styles";

export const AddNewClientModal = ({
  editingClient,
  showCreateDialog,
  showConfirmDialog,
  handleCloseSnackbar,
  handleSave,
  handleCloseDialog,
  clientForm,
  isSaving,
  isFormValid,
  clientToDeactivate,
  confirmDeactivation,
  snackbar,
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
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || !isFormValid()}
            sx={{...primaryIconButton, width:'20%'}}
          >
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
          <Button onClick={handleCloseDialog} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
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
          <Button
            onClick={() => setShowConfirmDialog(false)}
            sx={outlinedButton}
          >
            {t("common.cancel")}
          </Button>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
