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
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { titlesTypography } from "../../../../common/styles/styles";

function Row({ client, handleEdit, handleDeactivate, formatDate }) {
  const [open, setOpen] = React.useState(false);

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
            <BusinessIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {client.name}
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
                {client.name}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 100 }}
                  >
                    Status:
                  </Typography>
                  <Chip
                    label={client.isActive ? "Active" : "Inactive"}
                    color={client.isActive ? "success" : "default"}
                    size="small"
                  />
                </Box>

                {/* Type */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 100 }}
                  >
                    Type:
                  </Typography>
                  <Chip
                    label={client.isProspect ? "Prospect" : "Client"}
                    color={client.isProspect ? "warning" : "primary"}
                    size="small"
                  />
                </Box>

                {/* Created Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 100 }}
                  >
                    Created:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(client.createdAt || client.created_at)}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 100 }}
                  >
                    Actions:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(client)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {client.isActive && (
                      <Tooltip title="Deactivate">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeactivate(client)}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
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
  client: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    isProspect: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDeactivate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export const ClientsTabMobile = ({
  clients = [],
  handleEdit,
  handleDeactivate,
  formatDate,
  onAddClick,
}) => {
  const { t } = useTranslation();
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
      <Table aria-label="clients table" stickyHeader>
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
                  {t("userManagement.clients.title")}
                </Typography>
                <Tooltip title="Add Client">
                  <IconButton color="primary" size="small" onClick={onAddClick}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <Row
              key={client.id}
              client={client}
              handleEdit={handleEdit}
              handleDeactivate={handleDeactivate}
              formatDate={formatDate}
            />
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <BusinessIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No clients found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddClick}
                    sx={{ mt: 2 }}
                  >
                    Add Client
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

ClientsTabMobile.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      isProspect: PropTypes.bool.isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ),
  handleEdit: PropTypes.func.isRequired,
  handleDeactivate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

ClientsTabMobile.defaultProps = {
  clients: [],
};
