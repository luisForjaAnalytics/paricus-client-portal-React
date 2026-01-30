import { Box, Typography, Avatar } from "@mui/material";
import { AlertInline } from "../../../../../common/components/ui/AlertInline";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { ticketStyle, colors } from "../../../../../common/styles/styles";
import { TicketText } from "../../../../../common/components/ui/TicketText";
import { TiptapReadOnly } from "../../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { DetailAttachmentsView } from "./DetailAttachmentsView";
import { GetInitialsAvatar } from "../../../../../common/components/ui/GetInitialsAvatar/GetInitialsAvatar";

export const TicketHistoricalInfo = ({ ticket }) => {
  const { t } = useTranslation();

  // Validate ticket prop
  if (!ticket) {
    return (
      <AlertInline
        message={t("common.error") || "Ticket data not available"}
        severity="warning"
      />
    );
  }

  // Safely get details array with fallback and sort by most recent first
  const details = (ticket?.details || []).slice().sort((a, b) => {
    const dateA = new Date(a.timestamp || a.createdAt || 0);
    const dateB = new Date(b.timestamp || b.createdAt || 0);
    return dateB - dateA; // Descending order (most recent first)
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
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
      {details.length === 0 ? (
        <Box sx={ticketStyle.historicalContainer}>
          <TicketText>{t("tickets.ticketView.noUpdatesYet")}</TicketText>
        </Box>
      ) : (
        details.map((item, index) => {
          try {
            // Validate item has required data
            if (!item) {
              return null;
            }

            // Ensure detailData is a valid string
            const content =
              item.detailData && typeof item.detailData === "string"
                ? item.detailData
                : "<p>No content</p>";

            // Validate timestamp
            const timestamp = item.timestamp || item.createdAt || new Date();

            // Safely get user information
            const userName = ticket?.user
              ? `${ticket.user.firstName || ""} ${
                  ticket.user.lastName || ""
                }`.trim()
              : "Unknown User";

            return (
              <Box
                key={item.id || index}
                sx={ticketStyle.historicalContainerTitleDate}
              >
                <Box display="flex" flexDirection="row" gap={1}>
                  <GetInitialsAvatar
                    userName={userName}
                    variantStyle={"bold"}
                  />
                  {/* <TicketText variant="bold">{`${userName} /`}</TicketText> */}
                  <TicketText
                    sx={{
                      marginTop: "0.4rem",
                    }}
                  >
                    {" "}
                    / {formatDateTime(timestamp)}
                  </TicketText>
                </Box>
                <Box sx={ticketStyle.historicalDescriptionBox}>
                  <Box
                    sx={{
                      ...ticketStyle.historicalContainer,
                    }}
                  >
                    <TiptapReadOnly content={content} showErrorAlert={false} />

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
              <Box key={item?.id || index} sx={ticketStyle.historicalContainer}>
                <AlertInline
                  message={t("common.error") || "Error displaying update"}
                  severity="error"
                  sx={{ fontSize: "0.875rem" }}
                />
              </Box>
            );
          }
        })
      )}
    </Box>
  );
};
