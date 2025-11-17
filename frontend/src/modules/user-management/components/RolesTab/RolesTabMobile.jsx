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
  Badge,
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
                    badgeContent={role.permissionsCount || 0}
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
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(role)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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

Row.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role_name: PropTypes.string.isRequired,
    description: PropTypes.string,
    client_id: PropTypes.number,
    permissionsCount: PropTypes.number,
  }).isRequired,
  clients: PropTypes.array.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  openPermissionsDialog: PropTypes.func.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
};

export const RolesTabMobile = ({
  roles,
  clients,
  openAddDialog,
  openEditDialog,
  openPermissionsDialog,
  openDeleteDialog,
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
                <Typography variant="subtitle2" fontWeight="600">
                  Roles
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
              openDeleteDialog={openDeleteDialog}
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
  );
};

RolesTabMobile.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      role_name: PropTypes.string.isRequired,
      description: PropTypes.string,
      client_id: PropTypes.number,
      permissionsCount: PropTypes.number,
    })
  ).isRequired,
  clients: PropTypes.array.isRequired,
  openAddDialog: PropTypes.func.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  openPermissionsDialog: PropTypes.func.isRequired,
  openDeleteDialog: PropTypes.func.isRequired,
};
