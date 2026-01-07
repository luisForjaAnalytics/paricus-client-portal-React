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
import DescriptionIcon from "@mui/icons-material/Description";
import { useTicketAttachments } from "../../../../../common/hooks/useTicketAttachments";
import { ticketStyle } from "../../../../../common/styles/styles";
import { useState } from "react";

export const TicketDescriptionInfo = ({ ticket }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const { handleDelete, isDeleting } = useTicketAttachments(ticket?.id);

  const getImageUrl = (attachment) => {
    try {
      if (!attachment?.url || !token) return null;
      const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
      const fullUrl = `${baseUrl}${attachment.url}`;
      return `${fullUrl}?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error("Error building image URL:", error);
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
    console.error(`Failed to load image ${attachmentId}`);
    setImageErrors((prev) => ({ ...prev, [attachmentId]: true }));
  };

  const handleImageLoad = (attachmentId) => {
    setImageErrors((prev) => {
      const next = { ...prev };
      delete next[attachmentId];
      return next;
    });
  };

  if (!ticket || !ticket.description) {
    return (
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <TicketText>No description available</TicketText>
      </Box>
    );
  }

  let descriptionData;
  try {
    if (typeof ticket.description === "string") {
      const parsed = JSON.parse(ticket.description);
      descriptionData = parsed?.descriptionData;
    } else if (typeof ticket.description === "object") {
      descriptionData = ticket.description?.descriptionData;
    }
  } catch (error) {
    console.error("Error parsing description:", error);
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
      <Box display="flex" flexDirection="column">
        <Box sx={ticketStyle.descriptionTitle}>
          <DescriptionIcon sx={ticketStyle.descriptionIcon} />
          {t("tickets.ticketView.description").toUpperCase()}
        </Box>

        <Box sx={ticketStyle.descriptionContent}>
          <TiptapReadOnly content={descriptionData} />
        </Box>

        {attachments.length > 0 && (
          <Box>
            <Box sx={ticketStyle.attachmentsTitle}>
              {t("tickets.ticketView.attachments").toUpperCase()}
            </Box>

            <Box display="flex" flexDirection="row" gap={1} flexWrap="wrap">
              {attachments.map((attachment) => {
                const imageUrl = getImageUrl(attachment);
                const hasError = imageErrors[attachment.id];

                return (
                  <Card
                    key={attachment.id}
                    sx={{
                      width: 70,
                      height: 70,
                      overflow: "hidden",
                      borderRadius: 1,
                      position: "relative",
                      "&:hover .delete-button": { opacity: 1 },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleImageClick(attachment)}
                      disabled={isDeleting}
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {imageUrl && !hasError ? (
                        <CardMedia
                          component="img"
                          image={imageUrl}
                          alt={attachment.fileName}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={() => handleImageError(attachment.id)}
                          onLoad={() => handleImageLoad(attachment.id)}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            backgroundColor: "action.hover",
                          }}
                        >
                          {hasError ? (
                            <>
                              <ErrorOutlineIcon
                                fontSize="large"
                                color="error"
                              />
                              <TicketText sx={{ fontSize: "0.65rem" }}>
                                {t("tickets.ticketView.imageLoadError")}
                              </TicketText>
                            </>
                          ) : (
                            <AttachFileIcon fontSize="large" />
                          )}
                        </Box>
                      )}
                    </CardActionArea>

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
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white",
                        opacity: 0,
                        transition: "opacity .2s",
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
            minHeight: 300,
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
