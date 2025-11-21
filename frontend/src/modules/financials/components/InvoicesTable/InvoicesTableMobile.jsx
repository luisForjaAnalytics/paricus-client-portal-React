import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Box,
  Paper,
  Collapse,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PendingLinkModal } from "./PendingLinkModal";

function InvoiceRow({
  invoice,
  isAdmin,
  formatDate,
  formatCurrency,
  getStatusColor,
  downloadInvoice,
  openEditInvoiceModal,
  handleDeleteInvoice,
  openPaymentLink,
  onPaymentLinkSuccess,
  onPaymentLinkError,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <>
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
          <Typography variant="body2" fontWeight="medium">
            {invoice.invoiceNumber}
          </Typography>
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
                {t("invoices.table.invoiceNumber")}: {invoice.invoiceNumber}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* File Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("invoices.table.fileName")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PdfIcon color="error" fontSize="small" />
                    <Typography variant="body2">{invoice.title}</Typography>
                  </Box>
                </Box>

                {/* Amount */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("invoices.table.amount")}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </Typography>
                </Box>

                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("invoices.table.status")}:
                  </Typography>
                  <Chip
                    label={invoice.status.toUpperCase()}
                    color={getStatusColor(invoice.status)}
                    size="small"
                  />
                </Box>

                {/* Issued Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    Issued Date:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(invoice.issuedDate)}
                  </Typography>
                </Box>

                {/* Due Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("invoices.table.dueDate")}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(invoice.dueDate)}
                  </Typography>
                </Box>

                {/* Payment Date */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("invoices.table.paymentDate")}:
                  </Typography>
                  {invoice.paidDate && invoice.status === "paid" ? (
                    <Typography variant="body2" color="success.main">
                      {formatDate(invoice.paidDate)}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      —
                    </Typography>
                  )}
                </Box>

                {/* Payment Link (Admin only) */}
                {isAdmin && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ minWidth: 120 }}
                    >
                      {t("invoices.table.paymentLink")}:
                    </Typography>

                    {/* ///  boton link de pago /// */}
                    <PendingLinkModal
                      invoice={invoice}
                      onSuccess={onPaymentLinkSuccess}
                      onError={onPaymentLinkError}
                    />
                  </Box>
                )}

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 120 }}
                  >
                    {t("invoices.table.actions")}:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {!isAdmin && invoice.paymentLink && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => openPaymentLink(invoice.paymentLink)}
                      >
                        {t("invoices.actions.payNow")}
                      </Button>
                    )}
                    {isAdmin && (
                      <Tooltip title={t("invoices.actions.editInvoice")}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openEditInvoiceModal(invoice)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t("invoices.actions.download")}>
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => downloadInvoice(invoice)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {isAdmin && (
                      <Tooltip title={t("invoices.actions.delete")}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteInvoice(invoice)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export const InvoicesTableMobile = ({
  invoices,
  isAdmin,
  formatDate,
  formatCurrency,
  getStatusColor,
  downloadInvoice,
  openEditInvoiceModal,
  handleDeleteInvoice,
  openPaymentLink,
  onPaymentLinkSuccess,
  onPaymentLinkError,
  selectedFolderDisplay,
  onUploadClick,
  onRefreshClick,
  loadingInvoices,
  hideHeader = false,
}) => {
  const { t } = useTranslation();

  const title = isAdmin
    ? `${selectedFolderDisplay || "Client"} Invoices`
    : "Your Invoices";

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, mt: hideHeader ? 0 : 3 }}>
      {/* Header with Title and Action Buttons */}
      {!hideHeader && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
          }}
        >
          <Typography variant="h6" fontWeight="semibold">
            {title}
          </Typography>
          {isAdmin ? (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Upload Invoice">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={onUploadClick}
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton
                  color="default"
                  size="small"
                  onClick={onRefreshClick}
                  disabled={loadingInvoices}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Tooltip title="Refresh">
              <IconButton
                color="default"
                size="small"
                onClick={onRefreshClick}
                disabled={loadingInvoices}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Collapsible Table */}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible invoices table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="subtitle2" fontWeight="600">
                  {t("invoices.table.invoiceNumber")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
