import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Link,
} from "@mui/material";
import { VolumeUp, TrendingUp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { dashboardStyles, colors } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetRecentRecordingsQuery } from "../../../../store/api/dashboardApi";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const LatestInteractions = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    data: recordings = [],
    isLoading,
    error,
  } = useGetRecentRecordingsQuery();

  const locale = i18n.language === "es" ? es : enUS;

  const handleLink = () => {
    navigate("/app/audio-recordings");
  };

  const formatTimeAgo = (date) => {
    try {
      if (!date) return "N/A";
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "N/A";
      return formatDistanceToNow(parsedDate, {
        addSuffix: false,
        locale,
      });
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
              <VolumeUp sx={{ fontSize: "1.25rem" }} />
            </Box>
            <AppText
              variant="body"
              sx={{
                ...dashboardStyles.dashboardSectionTitle,
              }}
            >
              {t("dashboard.latestInteractions.title")}
            </AppText>
          </Box>
          <IconButton size="small">
            <TrendingUp fontSize="small" />
          </IconButton>
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

        {/* Recordings List */}
        {!isLoading && !error && (
          <Box>
            {recordings.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  {t("dashboard.latestInteractions.noRecordings")}
                </Typography>
              </Box>
            ) : (
              recordings.map((recording, index) => (
                <Box
                  key={recording.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    borderBottom:
                      index < recordings.length - 1
                        ? `1px solid ${colors.border}`
                        : "none",
                  }}
                >
                  {/* Audio Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: colors.primaryLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <VolumeUp
                      sx={{
                        fontSize: "1.25rem",
                        color: colors.primary,
                      }}
                    />
                  </Box>

                  {/* Recording Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {recording.interactionId ||
                        recording.interaction_id ||
                        `ID-${recording.id || index}`}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {formatTimeAgo(recording.startTime || new Date())}
                      {recording.callType && ` • ${recording.callType}`}
                      {recording.company && ` • ${recording.company}`}
                      {recording.agentName && ` • ${recording.agentName}`}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}

            {/* View All Button */}
            {recordings.length > 0 && (
              <Box sx={{ mt: 4.5, textAlign: "center" }}>
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
                  {t("dashboard.latestInteractions.viewAll")}
                </Link>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
