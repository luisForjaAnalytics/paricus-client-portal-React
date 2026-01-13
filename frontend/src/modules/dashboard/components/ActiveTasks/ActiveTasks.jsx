import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Link,
} from "@mui/material";
import { Assignment} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { dashboardStyles, colors } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetTicketsQuery } from "../../../../store/api/ticketsApi";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "urgent":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "default";
  }
};

export const ActiveTasks = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const handleLink = () => {
    navigate("/app/tickets/ticketTable");
  };

  // Get last 3 tickets
  const {
    data: tickets = [],
    isLoading,
    error,
  } = useGetTicketsQuery({
    limit: 3,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const locale = i18n.language === "es" ? es : enUS;

  const formatTimeLabel = (date) => {
    try {
      if (!date) return "N/A";
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "N/A";
      return formatDistanceToNow(parsedDate, { locale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

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
              sx={{
                ...dashboardStyles.dashboardSectionTitle,
              }}
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
        {error && (
          <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
            <Typography variant="body2">
              {t("common.error")}: {error?.message}
            </Typography>
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
              tickets.map((ticket, index) => (
                <Box
                  key={ticket.id}
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
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor:
                            getPriorityColor(ticket.priority) === "error"
                              ? colors.error
                              : getPriorityColor(ticket.priority) === "warning"
                              ? colors.warning
                              : colors.success,
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
                        {ticket.subject}
                      </Typography>
                    </Box>
                    <Chip
                      label={ticket.priority || "Medium"}
                      color={getPriorityColor(ticket.priority)}
                      size="small"
                      sx={{ fontSize: "0.625rem", height: 20 }}
                    />
                  </Box>

                  {/* Metadata */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ pl: 2 }}
                  >
                    {formatTimeLabel(ticket.createdAt)}
                  </Typography>
                </Box>
              ))
            )}

            {/* View All Button */}
            {tickets.length > 0 && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link
                  variant="caption"
                  onClick={handleLink}
                  underline="none"
                  sx={{
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
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
