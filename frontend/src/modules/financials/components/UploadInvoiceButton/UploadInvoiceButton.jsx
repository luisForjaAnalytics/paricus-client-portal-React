import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useUploadInvoiceMutation } from "../../../../store/api/invoicesApi";
import { useTesseractOCR } from "../../../../common/hooks/useTesseractOCR";
import { parseInvoiceData } from "../../../../common/utils/invoiceParser";
import {
  primaryIconButton,
  outlinedButton,
  outlinedIconButton,
  modalCard,
  titlesTypography,
} from "../../../../common/styles/styles";

export const UploadInvoiceButton = ({ selectedFolder, onSuccess, onError }) => {
  const { t } = useTranslation();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadInvoiceMutation, { isLoading: uploading }] =
    useUploadInvoiceMutation();
  const {
    text,
    progress,
    loading: ocrLoading,
    error: ocrError,
    runOcr,
    reset: resetOcr,
  } = useTesseractOCR();

  // React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      invoiceName: "",
      description: "",
      amount: "",
      currency: "USD",
      status: "sent",
      dueDate: "",
      issuedDate: "",
      paymentMethod: "",
      paymentLink: "",
      file: null,
    },
  });

  const watchedFile = watch("file");

  // Procesar el texto OCR cuando esté disponible
  useEffect(() => {
    if (text && !ocrLoading) {
      const extractedData = parseInvoiceData(text);

      // Actualizar el formulario solo con los campos que se encontraron
      if (extractedData.invoiceName) setValue("invoiceName", extractedData.invoiceName);
      if (extractedData.amount > 0) setValue("amount", extractedData.amount);
      if (extractedData.issuedDate) setValue("issuedDate", extractedData.issuedDate);
      if (extractedData.dueDate) setValue("dueDate", extractedData.dueDate);
      if (extractedData.description) setValue("description", extractedData.description);
    }
  }, [text, ocrLoading, setValue]);

  // Mostrar errores de OCR
  useEffect(() => {
    if (ocrError) {
      onError(`OCR Error: ${ocrError}`);
    }
  }, [ocrError, onError]);

  const handleFileSelect = async (event) => {
    try {
      const file = event.target.files?.[0] || null;
      if (file) {
        setValue("file", file);
        // Ejecutar OCR en el archivo PDF
        await runOcr(file);
      }
    } catch (err) {
      console.warn(`ERROR: ${err}`);
      onError("Error processing PDF file");
    }
  };

  const handleCancelModal = () => {
    // Resetear el formulario usando React Hook Form
    reset();
    // Limpiar el estado del OCR
    resetOcr();
    // Cerrar el modal
    setShowUploadModal(false);
  };

  const onSubmit = async (data) => {
    if (!selectedFolder) return;

    try {
      const formData = new FormData();
      // File is optional now
      if (data.file) {
        formData.append("file", data.file);
      }
      formData.append("invoiceName", data.invoiceName);
      formData.append("amount", data.amount.toString());
      formData.append("currency", data.currency);
      formData.append("status", data.status);
      formData.append("dueDate", data.dueDate);
      formData.append("issuedDate", data.issuedDate);

      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.paymentMethod) {
        formData.append("paymentMethod", data.paymentMethod);
      }
      if (data.paymentLink) {
        formData.append("paymentLink", data.paymentLink);
      }

      await uploadInvoiceMutation({
        clientFolder: selectedFolder,
        formData,
      }).unwrap();

      onSuccess(t("financials.messages.invoiceUploaded"));
      handleCancelModal();
    } catch (err) {
      console.error("Error uploading invoice:", err);
      const errorMessage =
        err.data?.errors?.map((e) => e.msg).join(", ") ||
        err.data?.error ||
        t("financials.messages.invoiceUploadFailed");
      onError(errorMessage);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
        onClick={() => setShowUploadModal(true)}
        sx={primaryIconButton}
      >
        {t("financials.uploadInvoice")}
      </Button>

      <Dialog
        open={showUploadModal}
        onClose={() => !ocrLoading && handleCancelModal()}
        //maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: modalCard.dialogSection,
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Typography
              sx={{
                ...titlesTypography.primaryTitle,
                textAlign: "center",
              }}
            >
              {t("financials.uploadNewInvoice")}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {/* Indicador de progreso OCR */}
            {ocrLoading && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t("financials.messages.processingPdf")}{" "}
                  {Math.round(progress)}%
                </Typography>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}

            <Box
              container
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={modalCard?.boxModalStyle?.boxUploadInvoiceModal}>
                <Controller
                  name="invoiceName"
                  control={control}
                  rules={{ required: t("financials.messages.invoiceNameRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("financials.form.invoiceName")}
                      placeholder="e.g., March_2024_Services"
                      error={!!errors.invoiceName}
                      helperText={errors.invoiceName?.message}
                      sx={modalCard?.inputSection}
                    />
                  )}
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={ocrLoading}
                  sx={{ ...outlinedIconButton, height: "auto", width: "52%" }}
                  startIcon={ocrLoading ? <CircularProgress size={20} /> : null}
                >
                  {ocrLoading
                    ? t("financials.messages.processingFile")
                    : watchedFile
                    ? watchedFile.name
                    : t("financials.form.chooseFile")}
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleFileSelect}
                    disabled={ocrLoading}
                  />
                </Button>
              </Box>

              <Box sx={modalCard?.boxModalStyle?.boxUploadInvoiceModal}>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: t("financials.messages.amountGreaterThanZero"),
                    min: {
                      value: 0.01,
                      message: t("financials.messages.amountGreaterThanZero"),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("financials.form.amount")}
                      type="number"
                      inputProps={{ step: 0.01, min: 0 }}
                      placeholder="$0.00"
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      sx={modalCard?.inputSection}
                    />
                  )}
                />
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        sx={modalCard?.multiOptionFilter?.inputLabelSection}
                      >
                        {t("financials.form.currency")}
                      </InputLabel>
                      <Select
                        {...field}
                        sx={{
                          ...modalCard?.multiOptionFilter?.selectSection,
                          height: "3rem",
                        }}
                        label={t("financials.form.currency")}
                      >
                        <MenuItem value="USD">
                          {t("financials.form.currencies.usd")}
                        </MenuItem>
                        <MenuItem value="EUR">
                          {t("financials.form.currencies.eur")}
                        </MenuItem>
                        <MenuItem value="GBP">
                          {t("financials.form.currencies.gbp")}
                        </MenuItem>
                        <MenuItem value="MXN">
                          {t("financials.form.currencies.mxn")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={modalCard?.boxModalStyle?.boxUploadInvoiceModal}>
                <Controller
                  name="issuedDate"
                  control={control}
                  rules={{ required: t("financials.messages.issuedDateRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("financials.form.issuedDate")}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.issuedDate}
                      helperText={errors.issuedDate?.message}
                      sx={modalCard?.inputSection}
                    />
                  )}
                />
                <Controller
                  name="dueDate"
                  control={control}
                  rules={{ required: t("financials.messages.dueDateRequired") }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("financials.form.dueDate")}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dueDate}
                      helperText={errors.dueDate?.message}
                      sx={modalCard?.inputSection}
                    />
                  )}
                />
              </Box>

              <Box sx={modalCard?.boxModalStyle?.boxUploadInvoiceModal}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        sx={modalCard?.multiOptionFilter?.inputLabelSection}
                      >
                        {t("financials.form.status")}
                      </InputLabel>
                      <Select
                        {...field}
                        sx={{
                          ...modalCard?.multiOptionFilter?.selectSection,
                          height: "3rem",
                        }}
                        label={t("financials.form.status")}
                      >
                        <MenuItem value="draft">
                          {t("financials.form.statuses.draft")}
                        </MenuItem>
                        <MenuItem value="sent">
                          {t("financials.form.statuses.sent")}
                        </MenuItem>
                        <MenuItem value="viewed">
                          {t("financials.form.statuses.viewed")}
                        </MenuItem>
                        <MenuItem value="paid">
                          {t("financials.form.statuses.paid")}
                        </MenuItem>
                        <MenuItem value="overdue">
                          {t("financials.form.statuses.overdue")}
                        </MenuItem>
                        <MenuItem value="cancelled">
                          {t("financials.form.statuses.cancelled")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        sx={modalCard?.multiOptionFilter?.inputLabelSection}
                      >
                        {t("financials.form.paymentMethodOptional")}
                      </InputLabel>
                      <Select
                        {...field}
                        sx={{
                          ...modalCard?.multiOptionFilter?.selectSection,
                          height: "3rem",
                        }}
                        label={t("financials.form.paymentMethodOptional")}
                      >
                        <MenuItem value="">
                          {t("financials.form.paymentMethods.notSet")}
                        </MenuItem>
                        <MenuItem value="credit_card">
                          {t("financials.form.paymentMethods.creditCard")}
                        </MenuItem>
                        <MenuItem value="bank_transfer">
                          {t("financials.form.paymentMethods.bankTransfer")}
                        </MenuItem>
                        <MenuItem value="check">
                          {t("financials.form.paymentMethods.check")}
                        </MenuItem>
                        <MenuItem value="cash">
                          {t("financials.form.paymentMethods.cash")}
                        </MenuItem>
                        <MenuItem value="other">
                          {t("financials.form.paymentMethods.other")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  margin: "0 0 1rem 0",
                }}
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("financials.form.descriptionOptional")}
                      multiline
                      rows={3}
                      placeholder={t("financials.form.descriptionPlaceholder")}
                      sx={modalCard?.inputDescriptionSection}
                    />
                  )}
                />
                <Controller
                  name="paymentLink"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("financials.form.paymentLinkOptional")}
                      type="url"
                      placeholder="https://example.com/payment/invoice-123"
                      helperText={t("financials.form.paymentLinkHelper")}
                      sx={modalCard?.inputSection}
                    />
                  )}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              margin: "0 0 1rem 0",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={uploading || ocrLoading || !isValid}
              sx={primaryIconButton}
            >
              {uploading
                ? t("common.uploading")
                : t("financials.uploadInvoice")}
            </Button>
            <Button
              onClick={handleCancelModal}
              sx={outlinedButton}
              disabled={ocrLoading}
            >
              {t("common.cancel")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UploadInvoiceButton;
