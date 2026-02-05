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
import { ticketStyle, imagePreview } from "../../../../../common/styles/styles";
import { getAttachmentUrl } from "../../../../../common/utils/getAttachmentUrl";
import { useModal } from "../../../../../common/hooks";

export const TicketDescriptionInfo = ({ ticket }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token);
  const imageModal = useModal();

  const { handleDelete, isDeleting } = useTicketAttachments(ticket?.id);

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
                  onClick={() => imageModal.open(attachment)}
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
        open={imageModal.isOpen}
        onClose={imageModal.close}
        maxWidth="lg"
        fullWidth
      >
        <DialogActions sx={{ p: 1 }}>
          <IconButton onClick={imageModal.close} size="small">
            <CloseIcon />
          </IconButton>
        </DialogActions>

        <DialogContent sx={{ p: 0 }}>
          {imageModal.data && (
            <Box
              component="img"
              src={getAttachmentUrl(imageModal.data, token)}
              alt={imageModal.data.fileName}
              sx={imagePreview}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
