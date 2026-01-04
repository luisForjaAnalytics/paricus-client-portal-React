import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { ticketStyle } from "../../../../../common/styles/styles";
import { TicketText } from "../../../../../common/components/ui/TicketText";
import { TicketUpdateStatus } from "./TicketUpdateStatus";
import { TiptapReadOnly } from "../../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { TicketDescriptionInfo } from "./TicketDescriptionInfo";
import { DetailAttachmentsView } from "./DetailAttachmentsView";

export const TicketHistoricalInfo = ({ ticket }) => {
  const { t } = useTranslation();

  // Safely get details array with fallback and sort by most recent first
  const details = (ticket?.details || []).slice().sort((a, b) => {
    const dateA = new Date(a.timestamp || a.createdAt || 0);
    const dateB = new Date(b.timestamp || b.createdAt || 0);
    return dateB - dateA; // Descending order (most recent first)
  });

  // If no details, show a message
  if (details.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={ticketStyle.historicalContainer}>
          <TicketText>{t("tickets.ticketView.noUpdatesYet")}</TicketText>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "70%",
        minWidth: 0,
      }}
    >
      {/* DESCRIPTION */}
      {/* <Box
        sx={{
          ...ticketStyle.historicalContainer,
        }}
      >
        <TicketDescriptionInfo ticket={ticket} />
      </Box> */}
      <Box
        sx={{
          maxHeight: "40vh", // Altura máxima para mostrar ~4 items
          //maxHeight: "15%", // Altura máxima para mostrar ~4 items
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: 1,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {details.map((item, index) => {
            try {
              // Validate item has required data
              if (!item) {
                console.warn("Empty detail item at index:", index);
                return null;
              }

              // Ensure detailData is a valid string
              const content =
                item.detailData && typeof item.detailData === "string"
                  ? item.detailData
                  : "<p>No content</p>";

              // Validate timestamp
              const timestamp = item.timestamp || item.createdAt || new Date();

              return (
                <Box
                  key={item.id || index}
                  sx={ticketStyle.historicalContainer}
                >
                  <Box sx={ticketStyle.historicalDescriptionBox}>
                    <Box display={"flex"} flexDirection={"row"} gap={1}>
                      <TicketText variant="bold">
                        {`${t(`tickets.ticketView.updatedAt`)}:`}
                      </TicketText>
                      <Typography>{`${formatDateTime(timestamp)}`}</Typography>
                    </Box>
                    <Box sx={{ paddingLeft: "6rem" }}>
                      <TiptapReadOnly
                        content={content}
                        showErrorAlert={false}
                      />

                      {/* Show attachments for this detail */}
                      {item.attachments && item.attachments.length > 0 && (
                        <Box mt={1}>
                          <DetailAttachmentsView
                            ticketId={ticket.id}
                            detail={item}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            } catch (error) {
              console.error("Error rendering detail item:", error, item);
              return (
                <Box
                  key={item?.id || index}
                  sx={ticketStyle.historicalContainer}
                >
                  <TicketText>Error displaying update</TicketText>
                </Box>
              );
            }
          })}
        </Box>
      </Box>
      <Box
      sx={{
        padding:'0 1rem 0 0'
      }}
      >
        {/*Description Update */}
        <TicketUpdateStatus />
      </Box>
    </Box>
  );
};
