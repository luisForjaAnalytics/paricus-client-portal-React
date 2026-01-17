import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  Chip,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { modalCard } from "../../../../../common/styles/styles";
import { useGetAssignableUsersQuery } from "../../../../../store/api/ticketsApi";

/**
 * Configuration for different change types
 */
const CHANGE_CONFIGS = {
  priority: {
    options: [
      {
        value: "low",
        label: "Low",
        styles: { backgroundColor: "#e3f2fd", color: "#1565c0" },
      },
      {
        value: "medium",
        label: "Medium",
        styles: { backgroundColor: "#fff3e0", color: "#e65100" },
      },
      {
        value: "high",
        label: "High",
        styles: { backgroundColor: "#ffebee", color: "#c62828" },
      },
    ],
    titleKey: "tickets.ticketView.changePriority",
  },
  status: {
    options: [
      {
        value: "open",
        label: "Open",
        styles: { backgroundColor: "#e3f2fd", color: "#1565c0" },
      },
      {
        value: "in progress",
        label: "In Progress",
        styles: { backgroundColor: "#fff3e0", color: "#e65100" },
      },
      {
        value: "resolved",
        label: "Resolved",
        styles: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
      },
      {
        value: "closed",
        label: "Closed",
        styles: { backgroundColor: "#f5f5f5", color: "#616161" },
      },
    ],
    titleKey: "tickets.ticketView.changeStatus",
  },
};

/**
 * TicketChangesRequest - Reusable modal component for changing ticket properties
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls modal visibility
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {string} props.currentValue - Current value of the field being changed
 * @param {Function} props.onSelect - Callback when a new value is selected
 * @param {string} props.changeType - Type of change: 'priority' or 'status'
 *
 * @example
 * // For Priority changes
 * <TicketChangesRequest
 *   open={openModal}
 *   onClose={() => setOpenModal(false)}
 *   currentValue={ticket.priority}
 *   onSelect={(newPriority) => handlePriorityChange(newPriority)}
 *   changeType="priority"
 * />
 *
 * @example
 * // For Status changes
 * <TicketChangesRequest
 *   open={openModal}
 *   onClose={() => setOpenModal(false)}
 *   currentValue={ticket.status}
 *   onSelect={(newStatus) => handleStatusChange(newStatus)}
 *   changeType="status"
 * />
 */
export const TicketChangesRequest = ({
  open,
  onClose,
  currentValue,
  onSelect,
  changeType = "priority",
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentValue);

  // Fetch assignable users only if changeType is "assignedTo"
  const { data: usersData, isLoading: loadingUsers } = useGetAssignableUsersQuery(undefined, {
    skip: changeType !== "assignedTo",
  });

  // Get configuration based on change type
  const config = CHANGE_CONFIGS[changeType];

  // For assignedTo, generate options from fetched users
  // Note: usersData is already the array after transformResponse in ticketsApi
  const options = changeType === "assignedTo" && Array.isArray(usersData)
    ? usersData.map(user => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
        sublabel: user.clientName || "",
        styles: {}, // No special styling for users
      }))
    : config?.options || [];

  if (!config && changeType !== "assignedTo") {
    console.error(`Invalid changeType: ${changeType}`);
    return null;
  }

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSelect(value);
    onClose();
  };

  // Reset selected value when modal opens with new current value
  const handleOpen = () => {
    setSelectedValue(currentValue);
  };

  // Get title based on changeType
  const getTitle = () => {
    if (changeType === "assignedTo") return t("tickets.ticketView.changeAssignedTo") || "Assign To";
    return config?.titleKey ? t(config.titleKey) : "Change";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onTransitionEnter={handleOpen}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: modalCard?.dialogSection,
        },
      }}
    >
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        {loadingUsers ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <List sx={{ pt: 1 }}>
            {options.map((option) => (
              <ListItem key={option.value} disablePadding>
                <ListItemButton
                  selected={selectedValue === option.value}
                  onClick={() => handleSelect(option.value)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    },
                  }}
                >
                  {changeType === "assignedTo" ? (
                    <Box display="flex" flexDirection="column" width="100%">
                      <Typography variant="body2" fontWeight="medium">
                        {option.label}
                      </Typography>
                      {option.sublabel && (
                        <Typography variant="caption" color="text.secondary">
                          {option.sublabel}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Chip
                      label={option.label}
                      sx={{
                        ...option.styles,
                        fontWeight: "medium",
                        fontSize: "0.875rem",
                        width: "100%",
                      }}
                      size="small"
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

TicketChangesRequest.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
  changeType: PropTypes.oneOf(["priority", "status", "assignedTo"]).isRequired,
};
