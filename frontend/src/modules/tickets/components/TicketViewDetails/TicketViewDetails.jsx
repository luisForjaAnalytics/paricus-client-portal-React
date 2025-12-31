import { useParams } from "react-router-dom";
import { Box, Typography, Divider, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetTicketQuery } from "../../../../store/api/ticketsApi";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { ticketStyle } from "../../../../common/styles/styles";
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
  } = useGetTicketQuery(ticketId, {
    skip: !ticketId,
  });

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Alert severity="error">Error loading ticket</Alert>;
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
  console.log((ticket));

  const ticketInfo = [
    {
      title: "Ticket Info",
      items: [
        { label: "status", value: ticket.status },
        { label: "priority", value: ticket.priority },
        { label: "department", value: ticket.department },
        { label: "createdDate", value: formatDateTime(ticket.createdAt) },
      ],
    },
    {
      title: "User Info",
      items: [
        {
          label: "name",
          value: `${ticket.user.firstName} ${ticket.user.lastName}`,
        },
        { label: "email", value: ticket.user.email },
      ],
    },
    {
      title: "Assignment",
      items: [
        { label: "assignedTo", value: ticket.assignedTo ?? "Unassigned" },
        { label: "slaPlan", value: ticket.slaPlan },
        { label: "dueDate", value: formatDateTime(ticket.dueDate) },
      ],
    },
    {
      title: "Description",
      items: sortedDescriptions,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        //height: "100vh",
        gap: 2,
        paddingBottom: 0,
        pt: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* HEADER */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography>
          <strong>SUBJECT:</strong> {ticket.subject}
        </Typography>
        <Typography>
          <strong>TICKET:</strong> {ticket.id}
        </Typography>
      </Box>

      <Divider sx={ticketStyle.divider} />

      {/* INFO */}
      <Box sx={ticketStyle.historicalContainer}>
        <TicketInfoGrid
          ticket = {ticket}
        />
      </Box>

      <Divider sx={ticketStyle.divider} />

      <Box
        sx={{
          flex: "0 0 25vh",
          overflowY: "auto",
          minHeight: 0,
          paddingRight: 1,
        }}
      >
          {/*Historical Update */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {ticketInfo[3]?.items.map((item, index) => (
            <TicketHistoricalInfo key={index} ticketInfo={item} />
          ))}
        </Box>
      </Box>

      <Divider sx={ticketStyle.divider} />

      {/* ATTACHMENTS */}
      <TicketAttachments ticket={ticket} />

      <Divider sx={ticketStyle.divider} />

      {/* FOOTER */}
      <TicketUpdateStatus />
    </Box>
  );
};
