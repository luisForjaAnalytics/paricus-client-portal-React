import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Business as BusinessIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import {
  card,
  colors,
  typography,
  titlesTypography,
} from "../../../../common/styles/styles";
import { InvoicesTableDesktop } from "../InvoicesTable/InvoicesTableDesktop";
import { UploadInvoiceButton } from "../UploadInvoiceButton/UploadInvoiceButton";

export const ClientBreakdownDesktop = ({
  clientBreakdowns,
  selectedFolder,
  formatCurrency,
  selectClient,
  invoices = [],
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
  const [expandedRow, setExpandedRow] = useState(null);

  const getInitials = (folderDisplay = "") => {
    try {
      const companyName = folderDisplay.trim().split(" ");
      const firstInitial = companyName[0]?.[0] || "";
      const lastInitial = companyName[companyName.length - 1]?.[0] || "";
      return `${firstInitial}${lastInitial}`.toUpperCase();
    } catch (err) {
      console.error(`ERROR: ${err}`);
      return "";
    }
  };

  const handleRowClick = (folder, index) => {
    // Toggle expansion
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
      selectClient(folder);
    }
  };

  // Filter invoices for the expanded client
  const getClientInvoices = (folder) => {
    const clientBreakdown = clientBreakdowns.find((cb) => cb.folder === folder);
    if (!clientBreakdown) return [];

    // Filter invoices that belong to this client's folder
    return invoices.filter((invoice) => {
      // Assuming invoice has a folder or clientFolder property
      return invoice.folder === folder || invoice.clientFolder === folder;
    });
  };

  if (clientBreakdowns.length === 0) {
    return (
      <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
        <Typography
          sx={{
            ...titlesTypography.primaryTitle,
            mb: 2,
          }}
        >
          Client Breakdown
        </Typography>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            No clients found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload invoices to see client data
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
      <Typography
        sx={{
          ...titlesTypography.primaryTitle,
          mb: 2,
        }}
      >
        Client Breakdown
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          ...card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: `${colors.background} !important`,
                borderBottom: `2px solid ${colors.border}`,
              }}
            >
              <TableCell sx={{ width: 50 }} />
              <TableCell
                align="center"
                sx={{
                  fontWeight: typography.fontWeight.bold,
                  textTransform: "uppercase",
                  fontSize: typography.fontSize.tableHeader,
                  fontFamily: typography.fontFamily,
                  color: colors.textMuted,
                  letterSpacing: "0.05em",
                }}
              >
                Company
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: typography.fontWeight.bold,
                  textTransform: "uppercase",
                  fontSize: typography.fontSize.tableHeader,
                  fontFamily: typography.fontFamily,
                  color: colors.textMuted,
                  letterSpacing: "0.05em",
                  width: 120,
                }}
              >
                Invoices
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: typography.fontWeight.bold,
                  textTransform: "uppercase",
                  fontSize: typography.fontSize.tableHeader,
                  fontFamily: typography.fontFamily,
                  color: colors.textMuted,
                  letterSpacing: "0.05em",
                  width: 150,
                }}
              >
                Revenue
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: typography.fontWeight.bold,
                  textTransform: "uppercase",
                  fontSize: typography.fontSize.tableHeader,
                  fontFamily: typography.fontFamily,
                  color: colors.textMuted,
                  letterSpacing: "0.05em",
                  width: 150,
                }}
              >
                Outstanding
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: typography.fontWeight.bold,
                  textTransform: "uppercase",
                  fontSize: typography.fontSize.tableHeader,
                  fontFamily: typography.fontFamily,
                  color: colors.textMuted,
                  letterSpacing: "0.05em",
                  width: 150,
                }}
              >
                Overdue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientBreakdowns.map((client, index) => {
              const isExpanded = expandedRow === index;
              const clientInvoices = isExpanded ? getClientInvoices(client.folder) : [];

              return (
                <React.Fragment key={index}>
                  <TableRow
                    onClick={() => handleRowClick(client.folder, index)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                      },
                      backgroundColor: isExpanded ? colors.primaryLight : "inherit",
                    }}
                  >
                    <TableCell>
                      <IconButton size="small">
                        {isExpanded ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1.5,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            color: colors.primary,
                            bgcolor: colors.financialClientAvatar,
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                          }}
                        >
                          {getInitials(client.folderDisplay)}
                        </Avatar>
                        <Typography
                          sx={{
                            fontSize: typography.fontSize.body,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.textPrimary,
                            fontFamily: typography.fontFamily,
                          }}
                        >
                          {client.folderDisplay}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.textPrimary,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        {client.totalInvoices}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.textPrimary,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        {formatCurrency(client.totalRevenue)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.textPrimary,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        {formatCurrency(client.outstandingBalance)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.error,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        {formatCurrency(client.overdueAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        borderBottom: isExpanded
                          ? `1px solid ${colors.border}`
                          : "none",
                      }}
                      colSpan={6}
                    >
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: typography.fontWeight.semibold,
                                fontFamily: typography.fontFamily,
                              }}
                            >
                              {client.folderDisplay} Invoices
                            </Typography>
                            {isAdmin && (
                              <UploadInvoiceButton
                                selectedFolder={client.folder}
                                onSuccess={onPaymentLinkSuccess}
                                onError={onPaymentLinkError}
                              />
                            )}
                          </Box>
                          {clientInvoices.length > 0 ? (
                            <InvoicesTableDesktop
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
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textAlign: "center", py: 4 }}
                            >
                              No invoices found for this client
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
