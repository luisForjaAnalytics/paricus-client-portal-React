import { useState, useMemo } from "react";
import { ClientsTabMobile } from "./ClientsTabMobile";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "../../../../store/api/adminApi";
import {
  primaryButton,
  primaryIconButton,
  outlinedButton,
  colors,
  typography,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

export const ClientsTabDesktop = () => {
  const { t } = useTranslation();

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

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Client Name",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.row.isProspect ? "Prospect" : "Client"}
            color={params.row.isProspect ? "warning" : "primary"}
            size="small"
          />
        ),
      },
      {
        field: "isActive",
        headerName: "Status",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value ? "Active" : "Inactive"}
            color={params.value ? "success" : "error"}
            size="small"
          />
        ),
      },
      {
        field: "userCount",
        headerName: "Users",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "roleCount",
        headerName: "Roles",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "createdAt",
        headerName: "Created",
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Edit client">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deactivate client">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleDeactivate(params.row.original)}
                  disabled={!params.row.isActive}
                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  // Transform clients data for DataGrid
  const rows = useMemo(
    () =>
      clients.map((client) => ({
        id: client.id,
        name: client.name,
        isProspect: client.isProspect,
        isActive: client.isActive,
        userCount: client.userCount || 0,
        roleCount: client.roleCount || 0,
        createdAt: client.createdAt,
        original: client, // Keep original object for actions
      })),
    [clients]
  );

  return (
    <Box>
      {/* Page Header
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          Client Management
        </Typography>
      </Box> */}

      {/* Header - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          alignItems: "center",
          padding:'0 5rem 0 1.5rem',
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{ ...primaryIconButton, mt: 1 }}
        >
          Add New Client
        </Button>
      </Box>

      {/* Data Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "40vh",
          width: "100%",
          padding:'0 1.5rem 0 1.5rem'
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnResize
          sx={{
            borderRadius: "0.7rem",
            padding: "1rem 0 0 0",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5 !important",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f5f5f5 !important",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-sortIcon": {
              color: colors.primary,
            },
            "& .MuiDataGrid-columnHeader--sorted": {
              backgroundColor: "#e8f5e9 !important",
            },
            "& .MuiDataGrid-filler": {
              display: "none",
            },
            "& .MuiDataGrid-scrollbarFiller": {
              display: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
            },
          }}
        />
      </Box>

      {/* Mobile View */}
      <ClientsTabMobile
        clients={clients}
        handleEdit={handleEdit}
        handleDeactivate={handleDeactivate}
        formatDate={formatDate}
        onAddClick={() => setShowCreateDialog(true)}
      />

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
    </Box>
  );
};
