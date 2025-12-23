import { useState } from "react";
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
  Typography,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import {
  primaryIconButton,
  outlinedButton,
  modalCard,
  titlesTypography,
} from "../../../../common/styles/styles";
import { useCreateTicketMutation } from "../../../../store/api/ticketsApi";
import { PRIORITY_STATUS } from "./ticketStatus-js";
import { useSelector } from "react-redux";

export const CreateTickeButton = ({}) => {
  const { t } = useTranslation();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [createTicket, { isLoading, error }] = useCreateTicketMutation();

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      priority: "",
      assignedTo: "",
      description: {
        descriptionData: "",
      },
    },
  });

  const handleCancelModal = () => {
    reset();
    setShowUploadModal(false);
  };

  const onSubmit = async (data) => {
    try {
      // Prepare the payload for the backend
      const payload = {
        subject: data.subject,
        priority: data.priority,
        assignedTo: data.assignedTo,
        description: data.description.descriptionData,
      };

      // Call the mutation
      await createTicket(payload).unwrap();

      // Success - reset form and close modal
      reset();
      handleCancelModal();
    } catch (err) {
      console.error("Error creating ticket:", err);
      // Error is handled by RTK Query and available in the `error` variable
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
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error?.data?.error || "Error creating ticket"}
              </Alert>
            )}
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
                      sx={{ ...modalCard?.inputSection, width: "100%" }}
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
                        {Object.values(PRIORITY_STATUS).map((item, index) => (
                          <MenuItem key={index} value={item} >
                            {t(
                              `tickets.createNewTicket.priority.level.${item.toLowerCase()}`
                            )}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="assignedTo"
                  control={control}
                  rules={{
                    required: t(
                      "tickets.createNewTicket.assignedTo.requiredMsg"
                    ),
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
                        label={t("tickets.createNewTicket.assignedTo.label")}
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
                  name="description.descriptionData"
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
            <Button
              type="submit"
              variant="contained"
              sx={primaryIconButton}
              disabled={isLoading}
            >
              {isLoading
                ? t("common.loading") || "Loading..."
                : t("tickets.createNewTicket.submit")}
            </Button>
            <Button
              onClick={handleCancelModal}
              sx={outlinedButton}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
