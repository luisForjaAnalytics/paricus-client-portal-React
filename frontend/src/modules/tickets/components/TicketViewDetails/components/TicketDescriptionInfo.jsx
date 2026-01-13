import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TicketText } from "../../../../../common/components/ui/TicketText";
import { TiptapReadOnly } from "../../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTicketAttachments } from "../../../../../common/hooks/useTicketAttachments";
import { ticketStyle } from "../../../../../common/styles/styles";
import { useState } from "react";

export const TicketDescriptionInfo = ({ ticket }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token);

  const [selectedImage, setSelectedImage] = useState(null);

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

            <Box display="flex" flexDirection="row" gap={0.5} flexWrap="wrap">
              {attachments.map((attachment) => (
                <Chip
                  key={attachment.id}
                  icon={<AttachFileIcon />}
                  label={attachment.fileName}
                  onClick={() => handleImageClick(attachment)}
                  onDelete={() => handleDelete(attachment.id)}
                  deleteIcon={<DeleteIcon />}
                  disabled={isDeleting}
                  size="small"
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                />
              ))}
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

        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <Box
              component="img"
              src={getImageUrl(selectedImage)}
              alt={selectedImage.fileName}
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
