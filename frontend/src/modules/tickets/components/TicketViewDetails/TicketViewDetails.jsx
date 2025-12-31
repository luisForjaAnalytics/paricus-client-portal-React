import { useParams } from "react-router-dom";
import { Box, Typography, Divider, Alert, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetTicketQuery } from "../../../../store/api/ticketsApi";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import {
  ticketStyle,
  titlesTypography,
} from "../../../../common/styles/styles";
import TicketInfoGrid from "./components/TicketInfoGrid";
import { TicketHistoricalInfo } from "./components/TicketHistoricalInfo";
import { TicketUpdateStatus } from "./components/TicketUpdateStatus";
import { TicketAttachments } from "./components/TicketAttachments";

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
  if (error && !ticket) return <Alert severity="error">Error loading ticket</Alert>;

  if (!ticket) return null;

  // Sort date
  let sortedDescriptions = [];
  try {
    sortedDescriptions = [...ticket.descriptions].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  } catch (error) {
    console.error("Error sorting descriptions:", error);
    sortedDescriptions = ticket.descriptions || [];
  }
  console.log(ticket);

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
        <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      )}

      {/* SUBJECT */}
      <Box sx={{ marginBottom: "1rem" }}>
        <Typography sx={ticketStyle.typographySubject}>
          {ticket.subject.toUpperCase()}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width:'70%',
            minWidth: 0,
          }}
        >
          {/*Historical Update */}
          <Box
            sx={{
              maxHeight: "250px", // Altura máxima para mostrar ~4 items
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
            <TicketHistoricalInfo ticket={ticket} />
          </Box>

          {/* FOOTER */}
          <TicketUpdateStatus />
        </Box>

        {/* INFO */}
        <Box
          sx={{
            ...ticketStyle.historicalContainer,
          }}
        >
          <TicketInfoGrid ticket={ticket} />
        </Box>
      </Box>
    </Box>
  );
};
