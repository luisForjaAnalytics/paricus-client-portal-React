import { useState, useMemo } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { DataGrid, Toolbar } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Shield as ShieldIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
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
  filterStyles,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PermissionsModal } from "./PermissionsModal";
import { FilterButton } from "../FilterButton/FilterButton";

export const RolesTabDesktop = () => {
  const { t } = useTranslation();
  const authUser = useSelector((state) => state.auth.user);

  // Check if user is BPO Admin or Client Admin
  const isBPOAdmin = authUser?.permissions?.includes("admin_users");
  const isClientAdmin =
    authUser?.permissions?.includes("view_invoices") && !isBPOAdmin;

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

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

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
    try {
      setEditingRole(null);
      setRoleForm({
        role_name: "",
        description: "",
        // For Client Admins, pre-set their clientId
        client_id: isClientAdmin ? authUser?.clientId : null,
      });
      setDialog(true);
    } catch (err) {
      console.log(`ERROR openAddDialog: ${err}`);
    }
  };

  const openEditDialog = (role) => {
    try {
      setEditingRole(role);
      setRoleForm({
        role_name: role.roleName || role.role_name,
        description: role.description || "",
        client_id: role.clientId || role.client_id,
      });
      setDialog(true);
    } catch (err) {
      console.log(`ERROR openEditDialog: ${err}`);
    }
  };

  const closeDialog = () => {
    try {
      setDialog(false);
      setEditingRole(null);
      setRoleForm({
        role_name: "",
        description: "",
        client_id: null,
      });
    } catch (err) {
      console.log(`ERROR closeDialog: ${err}`);
    }
  };

  const openPermissionsDialog = async (role) => {
    try {
      setSelectedRole(role);

      if (!role.id) {
        showNotification(t("roles.messages.invalidRole"), "error");
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
    } catch (err) {
      console.log(`ERROR openPermissionsDialog: ${err}`);
    }
  };

  const closePermissionsDialog = () => {
    try {
      setPermissionsDialog(false);
      setSelectedRole(null);
      setSelectedPermissions([]);
    } catch (err) {
      console.log(`ERROR closePermissionsDialog: ${err}`);
    }
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
        showNotification(t("roles.messages.roleUpdated"), "success");
      } else {
        const roleData = {
          clientId: roleForm.client_id,
          roleName: roleForm.role_name,
          description: roleForm.description,
          permissionIds: [],
        };

        if (!roleData.clientId) {
          showNotification(t("roles.messages.selectClient"), "error");
          return;
        }

        await createRole(roleData).unwrap();
        showNotification(t("roles.messages.roleCreated"), "success");
      }

      closeDialog();
    } catch (error) {
      const errorMessage =
        error.data?.error ||
        error.data?.message ||
        t("roles.messages.roleSaveFailed");
      showNotification(errorMessage, "error");
    }
  };

  const savePermissions = async () => {
    if (!selectedRole?.id) {
      showNotification(t("roles.messages.invalidRole"), "error");
      return;
    }

    try {
      await updateRolePermissions({
        roleId: selectedRole.id,
        permissions: selectedPermissions,
      }).unwrap();

      showNotification(t("roles.messages.permissionsUpdated"), "success");
      closePermissionsDialog();
    } catch (error) {
      const errorMessage =
        error.data?.error || t("roles.messages.permissionsUpdateFailed");
      showNotification(errorMessage, "error");
    }
  };

  const confirmDelete = (role) => {
    try {
      setRoleToDelete(role);
      setDeleteDialog(true);
    } catch (err) {
      console.log(`ERROR confirmDelete: ${err}`);
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleToDelete.id).unwrap();
      showNotification(t("roles.messages.roleDeleted"), "success");
      setDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      const errorMessage =
        error.data?.error || t("roles.messages.roleDeleteFailed");
      showNotification(errorMessage, "error");
    }
  };

  const handlePermissionToggle = (permissionId) => {
    try {
      setSelectedPermissions((prev) =>
        prev.includes(permissionId)
          ? prev.filter((id) => id !== permissionId)
          : [...prev, permissionId]
      );
    } catch (err) {
      console.log(`ERROR handlePermissionToggle: ${err}`);
    }
  };

  const isFormValid = () => {
    try {
      return (
        roleForm.role_name &&
        roleForm.role_name.length >= 2 &&
        roleForm.client_id
      );
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

  const filteredRoles = useMemo(() => {
    try {
      let filtered = roles;

      // Filter by client
      if (selectedClient) {
        filtered = filtered.filter(
          (role) => (role.clientId || role.client_id) === selectedClient
        );
      }

      // Filter by search query (role name or description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (role) =>
            (role.roleName || role.role_name)?.toLowerCase().includes(query) ||
            role.description?.toLowerCase().includes(query)
        );
      }

      return filtered;
    } catch (err) {
      console.log(`ERROR filteredRoles: ${err}`);
      return roles;
    }
  }, [roles, selectedClient, searchQuery]);

  const isProtectedRole = (roleName) => {
    try {
      return roleName === "BPO Admin" || roleName === "Client Admin";
    } catch (err) {
      console.log(`ERROR isProtectedRole: ${err}`);
      return false;
    }
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "role_name",
        headerName: t("roles.table.roleName"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500} sx={{ margin: "1rem" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "description",
        headerName: t("roles.table.description"),
        flex: 1,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "client_name",
        headerName: t("roles.table.client"),
        flex: 1,
        align: "left",
        headerAlign: "center",
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
        headerName: t("roles.table.permissions"),
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
        headerName: t("roles.table.created"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "actions",
        headerName: t("roles.table.actions"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title={t("roles.actions.edit")}>
              <IconButton
                size="small"
                onClick={() => openEditDialog(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("roles.actions.configurePermissions")}>
              <IconButton
                size="small"
                color="success"
                onClick={() => openPermissionsDialog(params.row.original)}
              >
                <SecurityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("roles.actions.delete")}>
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
    [t, openEditDialog, openPermissionsDialog, confirmDelete, formatDate]
  );

  // Transform roles data for DataGrid
  const rows = useMemo(() => {
    try {
      return filteredRoles.map((role) => ({
        id: role.id,
        role_name: role.roleName || role.role_name,
        description: role.description,
        client_name: role.clientName || role.client_name,
        permissions_count:
          role.permissions?.length ||
          role.permissions_count ||
          role.userCount ||
          0,
        created_at: role.createdAt || role.created_at,
        original: role, // Keep original object for actions
      }));
    } catch (err) {
      console.log(`ERROR rows: ${err}`);
      return [];
    }
  }, [filteredRoles]);

  // Toolbar component with filters
  const RolesToolbar = useMemo(() => {
    return () => (
      <>
        {isOpen && (
          <Box
            sx={{
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.subSectionBackground,
              borderBottom: `1px solid ${colors.subSectionBorder}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <TextField
                sx={filterStyles?.inputFilter}
                label={t("roles.searchLabel")}
                placeholder={t("roles.searchPlaceholder")}
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

              {isBPOAdmin && (
                <FormControl sx={filterStyles?.formControlStyleCUR}>
                  <InputLabel
                    sx={filterStyles?.multiOptionFilter?.inputLabelSection}
                  >
                    {t("roles.filterByClient")}
                  </InputLabel>
                  <Select
                    value={selectedClient}
                    label={t("roles.filterByClient")}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    sx={filterStyles?.multiOptionFilter?.selectSection}
                  >
                    <MenuItem value="">{t("roles.allClients")}</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        )}
      </>
    );
  }, [isOpen, isBPOAdmin, selectedClient, searchQuery, clients, t]);

  return (
    <Box sx={{ px: 3 }}>
      {/* Roles Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
        }}
      >
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 1,
            marginRight: 2,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={primaryIconButton}
          >
            {t("roles.addRole")}
          </Button>

          {/* filter Button */}
          <FilterButton
            folderName="roles.filters"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          slots={{ toolbar: RolesToolbar }}
          showToolbar
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            ...card,
            padding: "0 0 0 0",
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
              width: "0 !important",
              minWidth: "0 !important",
              maxWidth: "0 !important",
            },
            "& .MuiDataGrid-scrollbarFiller": {
              display: "none !important",
            },
            "& .MuiDataGrid-scrollbar--vertical": {
              position: "absolute",
              right: 0,
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
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
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
        <DialogTitle>
          {editingRole ? t("roles.editRole") : t("roles.addRole")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("roles.form.roleName")}
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
                ? t("roles.form.roleNameMinLength")
                : ""
            }
          />
          <TextField
            label={t("roles.form.description")}
            fullWidth
            multiline
            rows={3}
            value={roleForm.description}
            onChange={(e) =>
              setRoleForm({ ...roleForm, description: e.target.value })
            }
            sx={{ mb: 3 }}
          />
          {isBPOAdmin && (
            <FormControl fullWidth required>
              <InputLabel>{t("roles.form.client")}</InputLabel>
              <Select
                value={roleForm.client_id || ""}
                label={t("roles.form.client")}
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={saveRole}
            disabled={isSaving || !isFormValid()}
            sx={primaryButton}
          >
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permissions Dialog */}
      <PermissionsModal
        permissionsDialog={permissionsDialog}
        closePermissionsDialog={closePermissionsDialog}
        selectedRole={selectedRole}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        savePermissions={savePermissions}
        isUpdatingPermissions={isUpdatingPermissions}
        onPermissionToggle={handlePermissionToggle}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("roles.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("roles.deleteWarning")} "{roleToDelete?.role_name}"?{" "}
            {t("roles.deleteWarningContinue")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRole}
            disabled={isDeleting}
            sx={primaryButton}
          >
            {isDeleting ? t("common.deleting") : t("common.delete")}
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
