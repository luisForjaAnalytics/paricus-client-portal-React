import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

export const RolesView = () => {
  // State management
  const [roles, setRoles] = useState([]);
  const [clients, setClients] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Fetch data on mount
  useEffect(() => {
    fetchRoles();
    fetchClients();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/roles');
      const mappedRoles = response.data.roles.map(role => ({
        id: role.id,
        client_id: role.clientId,
        client_name: role.clientName,
        role_name: role.roleName,
        description: role.description,
        permissions_count: role.permissions?.length || 0,
        created_at: role.createdAt
      }));
      setRoles(mappedRoles);
    } catch (error) {
      showNotification('Failed to load roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/admin/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/api/admin/permissions');
      setPermissions(response.data.permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

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
      const response = await axios.get(`/api/admin/roles/${role.id}/permissions`);
      setSelectedPermissions(response.data.permissions.map(p => p.permissionId));
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

    setSaving(true);
    try {
      if (editingRole) {
        const updateData = {
          role_name: roleForm.role_name,
          description: roleForm.description,
          client_id: roleForm.client_id
        };
        await axios.put(`/api/admin/roles/${editingRole.id}`, updateData);
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
          setSaving(false);
          return;
        }

        await axios.post('/api/admin/roles', roleData);
        showNotification('Role created successfully', 'success');
      }

      await fetchRoles();
      closeDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to save role';
      showNotification(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const savePermissions = async () => {
    if (!selectedRole?.id) {
      showNotification('Invalid role selected', 'error');
      return;
    }

    setSavingPermissions(true);
    try {
      await axios.put(`/api/admin/roles/${selectedRole.id}/permissions`, {
        permissions: selectedPermissions
      });

      const index = roles.findIndex(r => r.id === selectedRole.id);
      if (index !== -1) {
        const updatedRoles = [...roles];
        updatedRoles[index].permissions_count = selectedPermissions.length;
        setRoles(updatedRoles);
      }

      showNotification('Permissions updated successfully', 'success');
      closePermissionsDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save permissions';
      showNotification(errorMessage, 'error');
    } finally {
      setSavingPermissions(false);
    }
  };

  const confirmDelete = (role) => {
    setRoleToDelete(role);
    setDeleteDialog(true);
  };

  const deleteRole = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/roles/${roleToDelete.id}`);
      setRoles(roles.filter(r => r.id !== roleToDelete.id));
      showNotification('Role deleted successfully', 'success');
      setDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete role';
      showNotification(errorMessage, 'error');
    } finally {
      setDeleting(false);
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
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Role Management
          </Typography>
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress />
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
            disabled={saving || !isFormValid()}
          >
            {saving ? 'Saving...' : 'Save'}
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
            disabled={savingPermissions}
          >
            {savingPermissions ? 'Saving...' : 'Save Permissions'}
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
            onClick={deleteRole}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
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

