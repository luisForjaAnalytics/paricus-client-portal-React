import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation
} from '../../../../../store/api/adminApi';

export const ClientsView = () => {
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
    name: '',
    isProspect: false,
    isActive: true
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Computed values
  const isSaving = isCreating || isUpdating;

  const handleEdit = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      isProspect: client.isProspect,
      isActive: client.isActive
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
      showNotification('Client deactivated successfully', 'success');
      setShowConfirmDialog(false);
      setClientToDeactivate(null);
    } catch (error) {
      showNotification('Failed to deactivate client', 'error');
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    try {
      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientForm }).unwrap();
        showNotification('Client updated successfully', 'success');
      } else {
        await createClient(clientForm).unwrap();
        showNotification('Client created successfully', 'success');
      }

      handleCloseDialog();
    } catch (error) {
      const errorMessage = error.data?.error || 'An error occurred';
      showNotification(errorMessage, 'error');
    }
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingClient(null);
    setClientForm({
      name: '',
      isProspect: false,
      isActive: true
    });
  };

  const isFormValid = () => {
    return clientForm.name && clientForm.name.length >= 2;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          {/* <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Client Management
          </Typography> */}
          <Typography variant="body1" color="text.secondary">
            Manage and configure client accounts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{ mt: 1 }}
        >
          Add New Client
        </Button>
      </Box>

      {/* Data Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography color="error">Failed to load clients</Typography>
          </Box>
        ) : clients.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">No clients found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {client.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.isProspect ? 'Prospect' : 'Client'}
                        color={client.isProspect ? 'warning' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.isActive ? 'Active' : 'Inactive'}
                        color={client.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{client.userCount || 0}</TableCell>
                    <TableCell>{client.roleCount || 0}</TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit client">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(client)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate client">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDeactivate(client)}
                            disabled={!client.isActive}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {editingClient ? 'Edit Client' : 'Add New Client'}
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
            onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={clientForm.isProspect}
                onChange={(e) => setClientForm({ ...clientForm, isProspect: e.target.checked })}
              />
            }
            label="Is Prospect"
            sx={{ mb: 2, display: 'block' }}
          />
          {editingClient && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={clientForm.isActive}
                  onChange={(e) => setClientForm({ ...clientForm, isActive: e.target.checked })}
                />
              }
              label="Active"
              sx={{ display: 'block' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || !isFormValid()}
          >
            {isSaving ? 'Saving...' : 'Save'}
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
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDeactivation}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

