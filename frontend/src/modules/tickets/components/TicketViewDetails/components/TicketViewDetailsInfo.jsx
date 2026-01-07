import { useState, useContext } from "react";
import { Box, Chip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FlagIcon from "@mui/icons-material/Flag";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import GppGoodIcon from "@mui/icons-material/GppGood";
import EmailIcon from "@mui/icons-material/Email";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { TicketText } from "../../../../../common/components/ui/TicketText";
import {
  TicketPriorityContext,
  TicketStatusContext,
} from "../TicketViewDetails";
import { TicketChangesRequest } from "./TicketChangesRequest";
import { colors, ticketStyle } from "../../../../../common/styles/styles";

// Icon mapping for each field
const fieldIcons = {
  status: LocalOfferIcon,
  priority: FlagIcon,
  assignedTo: PermIdentityIcon,
  from: GppGoodIcon,
  email: EmailIcon,
  id: BookmarkIcon,
  createdAt: AccessTimeIcon,
};

// Helper function to capitalize first letter only
const capitalizeFirst = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Helper function to get priority styles
const getPriorityStyles = (value) => {
  const priorityValue = value?.toLowerCase();
  let styles = { backgroundColor: "#f5f5f5", color: "#757575" };

  if (priorityValue === "high") {
    styles = { backgroundColor: "#ffebee", color: "#c62828" };
  } else if (priorityValue === "medium") {
    styles = { backgroundColor: "#fff3e0", color: "#e65100" };
  } else if (priorityValue === "low") {
    styles = { backgroundColor: "#e3f2fd", color: "#1565c0" };
  }

  return styles;
};

// Formatters for specific field types
const fieldFormatters = {
  // Format priority with colored chip (clickable)
  priority: (value, ticket, handlers) => {
    if (!value) return "N/A";

    const styles = getPriorityStyles(value);

    return (
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        onClick={handlers?.onPriorityClick}
        sx={{
          ...styles,
          fontWeight: "medium",
          fontSize: "0.875rem",
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
        }}
        size="small"
      />
    );
  },

  // Format status with colored chip (clickable - same styles as table)
  status: (value, ticket, handlers) => {
    if (!value) return "N/A";

    const statusValue = value.toLowerCase();
    let styles = { backgroundColor: "#f5f5f5", color: "#616161" };

    if (statusValue === "open") {
      styles = { backgroundColor: "#e3f2fd", color: "#1565c0" };
    } else if (statusValue === "in progress") {
      styles = { backgroundColor: "#fff3e0", color: "#e65100" };
    } else if (statusValue === "resolved") {
      styles = { backgroundColor: "#e8f5e9", color: "#2e7d32" };
    } else if (statusValue === "closed") {
      styles = { backgroundColor: "#f5f5f5", color: "#616161" };
    }

    return (
      <Chip
        label={value.charAt(0).toUpperCase() + value.slice(1)}
        onClick={handlers?.onStatusClick}
        sx={{
          ...styles,
          fontWeight: "medium",
          fontSize: "0.875rem",
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
        }}
        size="small"
      />
    );
  },

  // Format user object to show name and email on separate lines
  user: (value) => {
    if (!value) return "N/A";
    if (typeof value === "object") {
      const name =
        value.firstName && value.lastName
          ? `${value.firstName} ${value.lastName}`
          : value.firstName || value.lastName || "";
      const email = value.email || "";

      if (name && email) {
        return (
          <Box display="flex" flexDirection="column" gap={1}>
            {/* FROM label with icon and name */}
            <Box sx={ticketStyle.ticketDetailRow}>
              <Box
                sx={{
                  ...ticketStyle.ticketDetailLabel,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <GppGoodIcon sx={{ fontSize: "1rem" }} />
                From
              </Box>
              <Box
                sx={{ ...ticketStyle.ticketDetailValue, paddingLeft: "1.5rem" }}
              >
                <Box sx={ticketStyle.ticketDetailName}>{name}</Box>
              </Box>
            </Box>
            {/* Email row */}
            <Box sx={ticketStyle.ticketDetailRow}>
              <Box
                sx={{
                  ...ticketStyle.ticketDetailLabel,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <EmailIcon sx={{ fontSize: "1rem" }} />
                Email
              </Box>
              <Box
                sx={{ ...ticketStyle.ticketDetailValue, paddingLeft: "1.5rem" }}
              >
                {email}
              </Box>
            </Box>
          </Box>
        );
      }
      if (name) return name;
      if (email) return email;
      return "N/A";
    }
    return value;
  },

  // Format "from" field - extracts name from user object
  from: (value, ticket) => {
    if (!ticket?.user) return "N/A";
    const name =
      ticket.user.firstName && ticket.user.lastName
        ? `${ticket.user.firstName} ${ticket.user.lastName}`
        : ticket.user.firstName || ticket.user.lastName || "Unknown";
    return name;
  },

  // Format "assignedTo" field - extracts name from assignedTo object
  assignedTo: (value, ticket) => {
    if (!ticket?.assignedTo) return "Unassigned";
    const name =
      ticket.assignedTo.firstName && ticket.assignedTo.lastName
        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
        : ticket.assignedTo.firstName ||
          ticket.assignedTo.lastName ||
          "Unknown";
    return <Box sx={ticketStyle.ticketDetailName}>{name}</Box>;
  },

  // Format dates to readable format
  createdAt: (value) => {
    if (!value) return "N/A";
    return formatDateTime(value);
  },

  updatedAt: (value) => {
    if (!value) return "N/A";
    return formatDateTime(value);
  },

  // Default formatter for any other field
  default: (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  },
};

const TICKET_FIELDS_CONFIG = {
  subject: {
    visible: false,
    label: "subject",
  },
  status: {
    visible: true,
    label: "status",
    formatter: "status",
  },
  priority: {
    visible: true,
    label: "priority",
    formatter: "priority",
  },

  assignedTo: {
    visible: true,
    label: "assignedTo",
    formatter: "assignedTo",
  },
  from: {
    visible: false, // Ocultar "from" porque "user" ya muestra la misma info
    label: "from",
    formatter: "from",
  },
  description: {
    visible: false,
    label: "description",
  },
  user: {
    visible: true,
    label: "from", // Cambiar label a "from" para que muestre "FROM:"
    formatter: "user",
    hideLabel: true, // El label se incluye dentro del formatter
  },
  id: {
    visible: true,
    label: "ticketId",
  },
  descriptions: {
    visible: false,
    label: "descriptions",
  },
  details: {
    visible: false,
    label: "details",
  },
  clientId: {
    visible: false,
    label: "clientId",
  },
  userId: {
    visible: false,
    label: "userId",
  },
  createdAt: {
    visible: true,
    label: "createdAt",
    formatter: "createdAt",
  },
  updatedAt: {
    visible: false,
    label: "updatedAt",
    formatter: "updatedAt",
  },
};

const TicketInfoDetails = ({ ticket }) => {
  const { t } = useTranslation();
  const [openPriorityModal, setOpenPriorityModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const { setPendingPriority, pendingPriority } = useContext(
    TicketPriorityContext
  );
  const { setPendingStatus, pendingStatus } = useContext(TicketStatusContext);

  const handlers = {
    onPriorityClick: () => setOpenPriorityModal(true),
    onStatusClick: () => setOpenStatusModal(true),
  };

  const formatValue = (value, config, key) => {
    try {
      // Show pending value if it exists
      let displayValue = value;
      if (key === "priority" && pendingPriority) {
        displayValue = pendingPriority;
      } else if (key === "status" && pendingStatus) {
        displayValue = pendingStatus;
      }

      if (config.formatter && fieldFormatters[config.formatter]) {
        return fieldFormatters[config.formatter](
          displayValue,
          ticket,
          handlers
        );
      }
      return fieldFormatters.default(displayValue);
    } catch (error) {
      console.error("Error formatting value:", error);
      return "N/A";
    }
  };

  const handlePrioritySelect = (newPriority) => {
    setPendingPriority(newPriority);
    setOpenPriorityModal(false);
  };

  const handleStatusSelect = (newStatus) => {
    setPendingStatus(newStatus);
    setOpenStatusModal(false);
  };

  return (
    <>
      <Box sx={ticketStyle.ticketDetailsContainer}>
        <Box
          sx={{
            ...ticketStyle.ticketDetailsTitle,
            marginBottom: "1.5rem",
            color: colors.textMuted,
          }}
        >
          {capitalizeFirst(t("tickets.ticketView.details"))}
        </Box>

        {/* Details List */}
        <Box display="flex" flexDirection="column">
          {Object.entries(TICKET_FIELDS_CONFIG)
            .filter(([, config]) => config.visible)
            .map(([key, config]) => {
              if (config.hideLabel) {
                return (
                  <Box key={key}>{formatValue(ticket[key], config, key)}</Box>
                );
              }

              const IconComponent = fieldIcons[key];

              return (
                <Box key={key} sx={ticketStyle.ticketDetailRow}>
                  <Box
                    sx={{
                      ...ticketStyle.ticketDetailLabel,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {IconComponent && (
                      <IconComponent sx={{ fontSize: "1rem" }} />
                    )}
                    {capitalizeFirst(t(`tickets.ticketView.${config.label}`))}
                  </Box>
                  <Box
                    sx={{
                      ...ticketStyle.ticketDetailValue,
                      paddingLeft: "1.5rem",
                    }}
                  >
                    {formatValue(ticket[key], config, key)}
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Box>

      {/* Priority Change Modal */}
      <TicketChangesRequest
        open={openPriorityModal}
        onClose={() => setOpenPriorityModal(false)}
        currentValue={pendingPriority || ticket.priority}
        onSelect={handlePrioritySelect}
        changeType="priority"
      />

      {/* Status Change Modal */}
      <TicketChangesRequest
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        currentValue={pendingStatus || ticket.status}
        onSelect={handleStatusSelect}
        changeType="status"
      />
    </>
  );
};

export default TicketInfoDetails;
