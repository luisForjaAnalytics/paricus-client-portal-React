import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  useUploadTicketAttachmentMutation,
  useDeleteTicketAttachmentMutation,
  useLazyGetAttachmentUrlQuery,
} from "../../../../../store/api/ticketsApi";

export const TicketAttachments = ({ ticket }) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadTicketAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteTicketAttachmentMutation();
  const [getAttachmentUrl] = useLazyGetAttachmentUrlQuery();

  const attachments = ticket?.attachments || [];

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    try {
      await uploadAttachment({
        ticketId: ticket.id,
        file,
      }).unwrap();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }

    // Reset input
    event.target.value = "";
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteAttachment({
        ticketId: ticket.id,
        attachmentId,
      }).unwrap();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleImageClick = async (attachment) => {
    try {
      const url = await getAttachmentUrl({
        ticketId: ticket.id,
        attachmentId: attachment.id,
      }).unwrap();

      setImageUrl(url);
      setSelectedImage(attachment);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error loading image:", error);
      alert("Failed to load image");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
    setImageUrl(null);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ImageIcon />
          Attachments ({attachments.length})
        </Typography>

        <Button
          variant="contained"
          component="label"
          size="small"
          startIcon={isUploading ? <CircularProgress size={16} /> : <UploadIcon />}
          disabled={isUploading}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
          />
        </Button>
      </Box>

      {attachments.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No attachments yet. Upload an image to get started.
        </Alert>
      ) : (
        <ImageList
          sx={{ width: "100%", maxHeight: 400 }}
          cols={3}
          rowHeight={180}
          gap={8}
        >
          {attachments.map((attachment) => (
            <ImageListItem
              key={attachment.id}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
                onClick={() => handleImageClick(attachment)}
              >
                <ImageIcon sx={{ fontSize: 60, color: "#999" }} />
              </Box>
              <ImageListItemBar
                title={attachment.fileName}
                subtitle={`${(attachment.fileSize / 1024).toFixed(1)} KB`}
                actionIcon={
                  <IconButton
                    sx={{ color: "white" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(attachment.id);
                    }}
                    disabled={isDeleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogActions sx={{ p: 1 }}>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ p: 0 }}>
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt={selectedImage?.fileName}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
