import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { ticketStyle } from "../../../../../common/styles/styles";
import { TicketText } from "../../../../../common/components/ui/TicketText";

export const TicketHistoricalInfo = ({ ticket }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {ticket?.descriptions.map((item, index)=>
        <Box key={index} sx={ticketStyle.historicalContainer}>
          <Box sx={ticketStyle.historicalDescriptionBox}>
            <Box display={"flex"} flexDirection={"row"} gap={1}>
              <TicketText variant="bold">
                {`${t(`tickets.ticketView.updatedAt`)}:`}
              </TicketText>
              <Typography>{`${formatDateTime(
               item.timestamp
              )}`}</Typography>
            </Box>
            <TicketText sx={{ paddingLeft: "6rem" }}>
              {item.descriptionData}
            </TicketText>
          </Box>
        </Box>
      )}
    </Box>
  );
};
