import { Box } from "@mui/material";
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
import { ticketStyle } from "../../../../../common/styles/styles";

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
            {/* FROM label with icon and name */}
            <Box sx={ticketStyle.ticketDetailRow}>
              <Box sx={{...ticketStyle.ticketDetailLabel, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <GppGoodIcon sx={{ fontSize: '1rem' }} />
                From
              </Box>
              <Box sx={{...ticketStyle.ticketDetailValue, paddingLeft: '1.5rem'}}>
                <Box sx={ticketStyle.ticketDetailName}>
                  {name}
                </Box>
              </Box>
            </Box>
            {/* Email row */}
            <Box sx={ticketStyle.ticketDetailRow}>
              <Box sx={{...ticketStyle.ticketDetailLabel, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <EmailIcon sx={{ fontSize: '1rem' }} />
                Email
              </Box>
              <Box sx={{...ticketStyle.ticketDetailValue, paddingLeft: '1.5rem'}}>
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
    const name = ticket.user.firstName && ticket.user.lastName
      ? `${ticket.user.firstName} ${ticket.user.lastName}`
      : ticket.user.firstName || ticket.user.lastName || "Unknown";
    return name;
  },

  // Format "assignedTo" field - extracts name from assignedTo object
  assignedTo: (value, ticket) => {
    if (!ticket?.assignedTo) return "Unassigned";
    const name = ticket.assignedTo.firstName && ticket.assignedTo.lastName
      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
      : ticket.assignedTo.firstName || ticket.assignedTo.lastName || "Unknown";
    return (
      <Box sx={ticketStyle.ticketDetailName}>
        {name}
      </Box>
    );
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
    formatter: "assignedTo",
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
    label: "from",
    formatter: "user", // Use the user formatter
    hideLabel: false,
  },
  id: {
    visible: true,
    label: "ticketId",
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
    <Box display="flex" flexDirection="column" gap={1} width={350}>
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
          const IconComponent = fieldIcons[key];

          return (
            <Box key={key} display="flex" gap={0.5}>
              <TicketText variant="bold" sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                {IconComponent && <IconComponent sx={{ fontSize: '1rem' }} />}
                {capitalizeFirst(t(`tickets.ticketView.${config.label}`))}:
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
