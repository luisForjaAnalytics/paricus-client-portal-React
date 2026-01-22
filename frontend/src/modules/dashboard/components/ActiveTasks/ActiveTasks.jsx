import { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Link,
  Alert,
} from "@mui/material";
import { Assignment } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { dashboardStyles, colors } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetTicketsQuery } from "../../../../store/api/ticketsApi";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { getPriorityStyles } from "../../../../common/utils/getStatusProperty";

/**
 * ActiveTasks - Displays recent tickets/tasks on the dashboard
 * @param {Object} props
 * @param {number|null} props.selectedClientId - Client ID to filter tickets
 * @param {number|null} props.selectedUserId - User ID to simulate user view
 */
export const ActiveTasks = ({ selectedClientId = null, selectedUserId = null }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  /**
   * Handle navigation to ticket manager
   */
  const handleLink = useCallback(() => {
    try {
      navigate("/app/tickets/ticketTable");
    } catch (error) {
      console.error("Error navigating to tickets:", error);
    }
  }, [navigate]);

  // Build query params - userId takes priority to simulate user view
  const queryParams = useMemo(() => ({
    limit: 3,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(selectedUserId && { userId: selectedUserId }),
    ...(selectedClientId && !selectedUserId && { clientId: selectedClientId }),
  }), [selectedClientId, selectedUserId]);

  // Get last 3 tickets (filtered by userId or clientId if provided)
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useGetTicketsQuery(queryParams);

  // Get locale for date formatting
  const locale = useMemo(() =>
    i18n.language === "es" ? es : enUS,
    [i18n.language]
  );

  /**
   * Format date to relative time (e.g., "2 hours ago")
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted relative time
   */
  const formatTimeLabel = useCallback((date) => {
    try {
      if (!date) return t("common.notAvailable", "N/A");

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return t("common.notAvailable", "N/A");
      }

      return formatDistanceToNow(parsedDate, { locale, addSuffix: false });
    } catch (error) {
      console.error("Error formatting date:", error);
      return t("common.notAvailable", "N/A");
    }
  }, [locale, t]);

  /**
   * Get priority styles safely
   * @param {string} priority - Priority level
   * @returns {Object} Style object
   */
  const getSafePriorityStyles = useCallback((priority) => {
    try {
      return getPriorityStyles(priority) || { color: colors.textSecondary };
    } catch (error) {
      console.error("Error getting priority styles:", error);
      return { color: colors.textSecondary };
    }
  }, []);

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    try {
      refetch();
    } catch (error) {
      console.error("Error refetching tickets:", error);
    }
  }, [refetch]);

  return (
    <Card sx={dashboardStyles.dashboardStatsCard}>
      <CardContent sx={{ padding: "1rem" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={dashboardStyles.dashboardIconContainer}>
              <Assignment sx={{ fontSize: "1.25rem" }} />
            </Box>
            <AppText
              variant="body"
              sx={dashboardStyles.dashboardSectionTitle}
            >
              {t("dashboard.activeTasks.title")}
            </AppText>
          </Box>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Box sx={{ py: 2 }}>
            <Alert
              severity="error"
              onClose={handleRetry}
              sx={{ cursor: "pointer" }}
            >
              {error?.data?.message || t("dashboard.activeTasks.errorLoading", "Error loading tasks")}
            </Alert>
          </Box>
        )}

        {/* Tasks List */}
        {!isLoading && !error && (
          <Box>
            {tickets.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  {t("dashboard.activeTasks.noTasks")}
                </Typography>
              </Box>
            ) : (
              tickets.map((ticket, index) => {
                const priorityStyles = getSafePriorityStyles(ticket?.priority);

                return (
                  <Box
                    key={ticket?.id || index}
                    sx={{
                      py: 1.5,
                      borderBottom:
                        index < tickets.length - 1
                          ? `1px solid ${colors.border}`
                          : "none",
                    }}
                  >
                    {/* Priority Indicator */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: priorityStyles.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket?.subject || t("common.untitled", "Untitled")}
                        </Typography>
                      </Box>
                      <Chip
                        label={ticket?.priority || "Medium"}
                        size="small"
                        sx={{
                          fontSize: "0.625rem",
                          height: 20,
                          flexShrink: 0,
                          ml: 1,
                          ...priorityStyles,
                        }}
                      />
                    </Box>

                    {/* Metadata */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ pl: 2 }}
                    >
                      {formatTimeLabel(ticket?.createdAt)}
                    </Typography>
                  </Box>
                );
              })
            )}

            {/* View All Button */}
            {tickets.length > 0 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link
                  component="button"
                  variant="caption"
                  onClick={handleLink}
                  underline="none"
                  sx={{
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    "&:hover": {
                      color: colors.primary,
                    },
                  }}
                >
                  {t("dashboard.activeTasks.browseTaskManager")}
                </Link>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

ActiveTasks.propTypes = {
  selectedClientId: PropTypes.number,
  selectedUserId: PropTypes.number,
};
