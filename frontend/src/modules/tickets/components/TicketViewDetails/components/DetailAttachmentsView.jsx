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
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTicketDetailAttachments } from "../../../../../common/hooks/useTicketDetailAttachments";
import { TicketText } from "../../../../../common/components/ui/TicketText";

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

  // Helper function to build image URL with token
  // Backend already provides the URL path, we just add the base URL and token
  const getImageUrl = (attachment) => {
    try {
      if (!attachment?.url || !token) return null;

      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      const fullUrl = `${baseUrl}${attachment.url}`;

      // Add token as query parameter for authentication
      return `${fullUrl}?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error('Error building image URL:', error);
      return null;
    }
  };

  const handleImageClick = (attachment) => {
    setSelectedImage(attachment);
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
          const imageUrl = getImageUrl(attachment);
          const hasError = imageErrors[attachment.id];

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
                onClick={() => handleImageClick(attachment)}
                disabled={isDeleting}
              >
                {imageUrl && !hasError ? (
                  <CardMedia
                    component="img"
                    height="80"
                    image={imageUrl}
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
                      backgroundColor: "action.hover",
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
                      <AttachFileIcon fontSize="small" />
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
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                  {t("tickets.ticketView.imageLoadError")}
                  <br />
                  <TicketText variant="caption">
                    {selectedImage.fileName}
                  </TicketText>
                </Alert>
              ) : (
                <CardMedia
                  component="img"
                  image={getImageUrl(selectedImage)}
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
