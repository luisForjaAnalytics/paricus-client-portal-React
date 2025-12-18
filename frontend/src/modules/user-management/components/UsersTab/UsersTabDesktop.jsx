import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { DataGrid, Toolbar } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetClientsQuery,
  useGetRolesQuery,
} from "../../../../store/api/adminApi";
import {
  primaryButton,
  primaryIconButton,
  outlinedButton,
  colors,
  typography,
  statusBadges,
  card,
  filterStyles,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FilterButton } from "../FilterButton/FilterButton";

export const UsersTabDesktop = () => {
  const { t } = useTranslation();
  const authUser = useSelector((state) => state.auth.user);

  // Check if user is BPO Admin or Client Admin
  const isBPOAdmin = authUser?.permissions?.includes("admin_users");
  const isClientAdmin =
    authUser?.permissions?.includes("view_invoices") && !isBPOAdmin;

  // RTK Query hooks
  const { data: users = [], isLoading: loading } = useGetUsersQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const [createUserMutation, { isLoading: creating }] = useCreateUserMutation();
  const [updateUserMutation, { isLoading: updating }] = useUpdateUserMutation();

  // State
  const [dialog, setDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

  const saving = creating || updating;

  // Form data
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    client_id: null,
    role_id: null,
    password: "",
  });

  // Notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Computed values
  const clientOptions = useMemo(() => {
    try {
      return clients.map((client) => ({
        title: client.name,
        value: client.id,
      }));
    } catch (err) {
      console.log(`ERROR clientOptions: ${err}`);
      return [];
    }
  }, [clients]);

  const roleOptions = useMemo(() => {
    try {
      return roles
        .filter((role) => role.clientId === userForm.client_id)
        .map((role) => ({ title: role.roleName, value: role.id }));
    } catch (err) {
      console.log(`ERROR roleOptions: ${err}`);
      return [];
    }
  }, [roles, userForm.client_id]);

  const filteredUsers = useMemo(() => {
    try {
      let filtered = users;

      // For Client Admins, only show users from their company
      if (isClientAdmin && authUser?.clientId) {
        filtered = filtered.filter(
          (user) => user.clientId === authUser.clientId
        );
      }

      // For BPO Admins, use the selected client filter
      if (isBPOAdmin && selectedClient) {
        filtered = filtered.filter((user) => user.clientId === selectedClient);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        );
      }

      return filtered;
    } catch (err) {
      console.log(`ERROR filteredUsers: ${err}`);
      return users;
    }
  }, [
    users,
    selectedClient,
    searchQuery,
    isClientAdmin,
    isBPOAdmin,
    authUser?.clientId,
  ]);

  const isFormValid = useMemo(() => {
    try {
      const emailRegex = /.+@.+\..+/;
      return (
        userForm.first_name &&
        userForm.last_name &&
        userForm.email &&
        emailRegex.test(userForm.email) &&
        userForm.client_id &&
        (editingUser || userForm.password)
      );
    } catch (err) {
      console.log(`ERROR isFormValid: ${err}`);
      return false;
    }
  }, [userForm, editingUser]);

  // Methods

  const openAddDialog = () => {
    try {
      setEditingUser(null);
      setUserForm({
        first_name: "",
        last_name: "",
        email: "",
        // For Client Admins, pre-set their clientId
        client_id: isClientAdmin ? authUser?.clientId : null,
        role_id: null,
        password: "",
      });
      setDialog(true);
    } catch (err) {
      console.log(`ERROR openAddDialog: ${err}`);
    }
  };

  const openEditDialog = (user) => {
    try {
      setEditingUser(user);
      setUserForm({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        client_id: user.clientId,
        role_id: user.roleId,
        password: "",
      });
      setDialog(true);
    } catch (err) {
      console.log(`ERROR openEditDialog: ${err}`);
    }
  };

  const closeDialog = () => {
    try {
      setDialog(false);
      setEditingUser(null);
      setUserForm({
        first_name: "",
        last_name: "",
        email: "",
        client_id: null,
        role_id: null,
        password: "",
      });
    } catch (err) {
      console.log(`ERROR closeDialog: ${err}`);
    }
  };

  const saveUser = async () => {
    try {
      const userData = { ...userForm };

      // Convert empty string role_id to null for server validation
      if (userData.role_id === "" || userData.role_id === undefined) {
        userData.role_id = null;
      }

      if (editingUser && !userData.password) {
        delete userData.password;
      }

      if (editingUser) {
        // Update existing user
        await updateUserMutation({ id: editingUser.id, ...userData }).unwrap();
        showNotification(t("users.messages.userUpdated"), "success");
      } else {
        // Create new user
        await createUserMutation(userData).unwrap();
        showNotification(t("users.messages.userCreated"), "success");
      }

      closeDialog();
    } catch (error) {
      console.error("Error saving user:", error);
      showNotification(
        error.data?.error || t("users.messages.saveFailed"),
        "error"
      );
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await updateUserMutation({
        id: user.id,
        isActive: !user.isActive,
      }).unwrap();

      showNotification(
        !user.isActive
          ? t("users.messages.userActivated")
          : t("users.messages.userDeactivated"),
        "success"
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      showNotification(
        error.data?.error || t("users.messages.statusUpdateFailed"),
        "error"
      );
    }
  };

  const showNotification = (message, severity) => {
    try {
      setNotification({ open: true, message, severity });
    } catch (err) {
      console.log(`ERROR showNotification: ${err}`);
    }
  };

  const handleCloseNotification = () => {
    try {
      setNotification({ ...notification, open: false });
    } catch (err) {
      console.log(`ERROR handleCloseNotification: ${err}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("common.na");
    try {
      const locale = t("common.locale") || "en-US";
      return new Date(dateString).toLocaleDateString(locale);
    } catch (error) {
      console.log(`ERROR formatDate: ${error}`);
      return t("common.invalidDate");
    }
  };

  const handleClientChange = (clientId) => {
    try {
      setUserForm((prev) => ({ ...prev, client_id: clientId, role_id: null }));
    } catch (err) {
      console.log(`ERROR handleClientChange: ${err}`);
    }
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: t("users.table.name"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ margin: "1rem" }}
          >
            {params.value || t("common.na")}
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: t("users.table.email"),
        flex: 1,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "client_name",
        headerName: t("users.table.client"),
        flex: 1,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "role_name",
        headerName: t("users.table.role"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) =>
          params.value ? (
            <Chip label={params.value} color="primary" size="small" />
          ) : (
            <Chip
              label={t("users.table.noRoleAssigned")}
              color="default"
              size="small"
              variant="outlined"
            />
          ),
      },
      {
        field: "is_active",
        headerName: t("users.table.status"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={
              params.value ? t("users.table.active") : t("users.table.inactive")
            }
            color={params.value ? "success" : "error"}
            size="small"
          />
        ),
      },
      {
        field: "created_at",
        headerName: t("users.table.created"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "actions",
        headerName: t("users.table.actions"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title={t("users.actions.editUser")}>
              <IconButton
                size="small"
                onClick={() => openEditDialog(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                params.row.is_active
                  ? t("users.actions.deactivateUser")
                  : t("users.actions.activateUser")
              }
            >
              <IconButton
                size="small"
                onClick={() => toggleUserStatus(params.row.original)}
              >
                {params.row.is_active ? (
                  <BlockIcon fontSize="small" />
                ) : (
                  <CheckCircleIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t]
  );

  // Transform users data for DataGrid
  const rows = useMemo(() => {
    try {
      return filteredUsers.map((user) => ({
        id: user.id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          t("common.na"),
        email: user.email,
        client_name: user.client?.name || t("common.na"),
        role_name: user.role?.roleName,
        is_active: user.isActive,
        created_at: user.createdAt,
        original: user, // Keep original object for actions
      }));
    } catch (err) {
      console.log(`ERROR rows: ${err}`);
      return [];
    }
  }, [filteredUsers, t]);

  // Toolbar component with filters
  const UsersToolbar = useMemo(() => {
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
                label={t("users.searchLabel")}
                placeholder={t("users.searchPlaceholder")}
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

              {/* Only show client filter for BPO Admins */}
              {isBPOAdmin && (
                <FormControl sx={filterStyles?.formControlStyleCUR}>
                  <InputLabel
                    sx={filterStyles?.multiOptionFilter?.inputLabelSection}
                  >
                    {t("users.filterByClient")}
                  </InputLabel>
                  <Select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    label={t("users.filterByClient")}
                    sx={filterStyles?.multiOptionFilter?.selectSection}
                  >
                    <MenuItem value="">{t("users.allClients")}</MenuItem>
                    {clientOptions.map((client) => (
                      <MenuItem key={client.value} value={client.value}>
                        {client.title}
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
  }, [isOpen, isBPOAdmin, selectedClient, searchQuery, clientOptions, t]);

  return (
    <Box sx={{ px: 3 }}>
      {/* Users Data Table - Desktop Only */}
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
            {t("users.addNewUser")}
          </Button>

          {/* filter Button */}
          <FilterButton
            folderName="users.filters"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: UsersToolbar }}
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

      {/* Add/Edit User Dialog */}
      <Dialog open={dialog} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {editingUser ? t("users.editUser") : t("users.addNewUser")}
            </Typography>
            <IconButton onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t("users.form.firstName")}
                  value={userForm.first_name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, first_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t("users.form.lastName")}
                  value={userForm.last_name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, last_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label={t("users.form.email")}
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                />
              </Grid>
              {isBPOAdmin && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>{t("users.form.client")}</InputLabel>
                    <Select
                      value={userForm.client_id || ""}
                      onChange={(e) =>
                        handleClientChange(e.target.value || null)
                      }
                      label={t("users.form.client")}
                    >
                      <MenuItem value="">
                        {t("users.form.selectClient")}
                      </MenuItem>
                      {clientOptions.map((client) => (
                        <MenuItem key={client.value} value={client.value}>
                          {client.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!userForm.client_id}>
                  <InputLabel>{t("users.form.role")}</InputLabel>
                  <Select
                    value={userForm.role_id || ""}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role_id: e.target.value || null,
                      })
                    }
                    label={t("users.form.role")}
                  >
                    <MenuItem value="">
                      {!userForm.client_id
                        ? t("users.form.selectClientFirst")
                        : roleOptions.length === 0
                        ? t("users.form.noRolesAvailable")
                        : t("users.form.selectRole")}
                    </MenuItem>
                    {roleOptions.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {!editingUser && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label={t("users.form.password")}
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} sx={outlinedButton}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={saveUser}
            variant="contained"
            disabled={saving || !isFormValid}
            sx={primaryButton}
          >
            {saving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
