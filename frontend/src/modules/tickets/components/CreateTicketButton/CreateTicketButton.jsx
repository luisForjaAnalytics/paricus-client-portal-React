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
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import {
  primaryIconButton,
  outlinedButton,
  modalCard,
  titlesTypography,
} from "../../../../common/styles/styles";

export const CreateTickeButton = ({}) => {
  const { t } = useTranslation();
  const [showUploadModal, setShowUploadModal] = useState(false);

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
      subject: "",
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
  const handleCancelModal = () => {
    // Cerrar el modal
    setShowUploadModal(false);
  };

  const onSubmit = async (data) => {
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

      handleCancelModal();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setShowUploadModal(true)}
        sx={primaryIconButton}
      >
        {t("tickets.createNewTicket.createNewTicket")}
      </Button>

      <Dialog
        open={showUploadModal}
        onClose={() => handleCancelModal()}
        fullWidth
        slotProps={{
          paper: {
            sx: modalCard?.createNewTiketStyle?.dialogTicketSection,
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
              {t("tickets.createNewTicket.createNewTicket")}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Box
              container
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={modalCard?.createNewTiketStyle?.boxTicketModal}>
                <Controller
                  name="subject"
                  control={control}
                  rules={{
                    required: t("tickets.createNewTicket.subject.requiredMsg"),
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("tickets.createNewTicket.subject.label")}
                      placeholder={t(
                        "tickets.createNewTicket.subject.placeholderMsg"
                      )}
                      error={!!errors.invoiceName}
                      helperText={errors.subject?.message}
                      sx={{ ...modalCard?.inputSection, width:'100%' }}
                    />
                  )}
                />
              </Box>

              <Box sx={modalCard?.createNewTiketStyle?.boxTicketModal}>
                <Controller
                  name="priority"
                  control={control}
                  rules={{
                    required: t("tickets.createNewTicket.priority.requiredMsg"),
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        sx={modalCard?.multiOptionFilter?.inputLabelSection}
                      >
                        {t("tickets.createNewTicket.priority.label")}
                      </InputLabel>
                      <Select
                        {...field}
                        sx={{
                          ...modalCard?.multiOptionFilter?.selectSection,
                          height: "3rem",
                        }}
                        label={t("tickets.createNewTicket.priority.label")}
                      >
                        <MenuItem value="Hight">
                          {t("tickets.createNewTicket.priority.level.hight")}
                        </MenuItem>
                        <MenuItem value="Medium">
                          {t("tickets.createNewTicket.priority.level.medium")}
                        </MenuItem>
                        <MenuItem value="Low">
                          {t("tickets.createNewTicket.priority.level.low")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="assignedTo"
                  control={control}
                  rules={{
                    required: t("tickets.createNewTicket.assignedTo.requiredMsg"),
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        sx={modalCard?.multiOptionFilter?.inputLabelSection}
                      >
                         {t("tickets.createNewTicket.assignedTo.label")}
                      </InputLabel>
                      <Select
                        {...field}
                        sx={{
                          ...modalCard?.multiOptionFilter?.selectSection,
                          height: "3rem",
                        }}
                        label= {t("tickets.createNewTicket.assignedTo.label")}
                      >
                        <MenuItem value="User 1">User 1</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Client Admin">Client Admin</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={modalCard?.createNewTiketStyle?.boxTicketModal}>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: t(
                      "tickets.createNewTicket.description.requiredMsg"
                    ),
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("tickets.createNewTicket.description.label")}
                      multiline
                      rows={3}
                      placeholder={t(
                        "tickets.createNewTicket.description.placeholderMsg"
                      )}
                      sx={
                        modalCard?.createNewTiketStyle?.inputDescriptionSection
                      }
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
            <Button type="submit" variant="contained" sx={primaryIconButton}>
              {t("tickets.createNewTicket.submit")}
            </Button>
            <Button onClick={handleCancelModal} sx={outlinedButton}>
              {t("common.cancel")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
