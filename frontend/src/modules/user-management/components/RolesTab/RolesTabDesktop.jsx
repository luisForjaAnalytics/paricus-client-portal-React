import { useState, useMemo } from "react";
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
  TextField,
  Typography,
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
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Shield as ShieldIcon,
  Search as SearchIcon,
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
  primaryIconButton,
  outlinedButton,
  colors,
  typography,
  card,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

export const RolesTabDesktop = () => {
  const { t } = useTranslation();

  // RTK Query hooks
  const { data: roles = [], isLoading, error } = useGetRolesQuery();
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
  const [selectedClient, setSelectedClient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredRoles = useMemo(() => {
    let filtered = roles;

    // Filter by client
    if (selectedClient) {
      filtered = filtered.filter((role) => role.client_id === selectedClient);
    }

    // Filter by search query (role name or description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (role) =>
          role.role_name?.toLowerCase().includes(query) ||
          role.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [roles, selectedClient, searchQuery]);

  const isProtectedRole = (roleName) => {
    return roleName === "BPO Admin" || roleName === "Client Admin";
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      // {
      //   field: "id",
      //   headerName: "ID",
      //   flex: 1,
      //   align: "center",
      //   headerAlign: "center",
      // },
      {
        field: "role_name",
        headerName: "Role Name",
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
        field: "description",
        headerName: "Description",
        flex: 1,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "client_name",
        headerName: "Client",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <Chip
            label={params.value}
            color="primary"
            variant="outlined"
            size="small"
          />
        ),
      },
      {
        field: "permissions_count",
        headerName: "Permissions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Badge badgeContent={params.value || 0} color="info">
            <ShieldIcon color="action" />
          </Badge>
        ),
      },
      {
        field: "created_at",
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
            <Tooltip title="Edit role">
              <IconButton
                size="small"
                onClick={() => openEditDialog(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Configure permissions">
              <IconButton
                size="small"
                color="success"
                onClick={() => openPermissionsDialog(params.row.original)}
              >
                <SecurityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete role">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => confirmDelete(params.row.original)}
                  disabled={isProtectedRole(params.row.role_name)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [openEditDialog, openPermissionsDialog, confirmDelete]
  );

  // Transform roles data for DataGrid
  const rows = useMemo(
    () =>
      filteredRoles.map((role) => ({
        id: role.id,
        role_name: role.role_name,
        description: role.description,
        client_name: role.client_name,
        permissions_count: role.permissions_count || 0,
        created_at: role.created_at,
        original: role, // Keep original object for actions
      })),
    [filteredRoles]
  );

  return (
    <Box sx={{ px: 3 }}>
      {/* Page Header 
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          Roles Management
        </Typography>
      </Box>

      {/* Filter Section - Desktop Only */}
      <Card
        sx={{
          display: { xs: "none", md: "block" },
          padding: "0 2rem 0 2rem",
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Filter by Client</InputLabel>
                <Select
                  value={selectedClient}
                  label="Filter by Client"
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <MenuItem value="">All Clients</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ minWidth: 300 }}
                label="Search Roles"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              sx={primaryIconButton}
            >
              Add New Role
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Roles Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            ...card,
            padding: "1rem 0 0 0",
            border: `1px solid ${colors.border}`,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.background} !important`,
              borderBottom: `2px solid ${colors.border}`,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: `${colors.background} !important`,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: typography.fontWeight.bold,
              textTransform: "uppercase",
              fontSize: typography.fontSize.tableHeader,
              fontFamily: typography.fontFamily,
              color: colors.textMuted,
              letterSpacing: "0.05em",
            },
            "& .MuiDataGrid-sortIcon": {
              color: colors.primary,
            },
            "& .MuiDataGrid-columnHeader--sorted": {
              backgroundColor: `${colors.primaryLight} !important`,
            },
            "& .MuiDataGrid-filler": {
              backgroundColor: `${colors.background} !important`,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.border}`,
              fontSize: typography.fontSize.body,
              fontFamily: typography.fontFamily,
              color: colors.textPrimary,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.background,
            },
          }}
        />
      </Box>

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
              label="Clien"
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
              <Grid item xs={12} md={6} key={permission.id}>
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
