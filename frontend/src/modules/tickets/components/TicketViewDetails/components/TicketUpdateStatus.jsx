import { useState, useContext } from "react";
import { Box, Button, IconButton, CircularProgress, Tooltip, Alert, Snackbar, Chip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ticketStyle } from "../../../../../common/styles/styles";
import { useAddTicketDetailMutation, useUpdateTicketMutation } from "../../../../../store/api/ticketsApi";
import { TiptapEditor } from "../../../../../common/components/ui/TiptapEditor";
import { useTicketDetailAttachments } from "../../../../../common/hooks/useTicketDetailAttachments";
import { TicketPriorityContext, TicketStatusContext } from "../TicketViewDetails";
import "../../../../../common/components/ui/TiptapEditor/tiptap-editor.css";

export const TicketUpdateStatus = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const [description, setDescription] = useState("");
  const [textLength, setTextLength] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const { pendingPriority, clearPendingPriority } = useContext(TicketPriorityContext);
  const { pendingStatus, clearPendingStatus } = useContext(TicketStatusContext);

  const [addDetail, { isLoading }] = useAddTicketDetailMutation();
  const [updateTicket] = useUpdateTicketMutation();

  // Use ticket detail attachments hook
  const {
    selectedFiles,
    isUploading,
    handleFileSelect,
    uploadAllFiles,
    removeFile,
    clearFiles,
  } = useTicketDetailAttachments(ticketId, null);

  const MAX_CHARACTERS = 500;
  const isOverLimit = textLength > MAX_CHARACTERS;

  const handleUpdate = async () => {
    // Allow update if there's either a description, pending priority, or pending status change
    if ((!description.trim() && !pendingPriority && !pendingStatus) || isOverLimit) return;

    // Clear previous error
    setError(null);

    try {
      // 1. Update priority and/or status if there are pending changes
      const updateData = {};

      if (pendingPriority) {
        console.log('🎯 Updating priority to:', pendingPriority);
        updateData.priority = pendingPriority;
      }

      if (pendingStatus) {
        console.log('🎯 Updating status to:', pendingStatus);
        updateData.status = pendingStatus;
      }

      if (Object.keys(updateData).length > 0) {
        await updateTicket({
          id: ticketId,
          ...updateData,
        }).unwrap();

        if (pendingPriority) {
          clearPendingPriority();
          console.log('✅ Priority updated successfully');
        }

        if (pendingStatus) {
          clearPendingStatus();
          console.log('✅ Status updated successfully');
        }
      }

      // 2. Create the detail (only if there's a description)
      let result = null;
      if (description.trim()) {
        console.log('📝 Creating detail for ticketId:', ticketId);
        result = await addDetail({
          id: ticketId,
          detail: description,
        }).unwrap();
        console.log('✅ Detail created successfully:', result);
      }

      // 3. Upload attachments if any
      if (selectedFiles.length > 0 && result?.details) {
        // Get the newly created detail (last one in the array)
        const newDetail = result.details[result.details.length - 1];
        console.log('🎯 New detail to attach files to:', { detailId: newDetail.id, filesCount: selectedFiles.length });

        try {
          await uploadAllFiles(newDetail.id);
        } catch (uploadError) {
          console.error("Error uploading attachments:", uploadError);
          setError("Update created but failed to upload some attachments");
          return;
        }
      }

      // Show success message
      setSuccessMessage(true);

      // Clear form
      setDescription("");
      setTextLength(0);
      clearFiles();

      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate("/app/tickets/ticketTable");
      }, 1000);
    } catch (err) {
      console.error("Failed to add detail:", err);
      console.error("Error details:", {
        status: err?.status,
        data: err?.data,
        message: err?.message,
        originalStatus: err?.originalStatus,
      });

      // Set user-friendly error message
      let errorMessage = "Failed to update ticket. Please try again.";

      if (err?.status === 400) {
        errorMessage = err?.data?.error || "Invalid request. Please check your input.";
      } else if (err?.status === 404) {
        errorMessage = "Ticket not found. It may have been deleted.";
      } else if (err?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setDescription("");
    setTextLength(0);
    setError(null);
    clearFiles();
    clearPendingPriority(); // Clear pending priority change
    clearPendingStatus(); // Clear pending status change
  };

  // Custom attachment button for the editor toolbar
  const attachmentButton = (
    <Tooltip title={t("tickets.ticketView.attachFile")} arrow placement="top">
      <span>
        <IconButton
          component="label"
          size="small"
          disabled={isUploading}
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
          />
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //gap: 1,
        height: "120%",
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: 1,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#555",
          },
        },
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(false)}>
          {t("tickets.ticketView.updateSuccess") || "Update added successfully!"}
        </Alert>
      </Snackbar>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

      <TiptapEditor
        value={description}
        onChange={(html, length) => {
          setDescription(html);
          setTextLength(length);
        }}
        placeholder={t("tickets.createNewTicket.description.placeholderMsg")}
        error={isOverLimit}
        helperText={
          isOverLimit
            ? t("tickets.ticketView.maxCharactersError", {
                max: MAX_CHARACTERS,
              })
            : ""
        }
        maxCharacters={MAX_CHARACTERS}
        fullWidth
        customLeftButtons={[attachmentButton]}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Button
          type="button"
          variant="contained"
          disabled={isLoading || (!description.trim() && !pendingPriority && !pendingStatus) || isOverLimit}
          onClick={handleUpdate}
          sx={ticketStyle.updateButton}
        >
          {t("common.update")}
        </Button>
        <Button
          onClick={handleCancel}
          sx={ticketStyle.cancelButton}
          disabled={isLoading}
        >
          {t("common.cancel")}
        </Button>
      </Box>
    </Box>
  );
};
