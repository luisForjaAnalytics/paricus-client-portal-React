import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  CardMedia,
  Card,
  CardActionArea,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TicketText } from "../../../../../common/components/ui/TicketText";
import { TiptapReadOnly } from "../../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTicketAttachments } from "../../../../../common/hooks/useTicketAttachments";
import { useState } from "react";

export const TicketDescriptionInfo = ({ ticket }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const {
    handleDelete,
    isDeleting,
  } = useTicketAttachments(ticket?.id);

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
    console.error(`Failed to load image for attachment ${attachmentId}`);
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

  if (!ticket || !ticket.description) {
    return (
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <TicketText>No description available</TicketText>
      </Box>
    );
  }

  // Safely parse description - handle both object and JSON string
  let descriptionData;
  try {
    if (typeof ticket.description === "string") {
      // If it's a JSON string, parse it
      const parsed = JSON.parse(ticket.description);
      descriptionData = parsed?.descriptionData;
    } else if (typeof ticket.description === "object") {
      // If it's already an object, use it directly
      descriptionData = ticket.description?.descriptionData;
    }
  } catch (error) {
    console.error("Error parsing ticket description:", error);
    descriptionData = null;
  }

  if (!descriptionData || typeof descriptionData !== "string") {
    return (
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <TicketText>No description content</TicketText>
      </Box>
    );
  }

  const attachments = ticket?.attachments || [];

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Description */}
        <Box>
          <TicketText variant="bold">
            {t("tickets.ticketView.description")}:
          </TicketText>
          <Box mt={1}>
            <TiptapReadOnly content={descriptionData} />
          </Box>
        </Box>

        {/* Attachments */}
        {attachments.length > 0 && (
          <Box>
            <TicketText variant="bold">
              {t("tickets.ticketView.attachments")}:
            </TicketText>
            <Box
              mt={1}
              display="flex"
              flexDirection="row"
              gap={2}
              flexWrap="wrap"
            >
              {attachments.map((attachment) => {
                const imageUrl = getImageUrl(attachment);
                const hasError = imageErrors[attachment.id];

                return (
                  <Card
                    key={attachment.id}
                    sx={{
                      width: 120,
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
                          height="120"
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
                            height: 120,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "action.hover",
                            gap: 0.5,
                          }}
                        >
                          {hasError ? (
                            <>
                              <ErrorOutlineIcon fontSize="large" color="error" />
                              <TicketText
                                sx={{
                                  fontSize: "0.65rem",
                                  textAlign: "center",
                                  px: 0.5,
                                }}
                              >
                                {t("tickets.ticketView.imageLoadError")}
                              </TicketText>
                            </>
                          ) : (
                            <AttachFileIcon fontSize="large" />
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
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        },
                        padding: "4px",
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}
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
        <DialogContent sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
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
