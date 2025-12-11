import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { ClientsTabDesktop } from "./ClientsTabDesktop";
import { ClientsTabMobile } from "./ClientsTabMobile";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "../../../../store/api/adminApi";
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
import {
  primaryButton,
  outlinedButton,
} from "../../../../common/styles/styles";

/**
 * Componente unificado ClientsTab que maneja la lógica de datos
 * y renderiza la versión móvil o desktop según el breakpoint actual.
 */
export const ClientsTab = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  // RTK Query hooks
  const { data: clients = [], isLoading, error } = useGetClientsQuery();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  // State management
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDeactivate, setClientToDeactivate] = useState(null);

  // Form state
  const [clientForm, setClientForm] = useState({
    name: "",
    isProspect: false,
    isActive: true,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Computed values
  const isSaving = isCreating || isUpdating;

  const handleEdit = (client) => {
    try {
      setEditingClient(client);
      setClientForm({
        name: client.name,
        isProspect: client.isProspect,
        isActive: client.isActive,
      });
      setShowCreateDialog(true);
    } catch (err) {
      console.log(`ERROR handleEdit: ${err}`);
    }
  };

  const handleDeactivate = (client) => {
    try {
      setClientToDeactivate(client);
      setShowConfirmDialog(true);
    } catch (err) {
      console.log(`ERROR handleDeactivate: ${err}`);
    }
  };

  const confirmDeactivation = async () => {
    try {
      await deleteClient(clientToDeactivate.id).unwrap();
      showNotification(t("clients.messages.clientDeactivated"), "success");
      setShowConfirmDialog(false);
      setClientToDeactivate(null);
    } catch (error) {
      console.log(`ERROR confirmDeactivation: ${error}`);
      showNotification(t("clients.messages.clientDeactivateFailed"), "error");
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    try {
      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientForm }).unwrap();
        showNotification(t("clients.messages.clientUpdated"), "success");
      } else {
        await createClient(clientForm).unwrap();
        showNotification(t("clients.messages.clientCreated"), "success");
      }

      handleCloseDialog();
    } catch (error) {
      console.log(`ERROR handleSave: ${error}`);
      const errorMessage = error.data?.error || t("clients.messages.clientSaveFailed");
      showNotification(errorMessage, "error");
    }
  };

  const handleCloseDialog = () => {
    try {
      setShowCreateDialog(false);
      setEditingClient(null);
      setClientForm({
        name: "",
        isProspect: false,
        isActive: true,
      });
    } catch (err) {
      console.log(`ERROR handleCloseDialog: ${err}`);
    }
  };

  const isFormValid = () => {
    try {
      return clientForm.name && clientForm.name.length >= 2;
    } catch (err) {
      console.log(`ERROR isFormValid: ${err}`);
      return false;
    }
  };

  const formatDate = (dateString) => {
    try {
      const locale = t("common.locale") || "en-US";
      return new Date(dateString).toLocaleDateString(locale);
    } catch (err) {
      console.log(`ERROR formatDate: ${err}`);
      return dateString;
    }
  };

  const showNotification = (message, severity = "success") => {
    try {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    } catch (err) {
      console.log(`ERROR showNotification: ${err}`);
    }
  };

  const handleCloseSnackbar = () => {
    try {
      setSnackbar({ ...snackbar, open: false });
    } catch (err) {
      console.log(`ERROR handleCloseSnackbar: ${err}`);
    }
  };

  const sharedProps = {
    clients,
    isLoading,
    handleEdit,
    handleDeactivate,
    formatDate,
    onAddClick: () => setShowCreateDialog(true),
  };

  return (
    <>
      {isMobile ? (
        <ClientsTabMobile {...sharedProps} />
      ) : (
        <ClientsTabDesktop {...sharedProps} />
      )}

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
