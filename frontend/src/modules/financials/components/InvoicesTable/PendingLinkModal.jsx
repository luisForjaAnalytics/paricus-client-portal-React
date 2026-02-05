import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Warning as WarningIcon, Edit as EditIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useUpdatePaymentLinkMutation } from "../../../../store/api/invoicesApi";
import { useCreateLogMutation } from "../../../../store/api/logsApi";
import { useSelector } from "react-redux";
import {
  modalCard,
  colors,
  titlesTypography,
} from "../../../../common/styles/styles";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { CancelButton } from "../../../../common/components/ui/CancelButton/CancelButton";
import { extractApiError } from "../../../../common/utils/apiHelpers";

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
          eventType: "UPDATE",
          entity: "Invoice",
          description: `Set payment link for invoice ${invoice.invoiceNumber} (${invoice.title})`,
          status: "SUCCESS",
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
      // Log the failed payment link save
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: "UPDATE",
          entity: "Invoice",
          description: `Failed to set payment link for invoice ${invoice.invoiceNumber} (${invoice.title})`,
          status: "FAILURE",
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging payment link save failure:", logErr);
      }

      if (onError) {
        onError(extractApiError(err, t("invoices.paymentLink.errorMessage")));
      }
    }
  };

  return (
    <>
      {/* Button/Chip */}
      {!invoice.paymentLink ? (
        <Chip
          label={t("invoices.paymentLink.pendingLink")}
          size="small"
          icon={<WarningIcon color={colors.intranetYellow.color} />}
          onClick={handleOpen}
          sx={{ cursor: "pointer", ...colors.intranetYellow }}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Chip
            label={t("invoices.paymentLink.linkSet")}
            color="success"
            size="small"
            sx={colors.intranetgreen}
          />
          <Tooltip title={t("invoices.paymentLink.updateLink")}>
            <IconButton size="small" color="primary" onClick={handleOpen}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: modalCard?.dialogSection,
          },
        }}
      >
        <form onSubmit={handleSubmit} sx={{ borderRadius: "1rem" }}>
          <DialogTitle>
            <Typography
              sx={{
                ...titlesTypography.primaryTitle,
                textAlign: "center",
              }}
            >
              {t("invoices.paymentLink.modalTitle")}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("invoices.paymentLink.invoiceLabel")}:{" "}
              {invoice?.fileName || invoice?.title}
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
              sx={modalCard?.inputSection}
            />
          </DialogContent>
          <DialogActions
            sx={{
              margin: "0 0 1rem 0",
              justifyContent: "center",
            }}
          >
            <ActionButton
              type="submit"
              disabled={savingPaymentLink}
              text={savingPaymentLink ? t("invoices.paymentLink.saving") : t("invoices.paymentLink.saveButton")}
            />
            <CancelButton
              handleClick={handleClose}
              text={t("invoices.paymentLink.cancel")}
            />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

PendingLinkModal.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.number.isRequired,
    invoiceNumber: PropTypes.string.isRequired,
    title: PropTypes.string,
    fileName: PropTypes.string,
    paymentLink: PropTypes.string,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
