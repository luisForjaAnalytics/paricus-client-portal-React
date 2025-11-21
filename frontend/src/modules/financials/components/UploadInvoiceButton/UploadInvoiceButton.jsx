import { useState, useEffect } from "react";
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
  uploadInvoiceModalStyle,
  typography,
  colors,
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

  // Estilos comunes para TextField


  const [uploadForm, setUploadForm] = useState({
    invoiceName: "",
    description: "",
    amount: 0,
    currency: "USD",
    status: "sent",
    dueDate: "",
    issuedDate: "",
    paymentMethod: "",
    paymentLink: "",
    file: null,
  });

  // Procesar el texto OCR cuando esté disponible
  useEffect(() => {
    if (text && !ocrLoading) {
      const extractedData = parseInvoiceData(text);

      // Actualizar el formulario solo con los campos que se encontraron
      setUploadForm((prev) => ({
        ...prev,
        invoiceName: extractedData.invoiceName || prev.invoiceName,
        amount: extractedData.amount > 0 ? extractedData.amount : prev.amount,
        issuedDate: extractedData.issuedDate || prev.issuedDate,
        dueDate: extractedData.dueDate || prev.dueDate,
        description: extractedData.description || prev.description,
      }));
    }
  }, [text, ocrLoading]);

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
        setUploadForm((prev) => ({ ...prev, file }));
        // Ejecutar OCR en el archivo PDF
        await runOcr(file);
      }
    } catch (err) {
      console.warn(`ERROR: ${err}`);
      onError("Error processing PDF file");
    }
  };

  const handleCancelModal = () => {
    // Resetear el formulario al estado inicial
    setUploadForm({
      invoiceName: "",
      description: "",
      amount: 0,
      currency: "USD",
      status: "sent",
      dueDate: "",
      issuedDate: "",
      paymentMethod: "",
      paymentLink: "",
      file: null,
    });
    // Limpiar el estado del OCR
    resetOcr();
    // Cerrar el modal
    setShowUploadModal(false);
  };

  const handleUploadInvoice = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !selectedFolder) return;

    if (!uploadForm.invoiceName) {
      onError(t("financials.messages.invoiceNameRequired"));
      return;
    }
    if (!uploadForm.amount || uploadForm.amount <= 0) {
      onError(t("financials.messages.amountGreaterThanZero"));
      return;
    }
    if (!uploadForm.dueDate) {
      onError(t("financials.messages.dueDateRequired"));
      return;
    }
    if (!uploadForm.issuedDate) {
      onError(t("financials.messages.issuedDateRequired"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("invoiceName", uploadForm.invoiceName);
      formData.append("amount", uploadForm.amount.toString());
      formData.append("currency", uploadForm.currency);
      formData.append("status", uploadForm.status);
      formData.append("dueDate", uploadForm.dueDate);
      formData.append("issuedDate", uploadForm.issuedDate);

      if (uploadForm.description) {
        formData.append("description", uploadForm.description);
      }
      if (uploadForm.paymentMethod) {
        formData.append("paymentMethod", uploadForm.paymentMethod);
      }
      if (uploadForm.paymentLink) {
        formData.append("paymentLink", uploadForm.paymentLink);
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "1.5rem",
          },
        }}
      >
        <form onSubmit={handleUploadInvoice}>
          <DialogTitle>
            <Typography
              variant="h5"
              sx={{
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily,
                marginTop:'1rem'
              }}
            >
              {t("financials.uploadNewInvoice")}
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              paddingBottom: "0rem",
            }}
          >
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
              <Box sx={uploadInvoiceModalStyle.boxUploadInvoiceModal}>
                <TextField
                  fullWidth
                  label={t("financials.form.invoiceName")}
                  value={uploadForm.invoiceName}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      invoiceName: e.target.value,
                    }))
                  }
                  placeholder="e.g., March_2024_Services"
                  required
                  sx={uploadInvoiceModalStyle.textFielUploadInvoiceModal}
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={ocrLoading}
                  sx={{ ...outlinedIconButton, height: "56px", width: "40%" }}
                  startIcon={ocrLoading ? <CircularProgress size={20} /> : null}
                >
                  {ocrLoading
                    ? t("financials.messages.processingFile")
                    : uploadForm.file
                    ? uploadForm.file.name
                    : t("financials.form.chooseFileRequired")}
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleFileSelect}
                    required
                    disabled={ocrLoading}
                  />
                </Button>
              </Box>

              <Box sx={uploadInvoiceModalStyle.boxUploadInvoiceModal}>
                <TextField
                  fullWidth
                  label={t("financials.form.amount")}
                  type="number"
                  inputProps={{ step: 0.01, min: 0 }}
                  value={uploadForm.amount}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value),
                    }))
                  }
                  placeholder="0.00"
                  required
                  sx={uploadInvoiceModalStyle.textFielUploadInvoiceModal}
                />
                <FormControl fullWidth>
                  <InputLabel>{t("financials.form.currency")}</InputLabel>
                  <Select
                    value={uploadForm.currency}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
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
                <TextField
                  fullWidth
                  label={t("financials.form.issuedDate")}
                  type="date"
                  value={uploadForm.issuedDate}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      issuedDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={uploadInvoiceModalStyle.textFielUploadInvoiceModal}
                />
                <TextField
                  fullWidth
                  label={t("financials.form.dueDate")}
                  type="date"
                  value={uploadForm.dueDate}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={uploadInvoiceModalStyle.textFielUploadInvoiceModal}
                />
              </Box>

              <Box sx={uploadInvoiceModalStyle.boxUploadInvoiceModal}>
                <FormControl fullWidth>
                  <InputLabel>{t("financials.form.status")}</InputLabel>
                  <Select
                    value={uploadForm.status}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
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
                <FormControl fullWidth>
                  <InputLabel>
                    {t("financials.form.paymentMethodOptional")}
                  </InputLabel>
                  <Select
                    value={uploadForm.paymentMethod}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  margin: "0 0 1rem 0",
                }}
              >
                <TextField
                  fullWidth
                  label={t("financials.form.descriptionOptional")}
                  multiline
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={t("financials.form.descriptionPlaceholder")}
                  sx={uploadInvoiceModalStyle.textFielUploadInvoiceModal}
                />
                <TextField
                  fullWidth
                  label={t("financials.form.paymentLinkOptional")}
                  type="url"
                  value={uploadForm.paymentLink}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      paymentLink: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/payment/invoice-123"
                  helperText={t("financials.form.paymentLinkHelper")}
                  sx={uploadInvoiceModalStyle.textFielUploadInvoiceModal}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              margin: "0 0 1rem 0",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={uploading || !uploadForm.file || ocrLoading}
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
