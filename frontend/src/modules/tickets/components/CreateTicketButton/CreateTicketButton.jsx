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
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import {
  primaryIconButton,
  outlinedButton,
  modalCard,
  titlesTypography,
  selectMenuProps,
} from "../../../../common/styles/styles";
import {
  useCreateTicketMutation,
  useUploadTicketAttachmentMutation,
  useGetAssignableUsersQuery,
} from "../../../../store/api/ticketsApi";
import { TiptapEditor } from "../../../../common/components/ui/TiptapEditor";
import "../../../../common/components/ui/TiptapEditor/tiptap-editor.css";
import {
  getPriorityStyles,
  priorityStatesList,
} from "../../../../common/utils/getStatusProperty";

export const CreateTickeButton = ({}) => {
  const { t } = useTranslation();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [createTicket, { isLoading, error }] = useCreateTicketMutation();
  const [uploadAttachment] = useUploadTicketAttachmentMutation();
  const { data: assignableUsers = [], isLoading: loadingUsers } =
    useGetAssignableUsersQuery();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_CHARACTERS = 500;

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      priority: "",
      assignedTo: "",
      url: "",
      description: {
        descriptionData: "",
        textLength: 0,
      },
    },
  });

  const watchedTextLength = watch("description.textLength");
  const isOverLimit = watchedTextLength > MAX_CHARACTERS;

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    // Reset the input so the same file can be selected again if needed
    event.target.value = "";
  };

  // Remove file from selection
  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Clear all files
  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const handleCancelModal = () => {
    reset();
    clearFiles();
    setShowUploadModal(false);
  };

  // Custom attachment button for the editor toolbar
  const attachmentButton = (
    <Tooltip title={t("tickets.ticketView.attachFile")} arrow placement="top">
      <span>
        <IconButton
          component="label"
          size="small"
          disabled={isUploading || isLoading}
          sx={{
            padding: "4px",
            backgroundColor: "transparent",
            color: "rgba(0, 0, 0, 0.54)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "&:disabled": {
              color: "rgba(0, 0, 0, 0.26)",
            },
            minWidth: "28px",
            minHeight: "28px",
          }}
        >
          {isUploading ? (
            <CircularProgress size={20} />
          ) : (
            <AttachFileIcon fontSize="small" />
          )}
          <input
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleFileSelect}
            multiple
          />
        </IconButton>
      </span>
    </Tooltip>
  );

  const onSubmit = async (data) => {
    try {
      // Prepare the payload for the backend
      const payload = {
        subject: data.subject,
        priority: data.priority,
        assignedToId: data.assignedTo, // Backend expects 'assignedToId'
        description: data.description.descriptionData,
        url: data.url || null,
      };

      // 1. Create the ticket
      const result = await createTicket(payload).unwrap();

      // 2. Upload attachments if any
      if (selectedFiles.length > 0 && result?.id) {
        setIsUploading(true);
        try {
          // Upload each file sequentially
          for (const file of selectedFiles) {
            await uploadAttachment({
              ticketId: result.id,
              file: file,
            }).unwrap();
          }
        } catch (uploadError) {
          console.error("❌ Error uploading attachments:", uploadError);
          // Don't fail the whole operation if attachments fail
          // The ticket was already created successfully
        } finally {
          setIsUploading(false);
        }
      }

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
            sx: {
              ...modalCard?.createNewTiketStyle?.dialogTicketSection,
              width: "60vh",
            },
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
                        MenuProps={selectMenuProps}
                        sx={{
                          ...modalCard?.multiOptionFilter?.selectSection,
                          height: "3rem",
                        }}
                        label={t("tickets.createNewTicket.priority.label")}
                      >
                        {priorityStatesList.map((item, index) => (
                          <MenuItem key={index} value={item.toLowerCase()}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  marginLeft:'1rem',
                                   marginRight:'0.4rem',
                                  backgroundColor:
                                    getPriorityStyles(item.toLowerCase()).color,
                                }}
                              />
                              <Typography >
                                {t(`priorityLevels.${item.toLowerCase()}`)}
                              </Typography>
                            </Box>
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
                    <FormControl fullWidth error={!!errors.assignedTo}>
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
                        disabled={loadingUsers}
                      >
                        {assignableUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.fullName} ({user.roleName})
                            {user.clientName && ` - ${user.clientName}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.assignedTo && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.assignedTo.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("tickets.createNewTicket.url")}
                    type="url"
                    // placeholder="https://example.com/ticket-123"
                    helperText="https://example.com/ticket-123"
                    sx={modalCard?.inputSection}
                  />
                )}
              />
              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                    //mb: 1,
                    px: 2,
                  }}
                >
                  {selectedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index)}
                      deleteIcon={<CloseIcon />}
                      icon={<AttachFileIcon />}
                      size="small"
                    />
                  ))}
                </Box>
              )}

              <Box
                sx={{
                  ...modalCard?.createNewTiketStyle?.boxTicketModal,
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                <Controller
                  name="description.descriptionData"
                  control={control}
                  rules={{
                    required: t(
                      "tickets.createNewTicket.description.requiredMsg"
                    ),
                  }}
                  render={({ field }) => (
                    <TiptapEditor
                      value={field.value}
                      onChange={(html, textLength) => {
                        field.onChange(html);
                        setValue("description.textLength", textLength);
                      }}
                      placeholder={t(
                        "tickets.createNewTicket.description.placeholderMsg"
                      )}
                      error={
                        isOverLimit || !!errors.description?.descriptionData
                      }
                      helperText={
                        errors.description?.descriptionData?.message ||
                        (isOverLimit
                          ? t(
                              "tickets.createNewTicket.description.maxCharactersError",
                              {
                                max: MAX_CHARACTERS,
                              }
                            )
                          : "")
                      }
                      maxCharacters={MAX_CHARACTERS}
                      fullWidth
                      customLeftButtons={[attachmentButton]}
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
              disabled={isLoading || isUploading || isOverLimit}
            >
              {isLoading || isUploading
                ? t("common.loading") || "Loading..."
                : t("tickets.createNewTicket.submit")}
            </Button>
            <Button
              onClick={handleCancelModal}
              sx={outlinedButton}
              disabled={isLoading || isUploading}
            >
              {t("common.cancel")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
