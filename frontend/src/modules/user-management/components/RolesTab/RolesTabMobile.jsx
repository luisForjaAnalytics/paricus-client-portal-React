import React, { useState, useMemo } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Tooltip,
  Button,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Shield as ShieldIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetClientsQuery,
  useGetPermissionsQuery,
  useLazyGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
} from "../../../../store/api/adminApi";
import {
  primaryButton,
  outlinedButton,
  titlesTypography,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

function Row({
  role,
  clients,
  openEditDialog,
  openPermissionsDialog,
  openDeleteDialog,
}) {
  const [open, setOpen] = React.useState(false);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown";
  };

  const isProtectedRole = (roleName) => {
    return roleName === "BPO Admin" || roleName === "Client Admin";
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShieldIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {role.role_name}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                fontWeight="bold"
              >
                {role.role_name}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Client */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 110 }}
                  >
                    Client:
                  </Typography>
                  <Chip
                    label={getClientName(role.client_id)}
                    size="small"
                    color="primary"
                  />
                </Box>

                {/* Description */}
                {role.description && (
                  <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ minWidth: 110 }}
                    >
                      Description:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                )}

                {/* Permissions Count */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 110 }}
                  >
                    Permissions:
                  </Typography>
                  <Badge
                    badgeContent={role.permissions_count || 0}
                    color="primary"
                  >
                    <SecurityIcon color="action" fontSize="small" />
                  </Badge>
                </Box>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 110 }}
                  >
                    Actions:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit Role">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openEditDialog(role)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Permissions">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => openPermissionsDialog(role)}
                      >
                        <SecurityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Role">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(role)}
                          disabled={isProtectedRole(role.role_name)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const RolesTabMobile = () => {
  const { t } = useTranslation();
  // RTK Query hooks
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: permissions = [] } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [getRolePermissions] = useLazyGetRolePermissionsQuery();
  const [updateRolePermissions, { isLoading: isUpdatingPermissions }] =
    useUpdateRolePermissionsMutation();

  // Dialog states
  const [dialog, setDialog] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Selection states
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Form state
  const [roleForm, setRoleForm] = useState({
    role_name: "",
    description: "",
    client_id: null,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Computed values
  const isSaving = isCreating || isUpdating;

  const openAddDialog = () => {
    setEditingRole(null);
    setRoleForm({
      role_name: "",
      description: "",
      client_id: null,
    });
    setDialog(true);
  };

  const openEditDialog = (role) => {
    setEditingRole(role);
    setRoleForm({
      role_name: role.role_name,
      description: role.description || "",
      client_id: role.client_id,
    });
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
    setEditingRole(null);
    setRoleForm({
      role_name: "",
      description: "",
      client_id: null,
    });
  };

  const openPermissionsDialog = async (role) => {
    setSelectedRole(role);

    if (!role.id) {
      showNotification("Invalid role selected", "error");
      return;
    }

    try {
      const result = await getRolePermissions(role.id).unwrap();
      setSelectedPermissions(result);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
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
          client_id: roleForm.client_id,
        };
        await updateRole(updateData).unwrap();
        showNotification("Role updated successfully", "success");
      } else {
        const roleData = {
          clientId: roleForm.client_id,
          roleName: roleForm.role_name,
          description: roleForm.description,
          permissionIds: [],
        };

        if (!roleData.clientId) {
          showNotification("Please select a client for this role", "error");
          return;
        }

        await createRole(roleData).unwrap();
        showNotification("Role created successfully", "success");
      }

      closeDialog();
    } catch (error) {
      const errorMessage =
        error.data?.error || error.data?.message || "Failed to save role";
      showNotification(errorMessage, "error");
    }
  };

  const savePermissions = async () => {
    if (!selectedRole?.id) {
      showNotification("Invalid role selected", "error");
      return;
    }

    try {
      await updateRolePermissions({
        roleId: selectedRole.id,
        permissions: selectedPermissions,
      }).unwrap();

      showNotification("Permissions updated successfully", "success");
      closePermissionsDialog();
    } catch (error) {
      const errorMessage = error.data?.error || "Failed to save permissions";
      showNotification(errorMessage, "error");
    }
  };

  const confirmDelete = (role) => {
    setRoleToDelete(role);
    setDeleteDialog(true);
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleToDelete.id).unwrap();
      showNotification("Role deleted successfully", "success");
      setDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      const errorMessage = error.data?.error || "Failed to delete role";
      showNotification(errorMessage, "error");
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const isFormValid = () => {
    return (
      roleForm.role_name && roleForm.role_name.length >= 2 && roleForm.client_id
    );
  };

  const isProtectedRole = (roleName) => {
    return roleName === "BPO Admin" || roleName === "Client Admin";
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

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
          mt: 1,
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c5c5c5",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#9e9e9e",
          },
        }}
      >
        <Table aria-label="roles table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#f5f5f5" }} />
              <TableCell sx={{ backgroundColor: "#f5f5f5" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={titlesTypography.sectionTitle}>
                    {t("userManagement.rolesPermissions.title")}
                  </Typography>
                  <Tooltip title="Add Role">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={openAddDialog}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <Row
                key={role.id}
                role={role}
                clients={clients}
                openEditDialog={openEditDialog}
                openPermissionsDialog={openPermissionsDialog}
                openDeleteDialog={confirmDelete}
              />
            ))}
            {roles.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <ShieldIcon
                      sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No roles found
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={openAddDialog}
                      sx={{ mt: 2 }}
                    >
                      Add Role
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Role Dialog */}
      <Dialog open={dialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Role Name"
            required
            fullWidth
            value={roleForm.role_name}
            onChange={(e) =>
              setRoleForm({ ...roleForm, role_name: e.target.value })
            }
            sx={{ mb: 3 }}
            error={
              roleForm.role_name.length > 0 && roleForm.role_name.length < 2
            }
            helperText={
              roleForm.role_name.length > 0 && roleForm.role_name.length < 2
                ? "Role name must be at least 2 characters"
                : ""
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={roleForm.description}
            onChange={(e) =>
              setRoleForm({ ...roleForm, description: e.target.value })
            }
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth required>
            <InputLabel>Client</InputLabel>
            <Select
              value={roleForm.client_id || ""}
              label="Client"
              onChange={(e) =>
                setRoleForm({ ...roleForm, client_id: e.target.value })
              }
              disabled={editingRole && isProtectedRole(editingRole.role_name)}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} sx={outlinedButton}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveRole}
            disabled={isSaving || !isFormValid()}
            sx={primaryButton}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog
        open={permissionsDialog}
        onClose={closePermissionsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure Permissions - {selectedRole?.role_name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select which permissions this role should have:
          </Typography>
          <Grid container spacing={2}>
            {permissions.map((permission) => (
              <Grid item xs={12} key={permission.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                    />
                  }
                  label={
                    permission.permissionName || permission.permission_name
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePermissionsDialog} sx={outlinedButton}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={savePermissions}
            disabled={isUpdatingPermissions}
            sx={primaryButton}
          >
            {isUpdatingPermissions ? "Saving..." : "Save Permissions"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the role "{roleToDelete?.role_name}
            "? This action cannot be undone and will affect any users assigned
            to this role.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} sx={outlinedButton}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRole}
            disabled={isDeleting}
            sx={primaryButton}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === "success" ? 3000 : 5000}
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
