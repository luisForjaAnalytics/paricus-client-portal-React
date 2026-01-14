import { useState, useContext } from "react";
import { Box, Chip, Button, Alert, Snackbar } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FlagIcon from "@mui/icons-material/Flag";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import GppGoodIcon from "@mui/icons-material/GppGood";
import EmailIcon from "@mui/icons-material/Email";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LinkIcon from "@mui/icons-material/Link";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "../../../../../common/utils/formatDateTime";
import { TicketText } from "../../../../../common/components/ui/TicketText";
import {
  TicketPriorityContext,
  TicketStatusContext,
  TicketAssignedToContext,
  TicketDescriptionContext,
  TicketFilesContext,
} from "../TicketViewDetails";
import { TicketChangesRequest } from "./TicketChangesRequest";
import { colors, ticketStyle } from "../../../../../common/styles/styles";
import { usePermissions } from "../../../../../common/hooks/usePermissions";
import {
  useGetAssignableUsersQuery,
  useUpdateTicketMutation,
  useAddTicketDetailMutation,
} from "../../../../../store/api/ticketsApi";
import { useTicketDetailAttachments } from "../../../../../common/hooks/useTicketDetailAttachments";

// Icon mapping for each field
const fieldIcons = {
  status: LocalOfferIcon,
  priority: FlagIcon,
  assignedTo: PermIdentityIcon,
  from: GppGoodIcon,
  email: EmailIcon,
  id: BookmarkIcon,
  createdAt: AccessTimeIcon,
  url: LinkIcon,
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

  // Format "assignedTo" field - extracts name from assignedTo object (clickable)
  assignedTo: (value, ticket, handlers, pendingUser) => {
    let name;

    if (pendingUser) {
      // Show pending user if one is selected
      name = `${pendingUser.firstName || ""} ${pendingUser.lastName || ""}`.trim() || "Unknown";
    } else if (ticket?.assignedTo) {
      // Show current assigned user
      name = `${ticket.assignedTo.firstName || ""} ${ticket.assignedTo.lastName || ""}`.trim() || "Unknown";
    } else {
      // No one assigned
      name = "Unassigned";
    }

    return (
      <Chip
        label={name}
        onClick={handlers?.onAssignedToClick}
        sx={{
          backgroundColor: pendingUser ? "#fff3e0" : "#f5f5f5",
          color: pendingUser ? "#e65100" : "#616161",
          fontWeight: "medium",
          fontSize: "0.875rem",
          cursor: handlers?.onAssignedToClick ? "pointer" : "default",
          "&:hover": handlers?.onAssignedToClick ? {
            opacity: 0.8,
          } : {},
        }}
        size="small"
      />
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

  // Format URL as clickable link (URL is stored in ticket.description.url)
  url: (value, ticket) => {
    // URL is stored inside the description object
    const urlValue = ticket?.description?.url;
    if (!urlValue) return "";
    return (
      <a
        href={urlValue}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: colors.primary,
          textDecoration: "none",
          wordBreak: "break-all",
        }}
      >
        {urlValue}
      </a>
    );
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
  url: {
    visible: true,
    label: "url",
    formatter: "url",
  },
  updatedAt: {
    visible: false,
    label: "updatedAt",
    formatter: "updatedAt",
  },
};

const TicketInfoDetails = ({ ticket }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [openPriorityModal, setOpenPriorityModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openAssignedToModal, setOpenAssignedToModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const { setPendingPriority, pendingPriority, clearPendingPriority } = useContext(
    TicketPriorityContext
  );
  const { setPendingStatus, pendingStatus, clearPendingStatus } = useContext(TicketStatusContext);
  const {
    pendingAssignedTo,
    pendingAssignedToUser,
    setPendingAssignedTo,
    setPendingAssignedToUser,
    clearPendingAssignedTo
  } = useContext(TicketAssignedToContext);
  const { description, clearDescription } = useContext(TicketDescriptionContext);
  const { hasFiles, clearFilesRef } = useContext(TicketFilesContext);

  const [updateTicket, { isLoading: isUpdatingTicket }] = useUpdateTicketMutation();
  const [addDetail, { isLoading: isAddingDetail }] = useAddTicketDetailMutation();

  // Get uploadAllFiles function from the hook (same instance used in TicketUpdateStatus)
  const { uploadAllFiles } = useTicketDetailAttachments(ticketId, null);

  const isLoading = isUpdatingTicket || isAddingDetail;

  // Get user permissions
  const { isBPOAdmin, isClientAdmin } = usePermissions();

  // Fetch assignable users to get user details when selected
  const { data: usersData } = useGetAssignableUsersQuery();

  // Determine if user can edit based on permissions
  // - BPO Admin: can edit everything
  // - Client Admin: can edit everything
  // - Client User: cannot edit anything
  const canEdit = isBPOAdmin() || isClientAdmin();

  const handlers = {
    onPriorityClick: canEdit ? () => setOpenPriorityModal(true) : undefined,
    onStatusClick: canEdit ? () => setOpenStatusModal(true) : undefined,
    onAssignedToClick: canEdit ? () => setOpenAssignedToModal(true) : undefined,
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
        // For assignedTo, pass the pending user object
        if (key === "assignedTo") {
          return fieldFormatters[config.formatter](
            displayValue,
            ticket,
            handlers,
            pendingAssignedToUser
          );
        }
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

  const handleAssignedToSelect = (userId) => {
    setPendingAssignedTo(userId);

    // Find the selected user from the users list
    const selectedUser = usersData?.data?.find(user => user.id === userId);
    if (selectedUser) {
      setPendingAssignedToUser(selectedUser);
    }

    setOpenAssignedToModal(false);
    console.log("Assigned to user:", selectedUser);
  };

  // Check if there are any changes
  const hasChanges = Boolean(
    pendingPriority ||
    pendingStatus ||
    pendingAssignedTo ||
    description.trim() ||
    hasFiles
  );

  const handleUpdate = async () => {
    if (!hasChanges) return;

    setError(null);

    try {
      // 1. Update ticket fields (priority, status, assignedTo) if there are changes
      const updateData = {};

      if (pendingPriority) {
        console.log('🎯 Updating priority to:', pendingPriority);
        updateData.priority = pendingPriority;
      }

      if (pendingStatus) {
        console.log('🎯 Updating status to:', pendingStatus);
        updateData.status = pendingStatus;
      }

      if (pendingAssignedTo) {
        console.log('🎯 Updating assignedTo to:', pendingAssignedTo);
        updateData.assignedToId = pendingAssignedTo;
      }

      if (Object.keys(updateData).length > 0) {
        await updateTicket({
          id: ticketId,
          ...updateData,
        }).unwrap();

        console.log('✅ Ticket fields updated successfully');

        // Clear pending changes
        if (pendingPriority) clearPendingPriority();
        if (pendingStatus) clearPendingStatus();
        if (pendingAssignedTo) clearPendingAssignedTo();
      }

      // 2. Create detail if there's a description
      let result = null;
      if (description.trim()) {
        console.log('📝 Creating detail for ticketId:', ticketId);
        result = await addDetail({
          id: ticketId,
          detail: description,
        }).unwrap();
        console.log('✅ Detail created successfully:', result);
      }

      // 3. Upload attachments if any and we created a detail
      if (hasFiles && result?.details) {
        // Get the newly created detail (last one in the array)
        const newDetail = result.details[result.details.length - 1];
        console.log('🎯 New detail to attach files to:', { detailId: newDetail.id });

        try {
          await uploadAllFiles(newDetail.id);
          console.log('✅ Files uploaded successfully');
        } catch (uploadError) {
          console.error("Error uploading attachments:", uploadError);
          setError("Update created but failed to upload some attachments");
          return;
        }
      }

      // Clear description and files
      clearDescription();
      if (clearFilesRef.current) {
        clearFilesRef.current();
      }

      // Show success
      setSuccessMessage(true);

      // Navigate after short delay
      setTimeout(() => {
        navigate("/app/tickets/ticketTable");
      }, 1000);
    } catch (err) {
      console.error("Failed to update ticket:", err);

      let errorMessage = "Failed to update ticket. Please try again.";

      if (err?.status === 400) {
        errorMessage = err?.data?.error || "Invalid request. Please check your input.";
      } else if (err?.status === 404) {
        errorMessage = "Ticket not found. It may have been deleted.";
      } else if (err?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err?.data?.error) {
        errorMessage = err.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    // Clear all pending changes
    clearPendingPriority();
    clearPendingStatus();
    clearPendingAssignedTo();
    clearDescription();
    if (clearFilesRef.current) {
      clearFilesRef.current();
    }
    setError(null);
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(false)}>
          {t("tickets.ticketView.updateSuccess") || "Update added successfully!"}
        </Alert>
      </Snackbar>

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

        {/* Update and Cancel Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: 3,
            justifyContent: "center",
          }}
        >
          <Button
            type="button"
            variant="contained"
            disabled={isLoading || !hasChanges}
            onClick={handleUpdate}
            sx={ticketStyle.updateButton}
          >
            {t("common.update")}
          </Button>
          <Button
            onClick={handleCancel}
            sx={ticketStyle.cancelButton}
            disabled={isLoading}
          >
            {t("common.cancel")}
          </Button>
        </Box>
      </Box>

      {/* Priority Change Modal */}
      {canEdit && (
        <TicketChangesRequest
          open={openPriorityModal}
          onClose={() => setOpenPriorityModal(false)}
          currentValue={pendingPriority || ticket.priority}
          onSelect={handlePrioritySelect}
          changeType="priority"
        />
      )}

      {/* Status Change Modal */}
      {canEdit && (
        <TicketChangesRequest
          open={openStatusModal}
          onClose={() => setOpenStatusModal(false)}
          currentValue={pendingStatus || ticket.status}
          onSelect={handleStatusSelect}
          changeType="status"
        />
      )}

      {/* Assigned To Change Modal */}
      {canEdit && (
        <TicketChangesRequest
          open={openAssignedToModal}
          onClose={() => setOpenAssignedToModal(false)}
          currentValue={pendingAssignedTo || ticket.assignedToId}
          onSelect={handleAssignedToSelect}
          changeType="assignedTo"
        />
      )}
    </>
  );
};

export default TicketInfoDetails;
