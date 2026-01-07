import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as WordIcon,
  TableChart as ExcelIcon,
  Slideshow as PowerPointIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { useTicketAttachments } from "../../../../../common/hooks/useTicketAttachments";
import { useLazyGetAttachmentUrlQuery } from "../../../../../store/api/ticketsApi";

// Helper function to get file icon based on mime type
const getFileIcon = (mimeType) => {
  try {
    // Handle image files
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon sx={{ fontSize: 60, color: "#999" }} />;
    }

    // Handle other file types with switch
    switch (mimeType) {
      case 'application/pdf':
        return <PdfIcon sx={{ fontSize: 60, color: "#D32F2F" }} />;

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <WordIcon sx={{ fontSize: 60, color: "#2B579A" }} />;

      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <ExcelIcon sx={{ fontSize: 60, color: "#217346" }} />;

      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return <PowerPointIcon sx={{ fontSize: 60, color: "#D24726" }} />;

      default:
        return <FileIcon sx={{ fontSize: 60, color: "#999" }} />;
    }
  } catch (error) {
    console.error('Error getting file icon:', error);
    return <FileIcon sx={{ fontSize: 60, color: "#999" }} />;
  }
};

// Helper function to check if file is an image
const isImageFile = (mimeType) => {
  try {
    return mimeType?.startsWith('image/') || false;
  } catch (error) {
    console.error('Error checking if file is image:', error);
    return false;
  }
};

const AttachmentThumbnail = ({ attachment, ticketId }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [getUrl] = useLazyGetAttachmentUrlQuery();

  // Check if this is an image file
  const isImage = isImageFile(attachment.mimeType);

  useEffect(() => {
    // Only load URL for images
    if (!isImage) {
      setLoading(false);
      return;
    }

    const loadThumbnail = async () => {
      try {
        const response = await getUrl({
          ticketId,
          attachmentId: attachment.id,
        }).unwrap();

        const url = typeof response === 'string' ? response : response.url;
        setThumbnailUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Error loading thumbnail:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [attachment.id, ticketId, getUrl, isImage]);

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={180}
        sx={{ borderRadius: 1 }}
      />
    );
  }

  // For non-image files, show icon
  if (!isImage) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        {getFileIcon(attachment.mimeType)}
      </Box>
    );
  }

  // For images with errors or no URL
  if (error || !thumbnailUrl) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        <ImageIcon sx={{ fontSize: 60, color: "#999" }} />
      </Box>
    );
  }

  // For images with URL, show the image
  return (
    <Box
      component="img"
      src={thumbnailUrl}
      alt={attachment.fileName}
      sx={{
        width: "100%",
        height: 180,
        objectFit: "cover",
        borderRadius: 1,
      }}
      onError={() => setError(true)}
    />
  );
};

export const TicketAttachments = ({ ticket }) => {
  const {
    isDeleting,
    selectedImage,
    imageUrl,
    openDialog,
    handleDelete,
    handleImageClick,
    handleCloseDialog,
  } = useTicketAttachments(ticket?.id, ticket?.attachments || []);

  const attachments = ticket?.attachments || [];

  // Handle click - open preview for images, download for other files
  const handleAttachmentClick = async (attachment) => {
    try {
      if (!attachment || !ticket) {
        console.error('Missing attachment or ticket data');
        return;
      }

      if (isImageFile(attachment.mimeType)) {
        // For images, open preview dialog
        handleImageClick(attachment);
      } else {
        // For non-images (PDFs, Office docs), download the file
        const url = attachment.url || `/api/tickets/${ticket.id}/attachments/${attachment.id}/file`;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error handling attachment click:', error);
      alert('Failed to open file. Please try again.');
    }
  };

  return (
    <>
      {attachments.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No attachments yet. Upload a file to get started.
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
              onClick={() => handleAttachmentClick(attachment)}
            >
              <AttachmentThumbnail
                attachment={attachment}
                ticketId={ticket.id}
              />
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
    </>
  );
};
