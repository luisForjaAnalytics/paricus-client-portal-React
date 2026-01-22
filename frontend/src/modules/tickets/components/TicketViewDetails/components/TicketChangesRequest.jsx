import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  Chip,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors, modalCard } from "../../../../../common/styles/styles";
import { CancelButton } from "../../../../../common/components/ui/CancelButton/CancelButton";
import { useGetDepartmentsQuery } from "../../../../../store/api/ticketsApi";

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

  // Fetch departments only if changeType is "assignedTo" (now uses departments instead of users)
  const { data: departmentsData, isLoading: loadingDepartments } =
    useGetDepartmentsQuery(undefined, {
      skip: changeType !== "assignedTo",
    });

  // Get configuration based on change type
  const config = CHANGE_CONFIGS[changeType];

  // For assignedTo, generate options from fetched departments (not users)
  const options =
    changeType === "assignedTo" && Array.isArray(departmentsData)
      ? departmentsData.map((dept) => ({
          value: dept.id,
          label: dept.name,
          sublabel: "", // Responsible user hidden from UI
          styles: {}, // No special styling for departments
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
    if (changeType === "assignedTo")
      return t("tickets.ticketView.changeAssignedTo") || "Assign To";
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
        {loadingDepartments ? (
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
                      borderRadius: "1rem",
                    },
                    "&:hover": {
                      //backgroundColor: colors.primaryLight,
                      borderRadius: "1rem",
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
      <DialogActions
        sx={{
          justifyContent: "center",
          mb: "1rem",
        }}
      >
        <CancelButton handleClick={onClose} text={t("common.cancel")} />
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
