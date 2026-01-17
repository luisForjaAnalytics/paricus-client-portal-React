import { colors } from "../styles/styles";
// Priority

export const PRIORITY_STATUS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};
export const priorityStatesList = Object.values(PRIORITY_STATUS);
// Helper function for priority styles

export const getPriorityStyles = (priority) => {
  try {
    if (!priority || typeof priority !== "string") return "default";
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          backgroundColor: colors.priorityStyles.high.backgroundColor,
          color: colors.priorityStyles.high.color,
        };
      case "medium":
        return {
          backgroundColor: colors.priorityStyles.medium.backgroundColor,
          color: colors.priorityStyles.medium.color,
        };
      case "low":
        return {
          backgroundColor: colors.priorityStyles.low.backgroundColor,
          color: colors.priorityStyles.low.color,
        };
      default:
        return {
          backgroundColor: colors.priorityStyles.default.backgroundColor,
          color: colors.priorityStyles.default.color,
        };
    }
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }
};

// status

export const STATE_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
  CLOSE: "CLOSE",
};
export const statusStatesList = Object.values(STATE_STATUS);
// Helper function for status styles
export const getStatusStyles = (status) => {
  try {
    if (!status || typeof status !== "string") return "default";
    switch (status?.toLowerCase()) {
      case "open":
        return {
          backgroundColor: colors.statusStyles.open.backgroundColor,
          color: colors.statusStyles.open.color,
        };
      case "in progress":
        return {
          backgroundColor: colors.statusStyles.inProgress.backgroundColor,
          color: colors.statusStyles.inProgress.color,
        };
      case "resolved":
        return {
          backgroundColor: colors.statusStyles.resolved.backgroundColor,
          color: colors.statusStyles.resolved.color,
        };
      case "closed":
        return {
          backgroundColor: colors.statusStyles.closed.backgroundColor,
          color: colors.statusStyles.closed.color,
        };
      default:
        return {
          backgroundColor: colors.statusStyles.default.backgroundColor,
          color: colors.statusStyles.default.color,
        };
    }
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }
};
