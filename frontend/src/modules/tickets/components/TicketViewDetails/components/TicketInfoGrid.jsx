import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { TicketText } from "../../../../../common/components/ui/TicketText";

// Formatters for specific field types
const fieldFormatters = {
  // Format user object to show name and email on separate lines
  user: (value) => {
    if (!value) return "N/A";
    if (typeof value === "object") {
      const name = value.firstName && value.lastName
        ? `${value.firstName} ${value.lastName}`
        : value.firstName || value.lastName || "";
      const email = value.email || "";

      if (name && email) {
        return (
          <Box display="flex" flexDirection="column" gap={1}>
            <TicketText>
              <strong>Name:</strong> {name}
            </TicketText>
            <TicketText>
              <strong>Email:</strong> {email}
            </TicketText>
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
    const name = ticket.user.firstName && ticket.user.lastName
      ? `${ticket.user.firstName} ${ticket.user.lastName}`
      : ticket.user.firstName || ticket.user.lastName || "Unknown";
    return name;
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
    visible: true,
    label: "subject",
  },
  priority: {
    visible: true,
    label: "priority",
  },
  status: {
    visible: true,
    label: "status",
  },
  assignedTo: {
    visible: true,
    label: "assignedTo",
  },
  from: {
    visible: true,
    label: "from",
    formatter: "from",
  },

  descriptions: {
    visible: false,
    label: "descriptions",
  },
  user: {
    visible: true,
    label: "user",
    formatter: "user", // Use the user formatter
    hideLabel: true, // Don't show the label, the formatter handles it
  },
  id: {
    visible: false,
    label: "id",
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
    formatter: "createdAt", // Use the date formatter
  },
  updatedAt: {
    visible: false,
    label: "updatedAt",
    formatter: "updatedAt", // Use the date formatter
  },
};

const TicketInfoGrid = ({ ticket }) => {
  const { t } = useTranslation();

  // Helper function to format field value
  const formatValue = (value, config) => {
    try {
      // If a specific formatter is defined for this field, use it
      if (config.formatter && fieldFormatters[config.formatter]) {
        return fieldFormatters[config.formatter](value, ticket);
      }
      // Otherwise use the default formatter
      return fieldFormatters.default(value);
    } catch (error) {
      console.error("Error formatting value:", error);
      return "N/A";
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {Object.entries(TICKET_FIELDS_CONFIG)
        .filter(([, config]) => config.visible)
        .map(([key, config]) => {
          // If hideLabel is true, just return the formatted value without the label
          if (config.hideLabel) {
            return (
              <Box key={key}>
                {formatValue(ticket[key], config)}
              </Box>
            );
          }

          // Otherwise, show label + value
          return (
            <Box key={key} display="flex" gap={0.5}>
              <TicketText variant="bold">
                {t(`tickets.ticketView.${config.label}`)}:
              </TicketText>
              <TicketText>
                {formatValue(ticket[key], config)}
              </TicketText>
            </Box>
          );
        })}
    </Box>
  );
};

export default TicketInfoGrid;
