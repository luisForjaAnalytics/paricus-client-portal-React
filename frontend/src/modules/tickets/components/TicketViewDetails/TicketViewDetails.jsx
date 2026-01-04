import { useParams } from "react-router-dom";
import { Box, Typography, Divider, Alert, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetTicketQuery } from "../../../../store/api/ticketsApi";
import { ticketStyle } from "../../../../common/styles/styles";
import TicketInfoDetails from "./components/TicketViewDetailsInfo";
import { TicketHistoricalInfo } from "./components/TicketHistoricalInfo";
import { TicketDescriptionInfo } from "./components/TicketDescriptionInfo";

export const TicketViewDetails = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const {
    data: ticket,
    isLoading,
    error,
    isFetching,
  } = useGetTicketQuery(ticketId, {
    skip: !ticketId,
  });

  // Show loading only on initial load, not on refetch
  if (isLoading && !ticket) return <Box>Loading...</Box>;

  // Don't show error if we're just refetching and already have data
  if (error && !ticket)
    return <Alert severity="error">Error loading ticket</Alert>;

  if (!ticket) return null;

  // Sort details by timestamp
  let sortedDetails = [];
  try {
    sortedDetails = [...ticket.details].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  } catch (error) {
    console.error("Error sorting details:", error);
    sortedDetails = ticket.details || [];
  }

  return (
    <Box
      sx={{
        width: "100%",
        //height: "70%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingBottom: 0,
        pt: { xs: 2, md: 4 },
        pl: { xs: 2, md: 3 },
        pr: { xs: 2, md: 3 },
      }}
    >
      {/* Show subtle loading indicator when refetching (e.g., after uploading image) */}
      {isFetching && ticket && (
        <LinearProgress
          sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
      )}

      {/* SUBJECT */}
      <Box>
        <Typography sx={ticketStyle.typographySubject}>
          {ticket?.subject?.toUpperCase() || "NO SUBJECT"}
        </Typography>
      </Box>

      {/* DESCRIPTION AND DETAILS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flex: 1,
          minHeight: 0,
          width: "100%",
        }}
      >
        {/*Historical Update */}
        <TicketHistoricalInfo ticket={ticket} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* DESCRIPTION */}
          <Box
            sx={{
              ...ticketStyle.historicalContainer,
            }}
          >
            <TicketDescriptionInfo ticket={ticket} />
          </Box>

          <Box
            sx={{
              ...ticketStyle.historicalContainer,
            }}
          >
            <TicketInfoDetails ticket={ticket} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
