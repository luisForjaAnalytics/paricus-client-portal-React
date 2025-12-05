import React, { useState, useMemo } from "react";
import {
  Avatar,
  Box,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
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
import { useTranslation } from "react-i18next";

export const ClientBreakdownDesktop = ({
  clientBreakdowns,
  formatCurrency,
  invoices = [],
  isAdmin,
  formatDate,
  getStatusColor,
  viewInvoice,
  downloadInvoice,
  openEditInvoiceModal,
  handleDeleteInvoice,
  openPaymentLink,
  onPaymentLinkSuccess,
  onPaymentLinkError,
  selectClient,
}) => {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("company");
  const [order, setOrder] = useState("asc");

  const toggleRow = (rowId, folder) => {
    const isExpanding = !expandedRows[rowId];
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: isExpanding,
    }));
    // When expanding a row, select that client to load its invoices
    if (isExpanding && selectClient) {
      selectClient(folder);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  // Filter invoices for the expanded client
  const getClientInvoices = (folder) => {
    const clientBreakdown = clientBreakdowns.find((cb) => cb.folder === folder);
    if (!clientBreakdown) return [];

    // Helper to convert client name to folder format (e.g., "IM Telecom" -> "im-telecom")
    const clientNameToFolder = (name) => name?.toLowerCase().replace(/\s+/g, '-') || '';

    // Filter invoices that belong to this client's folder
    return invoices.filter((invoice) => {
      // Check if invoice has folder properties (old way)
      if (invoice.folder === folder || invoice.clientFolder === folder) {
        return true;
      }
      // Match by client name converted to folder format
      if (invoice.client?.name) {
        return clientNameToFolder(invoice.client.name) === folder;
      }
      return false;
    });
  };

  // Sort and paginate data
  const sortedData = useMemo(() => {
    const sorted = [...clientBreakdowns].sort((a, b) => {
      let aValue, bValue;

      switch (orderBy) {
        case "company":
          aValue = a.folderDisplay.toLowerCase();
          bValue = b.folderDisplay.toLowerCase();
          break;
        case "invoices":
          aValue = a.totalInvoices;
          bValue = b.totalInvoices;
          break;
        case "revenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "outstanding":
          aValue = a.outstandingBalance;
          bValue = b.outstandingBalance;
          break;
        case "overdue":
          aValue = a.overdueAmount;
          bValue = b.overdueAmount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [clientBreakdowns, orderBy, order]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  // Early return if no data - after all hooks
  if (clientBreakdowns.length === 0) {
    return (
      <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
        <Typography
          sx={{
            ...titlesTypography.primaryTitle,
            mb: 2,
          }}
        >
          {t("financials.clientBreakdown.title")}
        </Typography>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            {t("financials.clientBreakdown.noClientsFound")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("financials.clientBreakdown.uploadInvoicesMessage")}
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
        {t("financials.clientBreakdown.title")}
      </Typography>

      <TableContainer
        sx={{
          ...card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: colors.background,
              borderBottom: `2px solid ${colors.border}`,
            }}
          >
            <TableRow>
              <TableCell sx={{ width: 60 }} />
              <TableCell>
                <TableSortLabel
                  active={orderBy === "company"}
                  direction={orderBy === "company" ? order : "asc"}
                  onClick={() => handleRequestSort("company")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  {t("financials.clientBreakdown.columns.company")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "invoices"}
                  direction={orderBy === "invoices" ? order : "asc"}
                  onClick={() => handleRequestSort("invoices")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  {t("financials.clientBreakdown.columns.invoices")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "revenue"}
                  direction={orderBy === "revenue" ? order : "asc"}
                  onClick={() => handleRequestSort("revenue")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  {t("financials.clientBreakdown.columns.revenue")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "outstanding"}
                  direction={orderBy === "outstanding" ? order : "asc"}
                  onClick={() => handleRequestSort("outstanding")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  {t("financials.clientBreakdown.columns.outstanding")}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "overdue"}
                  direction={orderBy === "overdue" ? order : "asc"}
                  onClick={() => handleRequestSort("overdue")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  {t("financials.clientBreakdown.columns.overdue")}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((client, index) => (
              <React.Fragment key={index}>
                <TableRow
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: colors.primaryLight,
                    },
                  }}
                >
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(index, client.folder)}
                      sx={{ color: colors.primary }}
                    >
                      {expandedRows[index] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
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
                <TableRow key={`collapse-${index}`}>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={expandedRows[index]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        sx={{
                          py: 3,
                          bgcolor: colors.surface,
                        }}
                      >
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
                            {client.folderDisplay}{" "}
                            {t("financials.clientBreakdown.invoicesTitle")}
                          </Typography>
                          {isAdmin && (
                            <UploadInvoiceButton
                              selectedFolder={client.folder}
                              onSuccess={onPaymentLinkSuccess}
                              onError={onPaymentLinkError}
                            />
                          )}
                        </Box>
                        {getClientInvoices(client.folder).length > 0 ? (
                          <InvoicesTableDesktop
                            invoices={getClientInvoices(client.folder)}
                            isAdmin={isAdmin}
                            formatDate={formatDate}
                            formatCurrency={formatCurrency}
                            getStatusColor={getStatusColor}
                            viewInvoice={viewInvoice}
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
                            {t("financials.clientBreakdown.noInvoicesFound")}
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={clientBreakdowns.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ...card,
          borderTop: `1px solid ${colors.border}`,
          mt: 0,
        }}
      />
    </Box>
  );
};
