import { useState, useContext, useEffect } from "react";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TiptapEditor } from "../../../../../common/components/ui/TiptapEditor";
import { useTicketDetailAttachments } from "../../../../../common/hooks/useTicketDetailAttachments";
import {
  TicketDescriptionContext,
  TicketFilesContext,
} from "../TicketViewDetails";
import "../../../../../common/components/ui/TiptapEditor/tiptap-editor.css";
import { scrollableContainer } from "../../../../../common/styles/styles";
import { LoadingProgress } from "../../../../../common/components/ui/LoadingProgress";

export const TicketUpdateStatus = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const [textLength, setTextLength] = useState(0);
  const { description, setDescription } = useContext(TicketDescriptionContext);
  const { setHasFiles, clearFilesRef } = useContext(TicketFilesContext);

  // Use ticket detail attachments hook
  const {
    selectedFiles,
    isUploading,
    handleFileSelect,
    removeFile,
    clearFiles,
  } = useTicketDetailAttachments(ticketId, null);

  const MAX_CHARACTERS = 500;
  const isOverLimit = textLength > MAX_CHARACTERS;

  // Update hasFiles in context when selectedFiles changes
  useEffect(() => {
    setHasFiles(selectedFiles.length > 0);
  }, [selectedFiles.length, setHasFiles]);

  // Provide clear function to parent via ref
  useEffect(() => {
    clearFilesRef.current = () => {
      clearFiles();
      setDescription("");
      setTextLength(0);
    };
  }, [clearFiles, clearFilesRef, setDescription]);

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
            <LoadingProgress size={20} />
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
        height: "120%",
        ...scrollableContainer,
      }}
    >
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 1 }}>
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
    </Box>
  );
};
