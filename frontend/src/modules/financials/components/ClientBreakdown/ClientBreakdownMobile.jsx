import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Chip,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { InvoicesTableMobile } from "../InvoicesTable/InvoicesTableMobile";
import {
  titlesTypography,
  colors,
  selectMenuProps,
} from "../../../../common/styles/styles";

// Pure utility — no component deps needed
const clientNameToFolder = (name) =>
  name?.toLowerCase().replace(/\s+/g, "-") || "";

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
  const [selectedFolder, setSelectedFolder] = useState(
    clientBreakdowns[0]?.folder || "",
  );

  // For non-admin users: show invoices directly without client breakdown
  if (!isAdmin) {
    return (
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ ...titlesTypography.mobilDataTableTableHeader, mb: 1 }}
          >
            {t("financials.clientBreakdown.invoices")}
          </Typography>
        </Box>

        {invoices.length > 0 ? (
          <InvoicesTableMobile
            invoices={invoices}
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
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <BusinessIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              {t("financials.clientBreakdown.noInvoicesFound")}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Find the selected client breakdown
  const selectedBreakdown = useMemo(() => {
    try {
      return clientBreakdowns.find((c) => c.folder === selectedFolder) || null;
    } catch {
      return null;
    }
  }, [clientBreakdowns, selectedFolder]);

  // Get invoices for the selected client (logic inlined to avoid stale closure)
  const selectedInvoices = useMemo(() => {
    try {
      if (!selectedBreakdown) return [];

      return invoices.filter((invoice) => {
        if (
          invoice.folder === selectedBreakdown.folder ||
          invoice.clientFolder === selectedBreakdown.folder
        ) {
          return true;
        }
        if (invoice.client?.name) {
          return (
            clientNameToFolder(invoice.client.name) ===
            selectedBreakdown.folder
          );
        }
        return false;
      });
    } catch {
      return [];
    }
  }, [selectedBreakdown, invoices]);

  if (clientBreakdowns.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <BusinessIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          {t("financials.clientBreakdown.noClients")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, mb: 4 }}>
      {/* Header with title + client selector */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ ...titlesTypography.mobilDataTableTableHeader }}
        >
          {t("financials.clientBreakdown.title")}
        </Typography>

        <FormControl size="small" fullWidth>
          <InputLabel
            id="client-breakdown-selector-label"
            sx={{
              fontSize: "0.85rem",
              "&.Mui-focused": { color: colors.primary },
            }}
          >
            {t("financials.clientBreakdown.selectClient", "Select Client")}
          </InputLabel>
          <Select
            labelId="client-breakdown-selector-label"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            label={t("financials.clientBreakdown.selectClient", "Select Client")}
            MenuProps={selectMenuProps}
            sx={{
              borderRadius: "0.75rem",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.border,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
              },
            }}
          >
            {clientBreakdowns.map((client) => (
              <MenuItem key={client.folder} value={client.folder}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    {client.folderDisplay}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Selected client stats + invoices */}
      {selectedBreakdown && (
        <>
          {/* Stats summary card */}
          <Card
            sx={{
              mb: 2,
              borderRadius: "0.75rem",
              border: `1px solid ${colors.border}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.5,
                }}
              >
                {/* Total Invoices */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {t("financials.clientBreakdown.totalInvoices")}
                  </Typography>
                  <Chip
                    label={selectedBreakdown.totalInvoices}
                    size="small"
                    color="primary"
                  />
                </Box>

                {/* Revenue */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {t("financials.clientBreakdown.revenue")}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatCurrency(selectedBreakdown.totalRevenue)}
                  </Typography>
                </Box>

                {/* Outstanding */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {t("financials.clientBreakdown.outstanding")}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {formatCurrency(selectedBreakdown.outstandingBalance)}
                  </Typography>
                </Box>

                {/* Overdue */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {t("financials.clientBreakdown.overdue")}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="error.main"
                  >
                    {formatCurrency(selectedBreakdown.overdueAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Invoices for selected client */}
          {selectedInvoices.length > 0 ? (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                {t("financials.clientBreakdown.invoices")} (
                {selectedInvoices.length})
              </Typography>
              <InvoicesTableMobile
                invoices={selectedInvoices}
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
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {t("financials.clientBreakdown.noInvoicesFound")}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
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
