import { createContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Divider, Alert, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetTicketQuery } from "../../../../store/api/ticketsApi";
import { ticketStyle } from "../../../../common/styles/styles";
import TicketInfoDetails from "./components/TicketViewDetailsInfo";
import { TicketDescriptionInfo } from "./components/TicketDescriptionInfo";
import { TicketsCoomentsText } from "./components/TicketsCoomentsText";

// Context to share pending priority changes
export const TicketPriorityContext = createContext({
  pendingPriority: null,
  setPendingPriority: () => {},
  clearPendingPriority: () => {},
});

// Context to share pending status changes
export const TicketStatusContext = createContext({
  pendingStatus: null,
  setPendingStatus: () => {},
  clearPendingStatus: () => {},
});

export const TicketViewDetails = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const [pendingPriority, setPendingPriority] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
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

  const clearPendingPriority = () => setPendingPriority(null);
  const clearPendingStatus = () => setPendingStatus(null);

  const priorityContextValue = {
    pendingPriority,
    setPendingPriority,
    clearPendingPriority,
  };

  const statusContextValue = {
    pendingStatus,
    setPendingStatus,
    clearPendingStatus,
  };

  return (
    <TicketPriorityContext.Provider value={priorityContextValue}>
      <TicketStatusContext.Provider value={statusContextValue}>
        <Box
          sx={{
            width: "100%",
            height: "80vh", // Altura completa de la ventana
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingBottom: 2,
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
              ...ticketStyle.descriptioDetailBox,
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* LEFT COLUMN - Description and Tabs (Historical/Comments) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                //gap: 1,
                width: "70%",
                minWidth: 0,
                height: "100%",
              }}
            >
              {/* DESCRIPTION */}
              <Box
                sx={{
                  ...ticketStyle.descriptionSection,
                  height: "30%",
                }}
              >
                <TicketDescriptionInfo ticket={ticket} />
              </Box>

              {/* TABS - Historical and Comments */}
              <TicketsCoomentsText ticket={ticket} />
            </Box>

            {/* RIGHT COLUMN - INFO DETAILS */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "35%",
                minWidth: "300px",
              }}
            >
              <TicketInfoDetails ticket={ticket} />
            </Box>
          </Box>
        </Box>
      </TicketStatusContext.Provider>
    </TicketPriorityContext.Provider>
  );
};
