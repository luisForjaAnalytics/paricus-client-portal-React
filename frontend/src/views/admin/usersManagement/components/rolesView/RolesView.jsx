import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetClientsQuery,
  useGetPermissionsQuery,
  useLazyGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation
} from '../../../../../store/api/adminApi';

export const RolesView = () => {
  // RTK Query hooks
  const { data: roles = [], isLoading, error } = useGetRolesQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: permissions = [] } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [getRolePermissions] = useLazyGetRolePermissionsQuery();
  const [updateRolePermissions, { isLoading: isUpdatingPermissions }] = useUpdateRolePermissionsMutation();

  // Dialog states
  const [dialog, setDialog] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Selection states
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Form state
  const [roleForm, setRoleForm] = useState({
    role_name: '',
    description: '',
    client_id: null
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Computed values
  const isSaving = isCreating || isUpdating;

  const openAddDialog = () => {
    setEditingRole(null);
    setRoleForm({
      role_name: '',
      description: '',
      client_id: null
    });
    setDialog(true);
  };

  const openEditDialog = (role) => {
    setEditingRole(role);
    setRoleForm({
      role_name: role.role_name,
      description: role.description || '',
      client_id: role.client_id
    });
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
    setEditingRole(null);
    setRoleForm({
      role_name: '',
      description: '',
      client_id: null
    });
  };

  const openPermissionsDialog = async (role) => {
    setSelectedRole(role);

    if (!role.id) {
      showNotification('Invalid role selected', 'error');
      return;
    }

    try {
      const result = await getRolePermissions(role.id).unwrap();
      setSelectedPermissions(result);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      setSelectedPermissions([]);
    }

    setPermissionsDialog(true);
  };

  const closePermissionsDialog = () => {
    setPermissionsDialog(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const saveRole = async () => {
    if (!isFormValid()) return;

    try {
      if (editingRole) {
        const updateData = {
          id: editingRole.id,
          role_name: roleForm.role_name,
          description: roleForm.description,
          client_id: roleForm.client_id
        };
        await updateRole(updateData).unwrap();
        showNotification('Role updated successfully', 'success');
      } else {
        const roleData = {
          clientId: roleForm.client_id,
          roleName: roleForm.role_name,
          description: roleForm.description,
          permissionIds: []
        };

        if (!roleData.clientId) {
          showNotification('Please select a client for this role', 'error');
          return;
        }

        await createRole(roleData).unwrap();
        showNotification('Role created successfully', 'success');
      }

      closeDialog();
    } catch (error) {
      const errorMessage = error.data?.error || error.data?.message || 'Failed to save role';
      showNotification(errorMessage, 'error');
    }
  };

  const savePermissions = async () => {
    if (!selectedRole?.id) {
      showNotification('Invalid role selected', 'error');
      return;
    }

    try {
      await updateRolePermissions({
        roleId: selectedRole.id,
        permissions: selectedPermissions
      }).unwrap();

      showNotification('Permissions updated successfully', 'success');
      closePermissionsDialog();
    } catch (error) {
      const errorMessage = error.data?.error || 'Failed to save permissions';
      showNotification(errorMessage, 'error');
    }
  };

  const confirmDelete = (role) => {
    setRoleToDelete(role);
    setDeleteDialog(true);
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleToDelete.id).unwrap();
      showNotification('Role deleted successfully', 'success');
      setDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      const errorMessage = error.data?.error || 'Failed to delete role';
      showNotification(errorMessage, 'error');
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const isFormValid = () => {
    return roleForm.role_name && roleForm.role_name.length >= 2 && roleForm.client_id;
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

  const filteredRoles = selectedClient
    ? roles.filter(role => role.client_id === selectedClient)
    : roles;

  const isProtectedRole = (roleName) => {
    return roleName === 'BPO Admin' || roleName === 'Client Admin';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          {/* <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Role Management
          </Typography> */}
          <Typography variant="body1" color="text.secondary">
            Manage roles and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{ mt: 1 }}
        >
          Add New Role
        </Button>
      </Box>

      {/* Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={selectedClient}
                  label="Client"
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <MenuItem value="">All Clients</MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography color="error">Failed to load roles</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Role Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {role.role_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={role.client_name}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={role.permissions_count || 0} color="info">
                        <ShieldIcon color="action" />
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(role.created_at)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit role">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(role)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Configure permissions">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => openPermissionsDialog(role)}
                        >
                          <SecurityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete role">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => confirmDelete(role)}
                            disabled={isProtectedRole(role.role_name)}
                          >
                            <DeleteIcon fontSize="small" />
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

      {/* Add/Edit Role Dialog */}
      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Role Name"
            required
            fullWidth
            value={roleForm.role_name}
            onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
            sx={{ mb: 3 }}
            error={roleForm.role_name.length > 0 && roleForm.role_name.length < 2}
            helperText={roleForm.role_name.length > 0 && roleForm.role_name.length < 2 ? 'Role name must be at least 2 characters' : ''}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={roleForm.description}
            onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth required>
            <InputLabel>Client</InputLabel>
            <Select
              value={roleForm.client_id || ''}
              label="Client"
              onChange={(e) => setRoleForm({ ...roleForm, client_id: e.target.value })}
              disabled={editingRole && isProtectedRole(editingRole.role_name)}
            >
              {clients.map(client => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveRole}
            disabled={isSaving || !isFormValid()}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialog} onClose={closePermissionsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Configure Permissions - {selectedRole?.role_name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select which permissions this role should have:
          </Typography>
          <Grid container spacing={2}>
            {permissions.map((permission) => (
              <Grid item xs={12} md={6} key={permission.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                    />
                  }
                  label={permission.permissionName || permission.permission_name}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePermissionsDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={savePermissions}
            disabled={isUpdatingPermissions}
          >
            {isUpdatingPermissions ? 'Saving...' : 'Save Permissions'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{roleToDelete?.role_name}"?
            This action cannot be undone and will affect any users assigned to this role.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRole}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'success' ? 3000 : 5000}
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
