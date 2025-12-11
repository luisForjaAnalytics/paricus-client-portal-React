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
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Shield as ShieldIcon,
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
  outlinedButton,
  titlesTypography,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

function Row({ user, clients, roles, handleEdit, t }) {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    try {
      setOpen(!open);
    } catch (err) {
      console.log(`ERROR toggleOpen: ${err}`);
    }
  };

  const getClientName = (clientId) => {
    try {
      const client = clients.find((c) => c.id === clientId);
      return client ? client.name : t("common.unknown");
    } catch (err) {
      console.log(`ERROR getClientName: ${err}`);
      return t("common.unknown");
    }
  };

  const getRoleName = (roleId) => {
    try {
      const role = roles.find((r) => r.id === roleId);
      return role ? role.roleName : t("users.table.noRoleAssigned");
    } catch (err) {
      console.log(`ERROR getRoleName: ${err}`);
      return t("users.table.noRoleAssigned");
    }
  };

  const getInitials = () => {
    try {
      const firstInitial = user.firstName ? user.firstName[0] : "";
      const lastInitial = user.lastName ? user.lastName[0] : "";
      return `${firstInitial}${lastInitial}`.toUpperCase();
    } catch (err) {
      console.log(`ERROR getInitials: ${err}`);
      return "?";
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={toggleOpen}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
              }}
            >
              {getInitials()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
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
                {user.firstName} {user.lastName}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Email */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    {t("users.form.email")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Client */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    {t("users.form.client")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BusinessIcon fontSize="small" color="primary" />
                    <Chip
                      label={user.client?.name || getClientName(user.clientId)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Role */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    {t("users.form.role")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ShieldIcon fontSize="small" color="secondary" />
                    <Chip
                      label={user.role?.roleName || getRoleName(user.roleId)}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    {t("users.table.status")}:
                  </Typography>
                  <Chip
                    label={user.isActive ? t("users.table.active") : t("users.table.inactive")}
                    color={user.isActive ? "success" : "default"}
                    size="small"
                  />
                </Box>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    {t("users.table.actions")}:
                  </Typography>
                  <Tooltip title={t("users.actions.editUser")}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export const UsersTabMobile = () => {
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
      return clients.map((client) => ({ title: client.name, value: client.id }));
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
        client_id: null,
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
      showNotification(error.data?.error || t("users.messages.saveFailed"), "error");
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

  const handleClientChange = (clientId) => {
    try {
      setUserForm((prev) => ({ ...prev, client_id: clientId, role_id: null }));
    } catch (err) {
      console.log(`ERROR handleClientChange: ${err}`);
    }
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
        <Table aria-label="users table" stickyHeader>
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
                    {t("userManagement.users.title")}
                  </Typography>

                  <Tooltip title={t("users.addUser")}>
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
            {users.map((user) => (
              <Row
                key={user.id}
                user={user}
                clients={clients}
                roles={roles}
                handleEdit={openEditDialog}
                t={t}
              />
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <PersonIcon
                      sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t("users.noUsersFound")}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={openAddDialog}
                      sx={{ mt: 2 }}
                    >
                      {t("users.addUser")}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>{t("users.form.client")}</InputLabel>
                  <Select
                    value={userForm.client_id || ""}
                    onChange={(e) => handleClientChange(e.target.value || null)}
                    label={t("users.form.client")}
                  >
                    <MenuItem value="">{t("users.form.selectClient")}</MenuItem>
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
