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
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {editingClient ? t("clients.editClient") : t("clients.addClient")}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
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
            sx={{ mb: 3 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={clientForm.isProspect}
                onChange={(e) =>
                  setClientForm({ ...clientForm, isProspect: e.target.checked })
                }
              />
            }
            label={t("clients.form.isProspect")}
            sx={{ mb: 2, display: "block" }}
          />
          {editingClient && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={clientForm.isActive}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, isActive: e.target.checked })
                  }
                />
              }
              label={t("clients.form.active")}
              sx={{ display: "block" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || !isFormValid()}
            sx={primaryButton}
          >
            {isSaving ? t("common.saving") : t("common.save")}
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
