import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Chip, Typography, Divider } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UniversalMobilDataTable } from "../../../../common/components/ui/UniversalMobilDataTable";
import { InvoicesTableMobile } from "../InvoicesTable/InvoicesTableMobile";

export const ClientBreakdownMobile = ({
  clientBreakdowns,
  formatCurrency,
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
  const { t } = useTranslation();

  // Helper to convert client name to folder format (e.g., "IM Telecom" -> "im-telecom")
  const clientNameToFolder = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-") || "";

  // Get invoices for a specific client
  const getClientInvoices = (client) => {
    return invoices.filter((invoice) => {
      if (
        invoice.folder === client.folder ||
        invoice.clientFolder === client.folder
      ) {
        return true;
      }
      if (invoice.client?.name) {
        return clientNameToFolder(invoice.client.name) === client.folder;
      }
      return false;
    });
  };

  // Column definitions for expanded content
  const columns = useMemo(
    () => [
      {
        field: "totalInvoices",
        headerName: t("financials.clientBreakdown.totalInvoices"),
        labelWidth: 120,
        renderCell: ({ value }) => (
          <Chip label={value} size="small" color="primary" />
        ),
      },
      {
        field: "totalRevenue",
        headerName: t("financials.clientBreakdown.revenue"),
        labelWidth: 120,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight="bold" color="success.main">
            {formatCurrency(row.totalRevenue)}
          </Typography>
        ),
      },
      {
        field: "outstandingBalance",
        headerName: t("financials.clientBreakdown.outstanding"),
        labelWidth: 120,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight="bold" color="warning.main">
            {formatCurrency(row.outstandingBalance)}
          </Typography>
        ),
      },
      {
        field: "overdueAmount",
        headerName: t("financials.clientBreakdown.overdue"),
        labelWidth: 120,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight="bold" color="error.main">
            {formatCurrency(row.overdueAmount)}
          </Typography>
        ),
      },
    ],
    [t, formatCurrency],
  );

  // Render the nested invoices table in the expanded footer
  const renderExpandedFooter = (row) => {
    const clientInvoices = getClientInvoices(row);

    if (clientInvoices.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          {t("financials.clientBreakdown.invoices")} ({clientInvoices.length})
        </Typography>
        <Box sx={{ mt: 2, mx: -2 }}>
          <InvoicesTableMobile
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
      </Box>
    );
  };

  return (
    <UniversalMobilDataTable
      rows={clientBreakdowns}
      columns={columns}
      primaryField="folderDisplay"
      primaryIcon={<BusinessIcon fontSize="small" color="primary" />}
      showTitle={true}
      titleField="folderDisplay"
      headerTitle={t("financials.clientBreakdown.title")}
      loading={false}
      emptyMessage={t("financials.clientBreakdown.noClients")}
      labelWidth={120}
      getRowId={(row) => row.folder}
      renderExpandedFooter={renderExpandedFooter}
      sx={{
        maxHeight: "70vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c5c5c5",
          borderRadius: "8rem",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#9e9e9e",
        },
      }}
    />
  );
};

ClientBreakdownMobile.propTypes = {
  clientBreakdowns: PropTypes.arrayOf(
    PropTypes.shape({
      folder: PropTypes.string.isRequired,
      folderDisplay: PropTypes.string.isRequired,
      totalInvoices: PropTypes.number.isRequired,
      totalRevenue: PropTypes.number.isRequired,
      outstandingBalance: PropTypes.number.isRequired,
      overdueAmount: PropTypes.number.isRequired,
    }),
  ).isRequired,
  formatCurrency: PropTypes.func.isRequired,
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
