import { Box, Typography, Avatar } from "@mui/material";
import { AlertInline } from "../../../../../common/components/ui/AlertInline";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { ticketStyle, colors, scrollableContainer } from "../../../../../common/styles/styles";
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
        ...scrollableContainer,
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

            // Safely get user information - use comment author if available, fallback to ticket creator
            const commentUser = item.createdBy || ticket?.user;
            const userName = commentUser
              ? `${commentUser.firstName || ""} ${
                  commentUser.lastName || ""
                }`.trim()
              : "Unknown User";
            const userEmail = commentUser?.email || "";

            return (
              <Box
                key={item.id || index}
                sx={ticketStyle.historicalContainerTitleDate}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  gap={1}
                  alignItems="center"
                >
                  <GetInitialsAvatar
                    userName={userName}
                    variantStyle={"bold"}
                  />
                  <Box display="flex" flexDirection="column">
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap={0.5}
                      alignItems="center"
                    >
                      {/* <TicketText variant="bold">{userName}</TicketText> */}
                      {userEmail && (
                        <TicketText
                          sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                        >
                          {` / ${userEmail}`}
                        </TicketText>
                      )}
                    </Box>
                  </Box>
                  <TicketText
                    sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                  >
                    {formatDateTime(timestamp)}
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
