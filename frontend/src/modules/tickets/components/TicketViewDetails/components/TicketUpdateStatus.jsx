import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ticketStyle } from "../../../../../common/styles/styles";
import { useAddTicketDescriptionMutation } from "../../../../../store/api/ticketsApi";

export const TicketUpdateStatus = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const [addDescription, { isLoading }] = useAddTicketDescriptionMutation();

  const MAX_CHARACTERS = 500;
  const isOverLimit = description.length > MAX_CHARACTERS;

  const handleUpdate = async () => {
    if (!description.trim() || isOverLimit) return;

    try {
      await addDescription({
        id: ticketId,
        description: description.trim(),
      }).unwrap();
      navigate("/app/tickets/ticketTable");
      setDescription("");
    } catch (error) {
      console.error("Failed to add description:", error);
    }
  };

  const handleCancel = () => {
    setDescription("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        multiline
        placeholder={t("tickets.createNewTicket.description.placeholderMsg")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={isOverLimit}
        helperText={
          isOverLimit
            ? t("tickets.ticketView.maxCharactersError", {
                max: MAX_CHARACTERS,
              })
            : `${description.length}/${MAX_CHARACTERS}`
        }
        sx={ticketStyle.inputDescriptionSection}
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
