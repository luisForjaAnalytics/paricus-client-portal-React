import React, { useState } from "react";
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
    setEditingClient(client);
    setClientForm({
      name: client.name,
      isProspect: client.isProspect,
      isActive: client.isActive,
    });
    setShowCreateDialog(true);
  };

  const handleDeactivate = (client) => {
    setClientToDeactivate(client);
    setShowConfirmDialog(true);
  };

  const confirmDeactivation = async () => {
    try {
      await deleteClient(clientToDeactivate.id).unwrap();
      showNotification("Client deactivated successfully", "success");
      setShowConfirmDialog(false);
      setClientToDeactivate(null);
    } catch (error) {
      showNotification("Failed to deactivate client", "error");
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    try {
      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientForm }).unwrap();
        showNotification("Client updated successfully", "success");
      } else {
        await createClient(clientForm).unwrap();
        showNotification("Client created successfully", "success");
      }

      handleCloseDialog();
    } catch (error) {
      const errorMessage = error.data?.error || "An error occurred";
      showNotification(errorMessage, "error");
    }
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingClient(null);
    setClientForm({
      name: "",
      isProspect: false,
      isActive: true,
    });
  };

  const isFormValid = () => {
    return clientForm.name && clientForm.name.length >= 2;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
              {editingClient ? "Edit Client" : "Add New Client"}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Client Name"
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
            label="Is Prospect"
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
              label="Active"
              sx={{ display: "block" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={outlinedButton}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || !isFormValid()}
            sx={primaryButton}
          >
            {isSaving ? "Saving..." : "Save"}
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
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate "{clientToDeactivate?.name}"?
            This will also deactivate all users associated with this client.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmDialog(false)}
            sx={outlinedButton}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeactivation}
            sx={primaryButton}
          >
            Deactivate
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
