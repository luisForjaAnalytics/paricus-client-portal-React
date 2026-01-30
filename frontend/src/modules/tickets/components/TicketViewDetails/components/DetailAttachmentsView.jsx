import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardActionArea,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { AlertInline } from "../../../../../common/components/ui/AlertInline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as WordIcon,
  TableChart as ExcelIcon,
  Slideshow as PowerPointIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import { useTicketDetailAttachments } from "../../../../../common/hooks/useTicketDetailAttachments";
import { TicketText } from "../../../../../common/components/ui/TicketText";

// Helper function to check if file is an image
const isImageFile = (mimeType) => {
  try {
    return mimeType?.startsWith('image/') || false;
  } catch (error) {
    console.error('Error checking if file is image:', error);
    return false;
  }
};

// Helper function to get file icon based on mime type
const getFileIcon = (mimeType, size = "medium") => {
  try {
    const iconSize = size === "small" ? 40 : 60;

    if (mimeType?.startsWith('image/')) {
      return <ImageIcon sx={{ fontSize: iconSize, color: "#999" }} />;
    }

    switch (mimeType) {
      case 'application/pdf':
        return <PdfIcon sx={{ fontSize: iconSize, color: "#D32F2F" }} />;

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <WordIcon sx={{ fontSize: iconSize, color: "#2B579A" }} />;

      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <ExcelIcon sx={{ fontSize: iconSize, color: "#217346" }} />;

      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return <PowerPointIcon sx={{ fontSize: iconSize, color: "#D24726" }} />;

      default:
        return <FileIcon sx={{ fontSize: iconSize, color: "#999" }} />;
    }
  } catch (error) {
    console.error('Error getting file icon:', error);
    return <FileIcon sx={{ fontSize: iconSize, color: "#999" }} />;
  }
};

export const DetailAttachmentsView = ({ ticketId, detail }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const { handleDelete, isDeleting } = useTicketDetailAttachments(
    ticketId,
    detail.id
  );

  const attachments = detail?.attachments || [];

  // Helper function to build file URL with token
  const getFileUrl = (attachment) => {
    try {
      if (!attachment?.url || !token) return null;

      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      const fullUrl = `${baseUrl}${attachment.url}`;

      // Add token as query parameter for authentication
      return `${fullUrl}?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error('Error building file URL:', error);
      return null;
    }
  };

  const handleAttachmentClick = (attachment) => {
    try {
      if (!attachment) {
        console.error('Missing attachment data');
        return;
      }

      // For images, show preview dialog
      if (isImageFile(attachment.mimeType)) {
        setSelectedImage(attachment);
      } else {
        // For non-images (PDFs, Office docs), download the file
        const url = getFileUrl(attachment);
        if (url) {
          window.open(url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error handling attachment click:', error);
      alert('Failed to open file. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  const handleImageError = (attachmentId) => {
    console.error(`Failed to load detail attachment image ${attachmentId}`);
    setImageErrors(prev => ({ ...prev, [attachmentId]: true }));
  };

  const handleImageLoad = (attachmentId) => {
    // Clear error state if image loads successfully
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[attachmentId];
      return newErrors;
    });
  };

  if (attachments?.length === 0) return null;

  return (
    <>
      <Box mt={1} display="flex" flexDirection="row" gap={2} flexWrap="wrap">
        {attachments.map((attachment) => {
          const fileUrl = getFileUrl(attachment);
          const hasError = imageErrors[attachment.id];
          const isImage = isImageFile(attachment.mimeType);

          return (
            <Card
              key={attachment.id}
              sx={{
                width: 80,
                position: "relative",
                "&:hover .delete-button": {
                  opacity: 1,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleAttachmentClick(attachment)}
                disabled={isDeleting}
              >
                {isImage && fileUrl && !hasError ? (
                  <CardMedia
                    component="img"
                    height="80"
                    image={fileUrl}
                    alt={attachment.fileName}
                    sx={{
                      objectFit: "cover",
                    }}
                    onError={() => handleImageError(attachment.id)}
                    onLoad={() => handleImageLoad(attachment.id)}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 80,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isImage ? "action.hover" : "#f5f5f5",
                      gap: 0.3,
                    }}
                  >
                    {hasError ? (
                      <>
                        <ErrorOutlineIcon fontSize="small" color="error" />
                        <TicketText
                          sx={{
                            fontSize: "0.5rem",
                            textAlign: "center",
                            px: 0.3,
                          }}
                        >
                          {t("tickets.ticketView.imageLoadError")}
                        </TicketText>
                      </>
                    ) : (
                      <>
                        {getFileIcon(attachment.mimeType, "small")}
                        <Typography
                          sx={{
                            fontSize: "0.5rem",
                            textAlign: "center",
                            px: 0.3,
                            mt: 0.3,
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {attachment.fileName?.split('.').pop()?.toUpperCase()}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </CardActionArea>

              {/* Delete button overlay */}
              <IconButton
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(attachment.id);
                }}
                disabled={isDeleting}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                  padding: "2px",
                }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Card>
          );
        })}
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogActions sx={{ p: 1 }}>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          {selectedImage && (
            <>
              {imageErrors[selectedImage.id] ? (
                <AlertInline severity="error" sx={{ maxWidth: 400 }}>
                  {t("tickets.ticketView.imageLoadError")}
                  <br />
                  <TicketText variant="caption">
                    {selectedImage.fileName}
                  </TicketText>
                </AlertInline>
              ) : (
                <CardMedia
                  component="img"
                  image={getFileUrl(selectedImage)}
                  alt={selectedImage.fileName}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                  onError={() => handleImageError(selectedImage.id)}
                  onLoad={() => handleImageLoad(selectedImage.id)}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
