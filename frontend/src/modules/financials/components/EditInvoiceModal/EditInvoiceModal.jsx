import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  modalCard,
  titlesTypography,
  primaryIconButton,
} from "../../../../common/styles/styles";
import { CancelButton } from "../../../../common/components/ui/CancelButton";

const CURRENCIES = ["USD", "EUR", "GBP", "MXN"];
const STATUSES = ["draft", "sent", "viewed", "paid", "overdue", "cancelled"];

const buildSchema = (t) =>
  z
    .object({
      invoiceNumber: z.string(),
      title: z.string().min(1, t("financials.form.titleRequired")),
      amount: z.coerce.number().min(0, t("financials.form.amountMin")),
      currency: z.enum(CURRENCIES, { message: t("financials.form.currencyRequired") }),
      status: z.enum(STATUSES, { message: t("financials.form.statusRequired") }),
      paymentMethod: z.string().default(""),
      issuedDate: z.string().min(1, t("financials.form.issuedDateRequired")),
      dueDate: z.string().min(1, t("financials.form.dueDateRequired")),
      paidDate: z.string().default(""),
    })
    .superRefine((data, ctx) => {
      if (data.status === "paid" && !data.paidDate) {
        ctx.addIssue({
          code: "custom",
          message: t("financials.form.paidDateRequired"),
          path: ["paidDate"],
        });
      }
    });

export const EditInvoiceModal = ({
  showEditInvoiceModal,
  invoiceData,
  onSave,
  onClose,
  savingInvoiceEdit,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(buildSchema(t)),
    mode: "onChange",
    defaultValues: {
      invoiceNumber: "",
      title: "",
      amount: 0,
      currency: "USD",
      status: "sent",
      paymentMethod: "",
      issuedDate: "",
      dueDate: "",
      paidDate: "",
    },
  });

  const statusValue = watch("status");

  // Reset form when modal opens with invoice data
  useEffect(() => {
    if (showEditInvoiceModal && invoiceData) {
      reset({
        invoiceNumber: invoiceData.invoiceNumber || "",
        title: invoiceData.title || "",
        amount: invoiceData.amount || 0,
        currency: invoiceData.currency || "USD",
        status: invoiceData.status || "sent",
        paymentMethod: invoiceData.paymentMethod || "",
        issuedDate: invoiceData.issuedDate
          ? new Date(invoiceData.issuedDate).toISOString().split("T")[0]
          : "",
        dueDate: invoiceData.dueDate
          ? new Date(invoiceData.dueDate).toISOString().split("T")[0]
          : "",
        paidDate: invoiceData.paidDate
          ? new Date(invoiceData.paidDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [showEditInvoiceModal, invoiceData, reset]);

  const markAsPaid = () => {
    setValue("status", "paid", { shouldValidate: true });
    setValue("paidDate", new Date().toISOString().split("T")[0], { shouldValidate: true });
  };

  const onSubmit = (data) => {
    onSave({ ...data, id: invoiceData?.id });
  };

  return (
    <Dialog
      open={showEditInvoiceModal}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: modalCard?.dialogSection,
        },
      }}
    >
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
        <Box
          component="form"
          id="edit-invoice-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
            <Controller
              name="invoiceNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("financials.form.invoiceName")}
                  disabled
                  sx={modalCard?.inputSection}
                />
              )}
            />
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("financials.form.title")}
                  required
                  sx={modalCard?.inputSection}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </Box>

          <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("financials.form.amount")}
                  type="number"
                  inputProps={{ step: 0.01, min: 0 }}
                  required
                  sx={modalCard?.inputSection}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              )}
            />
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.currency}>
                  <InputLabel sx={modalCard?.multiOptionFilter?.inputLabelSection}>
                    {t("financials.form.currency")}
                  </InputLabel>
                  <Select
                    {...field}
                    label={t("financials.form.currency")}
                    sx={modalCard?.multiOptionFilter?.selectSection}
                  >
                    {CURRENCIES.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                  {errors.currency && (
                    <FormHelperText>{errors.currency.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel sx={modalCard?.multiOptionFilter?.inputLabelSection}>
                    {t("financials.form.status")}
                  </InputLabel>
                  <Select
                    {...field}
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
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel sx={modalCard?.multiOptionFilter?.inputLabelSection}>
                    {t("financials.form.paymentMethod")}
                  </InputLabel>
                  <Select
                    {...field}
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
              )}
            />
          </Box>

          <Box sx={modalCard?.boxModalStyle?.boxManagementModal}>
            <Controller
              name="issuedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("financials.form.issuedDate")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={modalCard?.inputSection}
                  error={!!errors.issuedDate}
                  helperText={errors.issuedDate?.message}
                />
              )}
            />
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("financials.form.dueDate")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={modalCard?.inputSection}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate?.message}
                />
              )}
            />
          </Box>

          {statusValue === "paid" && (
            <Box sx={{ ...modalCard?.boxModalStyle?.boxManagementModal, justifyContent: "flex-start" }}>
              <Controller
                name="paidDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("financials.form.paidDate")}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText={errors.paidDate?.message || t("financials.form.paidDateHelper")}
                    error={!!errors.paidDate}
                    sx={modalCard?.inputSection}
                  />
                )}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          margin: "0 0 1rem 0",
          justifyContent: statusValue !== "paid" ? "space-between" : "center",
          px: 3,
        }}
      >
        {statusValue !== "paid" && (
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
            variant="contained"
            disabled={savingInvoiceEdit || !isValid}
            onClick={handleSubmit(onSubmit)}
            sx={{ ...primaryIconButton, width: "8rem" }}
          >
            {savingInvoiceEdit ? t("common.saving") : t("common.save")}
          </Button>
          <CancelButton
            handleClick={onClose}
            text={t("common.cancel")}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
