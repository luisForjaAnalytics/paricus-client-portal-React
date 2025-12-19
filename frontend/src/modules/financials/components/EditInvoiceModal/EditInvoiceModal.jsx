import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  primaryButton,
  outlinedButton,
  modalCard,
  titlesTypography,
  primaryIconButton,
} from "../../../../common/styles/styles";

export const EditInvoiceModal = ({
  showEditInvoiceModal,
  editInvoiceForm,
  setEditInvoiceForm,
  handleSaveInvoiceEdit,
  setShowEditInvoiceModal,
  savingInvoiceEdit,
  markAsPaid,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={showEditInvoiceModal}
      onClose={() => setShowEditInvoiceModal(false)}
      slotProps={{
        paper: {
          sx: modalCard?.dialogSection,
        },
      }}
    >
      <form onSubmit={handleSaveInvoiceEdit}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                ...titlesTypography?.primaryTitle,
                textAlign: "center",
              }}
            >
              {t("invoices.actions.editInvoice")}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box>
            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              <TextField
                fullWidth
                label={t("financials.form.invoiceName")}
                value={editInvoiceForm.invoiceNumber}
                disabled
                sx={modalCard?.inputSection}
              />

              <TextField
                fullWidth
                label={t("financials.form.title")}
                value={editInvoiceForm.title}
                onChange={(e) =>
                  setEditInvoiceForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
                sx={modalCard?.inputSection}
              />
            </Box>

            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              <TextField
                fullWidth
                label={t("financials.form.amount")}
                type="number"
                inputProps={{ step: 0.01, min: 0 }}
                value={editInvoiceForm.amount}
                onChange={(e) =>
                  setEditInvoiceForm((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value),
                  }))
                }
                required
                sx={modalCard?.inputSection}
              />

              <FormControl fullWidth>
                <InputLabel sx={modalCard?.multiOptionFilter?.inputLabelSection}>
                  {t("financials.form.currency")}
                </InputLabel>
                <Select
                  value={editInvoiceForm.currency}
                  onChange={(e) =>
                    setEditInvoiceForm((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  label={t("financials.form.currency")}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="MXN">MXN</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              <FormControl fullWidth>
                <InputLabel sx={modalCard?.multiOptionFilter?.inputLabelSection}>
                  {t("financials.form.status")}
                </InputLabel>
                <Select
                  value={editInvoiceForm.status}
                  onChange={(e) =>
                    setEditInvoiceForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  label={t("financials.form.status")}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                >
                  <MenuItem value="draft">{t("financials.form.statuses.draft")}</MenuItem>
                  <MenuItem value="sent">{t("financials.form.statuses.sent")}</MenuItem>
                  <MenuItem value="viewed">{t("financials.form.statuses.viewed")}</MenuItem>
                  <MenuItem value="paid">{t("financials.form.statuses.paid")}</MenuItem>
                  <MenuItem value="overdue">{t("financials.form.statuses.overdue")}</MenuItem>
                  <MenuItem value="cancelled">{t("financials.form.statuses.cancelled")}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={modalCard?.multiOptionFilter?.inputLabelSection}>
                  {t("financials.form.paymentMethod")}
                </InputLabel>
                <Select
                  value={editInvoiceForm.paymentMethod}
                  onChange={(e) =>
                    setEditInvoiceForm((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value,
                    }))
                  }
                  label={t("financials.form.paymentMethod")}
                  sx={modalCard?.multiOptionFilter?.selectSection}
                >
                  <MenuItem value="">{t("financials.form.paymentMethods.notSet")}</MenuItem>
                  <MenuItem value="credit_card">{t("financials.form.paymentMethods.creditCard")}</MenuItem>
                  <MenuItem value="bank_transfer">{t("financials.form.paymentMethods.bankTransfer")}</MenuItem>
                  <MenuItem value="check">{t("financials.form.paymentMethods.check")}</MenuItem>
                  <MenuItem value="cash">{t("financials.form.paymentMethods.cash")}</MenuItem>
                  <MenuItem value="other">{t("financials.form.paymentMethods.other")}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
              <TextField
                fullWidth
                label={t("financials.form.issuedDate")}
                type="date"
                value={editInvoiceForm.issuedDate}
                onChange={(e) =>
                  setEditInvoiceForm((prev) => ({
                    ...prev,
                    issuedDate: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
                sx={modalCard?.inputSection}
              />

              <TextField
                fullWidth
                label={t("financials.form.dueDate")}
                type="date"
                value={editInvoiceForm.dueDate}
                onChange={(e) =>
                  setEditInvoiceForm((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
                sx={modalCard?.inputSection}
              />
            </Box>

            {editInvoiceForm.status === "paid" && (
              <Box sx={{...modalCard?.boxModalStyle?.boxManagementModal, justifyContent: 'flex-start'}}>
                <TextField
                  fullWidth
                  label={t("financials.form.paidDate")}
                  type="date"
                  value={editInvoiceForm.paidDate}
                  onChange={(e) =>
                    setEditInvoiceForm((prev) => ({
                      ...prev,
                      paidDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText={t("financials.form.paidDateHelper")}
                  sx={modalCard?.inputSection}
                />
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            margin: "0 0 1rem 0",
            justifyContent: editInvoiceForm.status !== "paid" ? "space-between" : "center",
            px: 3,
          }}
        >
          {editInvoiceForm.status !== "paid" && (
            <Button
              variant="contained"
              color="success"
              onClick={markAsPaid}
              sx={primaryIconButton}
            >
              {t("invoices.actions.markAsPaid")}
            </Button>
          )}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={savingInvoiceEdit}
              sx={{ ...primaryIconButton, width: "8rem" }}
            >
              {savingInvoiceEdit ? t("common.saving") : t("common.save")}
            </Button>
            <Button
              onClick={() => setShowEditInvoiceModal(false)}
              sx={outlinedButton}
            >
              {t("common.cancel")}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
