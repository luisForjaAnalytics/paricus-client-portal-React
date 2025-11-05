import React from "react";
import PropTypes from "prop-types";
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
} from "@mui/icons-material";

function Row({ user, clients, roles, handleEdit }) {
  const [open, setOpen] = React.useState(false);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : "Unknown";
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.role_name : "No Role";
  };

  const getInitials = () => {
    const firstInitial = user.first_name ? user.first_name[0] : "";
    const lastInitial = user.last_name ? user.last_name[0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
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
                {user.first_name} {user.last_name}
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
                {user.first_name} {user.last_name}
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
                    Email:
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
                    Client:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BusinessIcon fontSize="small" color="primary" />
                    <Chip
                      label={getClientName(user.client_id)}
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
                    Role:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ShieldIcon fontSize="small" color="secondary" />
                    <Chip
                      label={getRoleName(user.role_id)}
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
                    Status:
                  </Typography>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
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
                    Actions:
                  </Typography>
                  <Tooltip title="Edit User">
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
    </React.Fragment>
  );
}

Row.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    client_id: PropTypes.number,
    role_id: PropTypes.number,
    isActive: PropTypes.bool,
  }).isRequired,
  clients: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export const UsersManagementviewMovil = ({
  users,
  clients,
  roles,
  handleEdit,
  openDialog,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        display: { xs: "block", md: "none" },
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
                <Typography variant="subtitle2" fontWeight="600">
                  Users
                </Typography>
                <Tooltip title="Add User">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={openDialog}
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
              handleEdit={handleEdit}
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
                    No users found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openDialog}
                    sx={{ mt: 2 }}
                  >
                    Add User
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

UsersManagementviewMovil.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      client_id: PropTypes.number,
      role_id: PropTypes.number,
      isActive: PropTypes.bool,
    })
  ).isRequired,
  clients: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
};
