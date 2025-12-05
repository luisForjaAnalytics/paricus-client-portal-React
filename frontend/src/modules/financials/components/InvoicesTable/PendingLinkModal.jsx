import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Warning as WarningIcon, Edit as EditIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useUpdatePaymentLinkMutation } from "../../../../store/api/invoicesApi";
import { useCreateLogMutation } from "../../../../store/api/logsApi";
import { useSelector } from "react-redux";
import { primaryButton, outlinedButton } from "../../../../common/styles/styles";

export const PendingLinkModal = ({ invoice, onSuccess, onError }) => {
  const { t } = useTranslation();
  const authUser = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [updatePaymentLinkMutation, { isLoading: savingPaymentLink }] =
    useUpdatePaymentLinkMutation();
  const [createLog] = useCreateLogMutation();

  const handleOpen = () => {
    setPaymentLink(invoice.paymentLink || "");
    setOpen(true);
  };

  const handleClose = () => {
    setPaymentLink("");
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoice || !paymentLink) return;

    try {
      await updatePaymentLinkMutation({
        id: invoice.id,
        paymentLink: paymentLink,
      }).unwrap();

      // Log the successful payment link save
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: 'UPDATE',
          entity: 'Invoice',
          description: `Set payment link for invoice ${invoice.invoiceNumber} (${invoice.title})`,
          status: 'SUCCESS',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging payment link save:", logErr);
      }

      if (onSuccess) {
        onSuccess(t("invoices.paymentLink.successMessage"));
      }
      handleClose();
    } catch (err) {
      console.error("Error saving payment link:", err);
      const errorMessage = err.data?.message || t("invoices.paymentLink.errorMessage");

      // Log the failed payment link save
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: 'UPDATE',
          entity: 'Invoice',
          description: `Failed to set payment link for invoice ${invoice.invoiceNumber} (${invoice.title})`,
          status: 'FAILURE',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging payment link save failure:", logErr);
      }

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <>
      {/* Button/Chip */}
      {!invoice.paymentLink ? (
        <Chip
          label={t("invoices.paymentLink.pendingLink")}
          color="warning"
          size="small"
          icon={<WarningIcon />}
          onClick={handleOpen}
          sx={{ cursor: "pointer" }}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Chip label={t("invoices.paymentLink.linkSet")} color="success" size="small" />
          <Tooltip title={t("invoices.paymentLink.updateLink")}>
            <IconButton size="small" color="primary" onClick={handleOpen}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit} sx={{ borderRadius: "1rem" }}>
          <DialogTitle>{t("invoices.paymentLink.modalTitle")}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("invoices.paymentLink.invoiceLabel")}: {invoice?.fileName || invoice?.title}
            </Typography>
            <TextField
              fullWidth
              label={t("invoices.paymentLink.urlLabel")}
              type="url"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder={t("invoices.paymentLink.urlPlaceholder")}
              helperText={t("invoices.paymentLink.urlHelper")}
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={outlinedButton}>
              {t("invoices.paymentLink.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingPaymentLink}
              sx={primaryButton}
            >
              {savingPaymentLink ? t("invoices.paymentLink.saving") : t("invoices.paymentLink.saveButton")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PendingLinkModal;
