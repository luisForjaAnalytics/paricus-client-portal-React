import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
import {
  table,
  colors,
  typography,
  statusBadges,
} from "../../../../common/styles/styles";

export const InvoicesTableDesktop = ({
  invoices,
  isAdmin,
  formatDate,
  formatCurrency,
  downloadInvoice,
  openEditInvoiceModal,
  handleDeleteInvoice,
  openPaymentLink,
  onPaymentLinkSuccess,
  onPaymentLinkError,
}) => {
  const { t } = useTranslation();

  // Función para obtener el estilo del badge según el status
  const getStatusBadgeStyle = (status) => {
    const statusMap = {
      paid: statusBadges.paid,
      sent: statusBadges.sent,
      pending: statusBadges.pending,
      overdue: statusBadges.error,
    };
    return statusMap[status?.toLowerCase()] || statusBadges.info;
  };

  return (
    <TableContainer
      sx={{
        backgroundColor: "transparent",
        borderRadius: "1rem",
        // border: `1px solid ${colors.border}`,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Table>
        <TableHead sx={table.header}>
          <TableRow>
            <TableCell sx={table.headerCell}>
              {t("invoices.table.invoiceNumber")}
            </TableCell>
            <TableCell sx={table.headerCell}>
              {t("invoices.table.fileName")}
            </TableCell>
            <TableCell sx={table.headerCell}>
              {t("invoices.table.amount")}
            </TableCell>
            <TableCell sx={table.headerCell}>
              {t("invoices.table.status")}
            </TableCell>
            <TableCell sx={table.headerCell}>
              {t("invoices.table.dueDate")}
            </TableCell>
            <TableCell sx={table.headerCell}>
              {t("invoices.table.paymentDate")}
            </TableCell>
            {isAdmin && (
              <TableCell sx={table.headerCell}>
                {t("invoices.table.paymentLink")}
              </TableCell>
            )}
            <TableCell sx={{ ...table.headerCell, textAlign: "right" }}>
              {t("invoices.table.actions")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={table.body}>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} sx={table.row}>
              <TableCell sx={table.cell}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.body, // text-sm (14px)
                    fontWeight: typography.fontWeight.bold,
                    fontFamily: typography.fontFamily,
                    color: colors.textPrimary,
                  }}
                >
                  {invoice.invoiceNumber}
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.small, // text-xs (12px)
                    color: colors.textMuted,
                    fontFamily: typography.fontFamily,
                  }}
                >
                  {formatDate(invoice.issuedDate)}
                </Typography>
              </TableCell>
              <TableCell sx={table.cell}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PdfIcon sx={{ color: colors.error, fontSize: 20 }} />
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.body,
                      fontFamily: typography.fontFamily,
                      color: colors.textPrimary,
                    }}
                  >
                    {invoice.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={table.cell}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.body,
                    fontWeight: typography.fontWeight.bold,
                    fontFamily: typography.fontFamily,
                    color: colors.textPrimary,
                  }}
                >
                  {formatCurrency(invoice.amount, invoice.currency)}
                </Typography>
              </TableCell>
              <TableCell sx={table.cell}>
                <Box component="span" sx={getStatusBadgeStyle(invoice.status)}>
                  {invoice.status.toUpperCase()}
                </Box>
              </TableCell>
              <TableCell sx={table.cell}>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.body,
                    color: colors.textSecondary,
                    fontFamily: typography.fontFamily,
                  }}
                >
                  {formatDate(invoice.dueDate)}
                </Typography>
              </TableCell>
              <TableCell sx={table.cell}>
                {invoice.paidDate && invoice.status === "paid" ? (
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.body,
                      color: colors.success,
                      fontFamily: typography.fontFamily,
                    }}
                  >
                    {formatDate(invoice.paidDate)}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: typography.fontSize.body,
                      color: colors.textMuted,
                      fontFamily: typography.fontFamily,
                    }}
                  >
                    —
                  </Typography>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell sx={table.cell}>
                  <PendingLinkModal
                    invoice={invoice}
                    onSuccess={onPaymentLinkSuccess}
                    onError={onPaymentLinkError}
                  />
                </TableCell>
              )}
              <TableCell sx={{ ...table.cell, textAlign: "right" }}>
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
                      <DownloadIcon
                        fontSize="small"
                        sx={{ color: colors.primary }}
                      />
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
