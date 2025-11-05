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
  Divider,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { InvoicesTableViewMovil } from "./InvoicesTableView/InvoicesTableViewMovil";

function Row({
  client,
  selectedFolder,
  formatCurrency,
  selectClient,
  invoices,
  isAdmin,
  formatDate,
  getStatusColor,
  downloadInvoice,
  openEditInvoiceModal,
  handleDeleteInvoice,
  openPaymentLink,
  onPaymentLinkSuccess,
  onPaymentLinkError,
}) {
  const [open, setOpen] = React.useState(false);
  const isSelected = selectedFolder === client.folder;

  const handleRowClick = () => {
    selectClient(client.folder);
  };

  // Filter invoices for this client
  const clientInvoices = invoices.filter(
    (invoice) => invoice.folder === client.folder
  );

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: isSelected ? "action.selected" : "inherit",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: isSelected ? "action.selected" : "action.hover",
          },
        }}
        onClick={handleRowClick}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {client.folderDisplay}
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
                {client.folderDisplay}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Total Invoices */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    Total Invoices:
                  </Typography>
                  <Chip
                    label={client.totalInvoices}
                    size="small"
                    color="primary"
                  />
                </Box>

                {/* Revenue */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    Revenue:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatCurrency(client.totalRevenue)}
                  </Typography>
                </Box>

                {/* Outstanding */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    Outstanding:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {formatCurrency(client.outstandingBalance)}
                  </Typography>
                </Box>

                {/* Overdue */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    Overdue:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="error.main"
                  >
                    {formatCurrency(client.overdueAmount)}
                  </Typography>
                </Box>
              </Box>

              {/* Invoices Section */}
              {clientInvoices.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Invoices ({clientInvoices.length})
                  </Typography>
                  <Box sx={{ mt: 2, mx: -2 }}>
                    <InvoicesTableViewMovil
                      invoices={clientInvoices}
                      isAdmin={isAdmin}
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                      getStatusColor={getStatusColor}
                      downloadInvoice={downloadInvoice}
                      openEditInvoiceModal={openEditInvoiceModal}
                      handleDeleteInvoice={handleDeleteInvoice}
                      openPaymentLink={openPaymentLink}
                      onPaymentLinkSuccess={onPaymentLinkSuccess}
                      onPaymentLinkError={onPaymentLinkError}
                      hideHeader={true}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  client: PropTypes.shape({
    folder: PropTypes.string.isRequired,
    folderDisplay: PropTypes.string.isRequired,
    totalInvoices: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
    outstandingBalance: PropTypes.number.isRequired,
    overdueAmount: PropTypes.number.isRequired,
  }).isRequired,
  selectedFolder: PropTypes.string,
  formatCurrency: PropTypes.func.isRequired,
  selectClient: PropTypes.func.isRequired,
  invoices: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  formatDate: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  downloadInvoice: PropTypes.func.isRequired,
  openEditInvoiceModal: PropTypes.func.isRequired,
  handleDeleteInvoice: PropTypes.func.isRequired,
  openPaymentLink: PropTypes.func.isRequired,
  onPaymentLinkSuccess: PropTypes.func.isRequired,
  onPaymentLinkError: PropTypes.func.isRequired,
};

export const ClientBreakdownMovil = ({
  clientBreakdowns,
  selectedFolder,
  formatCurrency,
  selectClient,
  invoices,
  isAdmin,
  formatDate,
  getStatusColor,
  downloadInvoice,
  openEditInvoiceModal,
  handleDeleteInvoice,
  openPaymentLink,
  onPaymentLinkSuccess,
  onPaymentLinkError,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        display: { xs: "block", md: "none" },
        mt: 1,
        mb: 4,
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
      <Table aria-label="client breakdown table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#f5f5f5" }} />
            <TableCell sx={{ backgroundColor: "#f5f5f5" }}>
              <Typography variant="subtitle2" fontWeight="600">
                Client Breakdown
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientBreakdowns.map((client) => (
            <Row
              key={client.folder}
              client={client}
              selectedFolder={selectedFolder}
              formatCurrency={formatCurrency}
              selectClient={selectClient}
              invoices={invoices}
              isAdmin={isAdmin}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              downloadInvoice={downloadInvoice}
              openEditInvoiceModal={openEditInvoiceModal}
              handleDeleteInvoice={handleDeleteInvoice}
              openPaymentLink={openPaymentLink}
              onPaymentLinkSuccess={onPaymentLinkSuccess}
              onPaymentLinkError={onPaymentLinkError}
            />
          ))}
          {clientBreakdowns.length === 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <BusinessIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No clients found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ClientBreakdownMovil.propTypes = {
  clientBreakdowns: PropTypes.arrayOf(
    PropTypes.shape({
      folder: PropTypes.string.isRequired,
      folderDisplay: PropTypes.string.isRequired,
      totalInvoices: PropTypes.number.isRequired,
      totalRevenue: PropTypes.number.isRequired,
      outstandingBalance: PropTypes.number.isRequired,
      overdueAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedFolder: PropTypes.string,
  formatCurrency: PropTypes.func.isRequired,
  selectClient: PropTypes.func.isRequired,
  invoices: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  formatDate: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  downloadInvoice: PropTypes.func.isRequired,
  openEditInvoiceModal: PropTypes.func.isRequired,
  handleDeleteInvoice: PropTypes.func.isRequired,
  openPaymentLink: PropTypes.func.isRequired,
  onPaymentLinkSuccess: PropTypes.func.isRequired,
  onPaymentLinkError: PropTypes.func.isRequired,
};
