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
} from "@mui/material";
import {
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { PendingLinkModal } from "./PendingLinkModal";

export const InvoicesTableView = ({
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
}) => {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("invoices.table.invoiceNumber")}</TableCell>
            <TableCell>{t("invoices.table.fileName")}</TableCell>
            <TableCell>{t("invoices.table.amount")}</TableCell>
            <TableCell>{t("invoices.table.status")}</TableCell>
            <TableCell>{t("invoices.table.dueDate")}</TableCell>
            <TableCell>{t("invoices.table.paymentDate")}</TableCell>
            {isAdmin && <TableCell>{t("invoices.table.paymentLink")}</TableCell>}
            <TableCell align="right">{t("invoices.table.actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {invoice.invoiceNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(invoice.issuedDate)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PdfIcon color="error" fontSize="small" />
                  <Typography variant="body2">{invoice.title}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={invoice.status.toUpperCase()}
                  color={getStatusColor(invoice.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(invoice.dueDate)}
                </Typography>
              </TableCell>
              <TableCell>
                {invoice.paidDate && invoice.status === "paid" ? (
                  <Typography variant="body2" color="success.main">
                    {formatDate(invoice.paidDate)}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    —
                  </Typography>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <PendingLinkModal
                    invoice={invoice}
                    onSuccess={onPaymentLinkSuccess}
                    onError={onPaymentLinkError}
                  />
                </TableCell>
              )}
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
