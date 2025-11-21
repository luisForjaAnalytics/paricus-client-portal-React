import React, { useState, useEffect, useMemo } from "react";
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
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
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
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

export const UsersTabDesktop = () => {
  const { t } = useTranslation();

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
  const clientOptions = useMemo(
    () => clients.map((client) => ({ title: client.name, value: client.id })),
    [clients]
  );

  const roleOptions = useMemo(() => {
    return roles
      .filter((role) => role.client_id === userForm.client_id)
      .map((role) => ({ title: role.role_name, value: role.id }));
  }, [roles, userForm.client_id]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (selectedClient) {
      filtered = filtered.filter((user) => user.client_id === selectedClient);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(query) ||
          user.last_name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, selectedClient, searchQuery]);

  const isFormValid = useMemo(() => {
    const emailRegex = /.+@.+\..+/;
    return (
      userForm.first_name &&
      userForm.last_name &&
      userForm.email &&
      emailRegex.test(userForm.email) &&
      userForm.client_id &&
      (editingUser || userForm.password)
    );
  }, [userForm, editingUser]);

  // Methods

  const openAddDialog = () => {
    setEditingUser(null);
    setUserForm({
      first_name: "",
      last_name: "",
      email: "",
      client_id: null,
      role_id: null,
      password: "",
    });
    setDialog(true);
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setUserForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      client_id: user.client_id,
      role_id: user.role_id,
      password: "",
    });
    setDialog(true);
  };

  const closeDialog = () => {
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
        showNotification("User updated successfully", "success");
      } else {
        // Create new user
        await createUserMutation(userData).unwrap();
        showNotification("User created successfully", "success");
      }

      closeDialog();
    } catch (error) {
      console.error("Error saving user:", error);
      showNotification(error.data?.error || "Failed to save user", "error");
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await updateUserMutation({
        id: user.id,
        isActive: !user.is_active,
      }).unwrap();

      showNotification(
        `User ${!user.is_active ? "activated" : "deactivated"} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      showNotification(
        error.data?.error || "Failed to update user status",
        "error"
      );
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleClientChange = (clientId) => {
    setUserForm((prev) => ({ ...prev, client_id: clientId, role_id: null }));
  };

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="medium">
            {params.value || "N/A"}
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: "Email",
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
      },
      {
        field: "role_name",
        headerName: "Role",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) =>
          params.value ? (
            <Chip label={params.value} color="primary" size="small" />
          ) : (
            <Chip
              label="No role assigned"
              color="default"
              size="small"
              variant="outlined"
            />
          ),
      },
      {
        field: "is_active",
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
            <Tooltip title="Edit user">
              <IconButton
                size="small"
                onClick={() => openEditDialog(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={params.row.is_active ? "Deactivate user" : "Activate user"}
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
    []
  );

  // Transform users data for DataGrid
  const rows = useMemo(
    () =>
      filteredUsers.map((user) => ({
        id: user.id,
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A",
        email: user.email,
        client_name: user.client_name || "N/A",
        role_name: user.role_name,
        is_active: user.is_active,
        created_at: user.created_at,
        original: user, // Keep original object for actions
      })),
    [filteredUsers]
  );

  return (
    <Box sx={{ p: 3 }}>

      {/* Filter Section - Desktop Only */}
      <Card
        sx={{
          display: { xs: "none", md: "block" },
          mb: 3,
          padding: "0 2rem 0 2rem",
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
                  onChange={(e) => setSelectedClient(e.target.value)}
                  label="Filter by Client"
                >
                  <MenuItem value="">All Clients</MenuItem>
                  {clientOptions.map((client) => (
                    <MenuItem key={client.value} value={client.value}>
                      {client.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ minWidth: 300 }}
                label="Search Users"
                placeholder="Search by name or email..."
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
              Add New User
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Users Data Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: 'auto',
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
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
            border: `1px solid ${colors.border}`, // border-gray-200
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.background} !important`, // bg-gray-50
              borderBottom: `2px solid ${colors.border}`,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: `${colors.background} !important`, // bg-gray-50
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: typography.fontWeight.bold, // font-bold
              textTransform: "uppercase",
              fontSize: typography.fontSize.tableHeader, // text-xs (12px)
              fontFamily: typography.fontFamily,
              color: colors.textMuted, // text-gray-500
              letterSpacing: "0.05em", // tracking-wider
            },
            "& .MuiDataGrid-sortIcon": {
              color: colors.primary,
            },
            "& .MuiDataGrid-columnHeader--sorted": {
              backgroundColor: `${colors.primaryLight} !important`, // bg-green-100 when sorted
            },
            "& .MuiDataGrid-filler": {
              backgroundColor: `${colors.background} !important`, // bg-gray-50
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.border}`, // border-gray-200
              fontSize: typography.fontSize.body, // text-sm (14px)
              fontFamily: typography.fontFamily,
              color: colors.textPrimary, // text-gray-900
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.background, // hover:bg-gray-50
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
              {editingUser ? "Edit User" : "Add New User"}
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
                  label="First Name"
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
                  label="Last Name"
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
                  label="Email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={userForm.client_id || ""}
                    onChange={(e) => handleClientChange(e.target.value || null)}
                    label="Client"
                  >
                    <MenuItem value="">Select a client</MenuItem>
                    {clientOptions.map((client) => (
                      <MenuItem key={client.value} value={client.value}>
                        {client.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!userForm.client_id}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userForm.role_id || ""}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role_id: e.target.value || null,
                      })
                    }
                    label="Role"
                  >
                    <MenuItem value="">
                      {!userForm.client_id
                        ? "Select a client first"
                        : roleOptions.length === 0
                        ? "No roles available for this client"
                        : "Select a role"}
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
                    label="Password"
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
            Cancel
          </Button>
          <Button
            onClick={saveUser}
            variant="contained"
            disabled={saving || !isFormValid}
            sx={primaryButton}
          >
            {saving ? "Saving..." : "Save"}
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
