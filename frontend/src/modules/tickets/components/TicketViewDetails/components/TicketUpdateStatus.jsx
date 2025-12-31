import { useState } from "react";
import { Box, Button, IconButton, CircularProgress, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ticketStyle } from "../../../../../common/styles/styles";
import { useAddTicketDescriptionMutation } from "../../../../../store/api/ticketsApi";
import { TiptapEditor } from "../../../../../common/components/ui/TiptapEditor";
import { useTicketAttachments } from "../../../../../common/hooks/useTicketAttachments";
import "../../../../../common/components/ui/TiptapEditor/tiptap-editor.css";

export const TicketUpdateStatus = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const [description, setDescription] = useState("");
  const [textLength, setTextLength] = useState(0);
  const navigate = useNavigate();

  const [addDescription, { isLoading }] = useAddTicketDescriptionMutation();

  // Use ticket attachments hook
  const { isUploading, handleFileSelect } = useTicketAttachments(ticketId);

  const MAX_CHARACTERS = 500;
  const isOverLimit = textLength > MAX_CHARACTERS;

  const handleUpdate = async () => {
    if (!description.trim() || isOverLimit) return;

    try {
      await addDescription({
        id: ticketId,
        description: description,
      }).unwrap();
      navigate("/app/tickets/ticketTable");
      setDescription("");
      setTextLength(0);
    } catch (error) {
      console.error("Failed to add description:", error);
    }
  };

  const handleCancel = () => {
    setDescription("");
    setTextLength(0);
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
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
        gap: 2,
      }}
    >
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
          disabled={isLoading || !description.trim() || isOverLimit}
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
