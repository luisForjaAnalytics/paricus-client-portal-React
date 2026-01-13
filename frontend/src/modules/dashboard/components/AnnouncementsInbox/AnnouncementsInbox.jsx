import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Notifications, AttachFile } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { TiptapReadOnly } from "../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { dashboardStyles } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetAnnouncementsQuery } from "../../../../store/api/dashboardApi";

const getPriorityColor = (priority) => {
  try {
    if (!priority || typeof priority !== "string") return "default";
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  } catch (error) {
    console.error("Error getting priority color:", error);
    return "default";
  }
};

const getPriorityLabel = (priority, t) => {
  try {
    if (!priority || typeof priority !== "string") return "N/A";
    switch (priority.toLowerCase()) {
      case "high":
        return t("dashboard.announcementsInbox.highPriority");
      case "medium":
        return t("dashboard.announcementsInbox.mediumPriority");
      case "low":
        return t("dashboard.announcementsInbox.lowPriority");
      default:
        return priority;
    }
  } catch (error) {
    console.error("Error getting priority label:", error);
    return priority || "N/A";
  }
};

export const AnnouncementsInbox = () => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Get announcements from API (filtered by user role on backend)
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useGetAnnouncementsQuery();

  // Handle attachment click
  const handleAttachmentClick = (attachment) => {
    try {
      if (!attachment) {
        console.error("Missing attachment data");
        return;
      }

      // Get token from Redux store
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        alert("Please login to view attachments");
        return;
      }

      // Use the URL that comes from the backend
      // Note: URL should NOT include /api prefix because VITE_API_URL already has it
      const url =
        attachment.url ||
        `/dashboard/announcements/${attachment.announcementId}/attachments/${attachment.id}/file`;

      // Add token as query parameter for authentication
      const urlWithToken = `${
        import.meta.env.VITE_API_URL
      }${url}?token=${token}`;

      console.log("Opening attachment URL:", urlWithToken);

      // Open file in new tab
      window.open(urlWithToken, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error handling attachment click:", error);
      alert("Failed to open file. Please try again.");
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
              <Notifications sx={{ fontSize: "1.25rem" }} />
            </Box>
            <AppText
              variant="body"
              sx={{
                ...dashboardStyles.dashboardSectionTitle,
              }}
            >
              {t("dashboard.announcementsInbox.title")}
            </AppText>
            <Chip
              label="New"
              color="error"
              size="small"
              sx={{ fontSize: "0.625rem", height: 20 }}
            />
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
              {t("common.error")}: {error?.data?.message || error?.message}
            </Typography>
          </Box>
        )}

        {/* Announcements List - Scrollable like TicketHistoricalInfo */}
        {!isLoading && !error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              maxHeight: 400,
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              },
            }}
          >
            {announcements.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  {t("dashboard.announcementsInbox.noAnnouncements")}
                </Typography>
              </Box>
            ) : (
              announcements.map((announcement) => (
                <Box
                  key={announcement.id}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  {/* Priority & Date */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={getPriorityLabel(announcement.priority, t)}
                      color={getPriorityColor(announcement.priority)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(announcement.createdAt)}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ mb: 1, textTransform: "uppercase" }}
                  >
                    {announcement.title}
                  </Typography>

                  {/* Attachments */}
                  {announcement.attachments &&
                    announcement.attachments.length > 0 && (
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {announcement.attachments.map((attachment) => (
                          <Chip
                            key={attachment.id}
                            label={attachment.fileName}
                            icon={<AttachFile sx={{ fontSize: "0.875rem" }} />}
                            size="small"
                            variant="outlined"
                            onClick={() => handleAttachmentClick(attachment)}
                            sx={{
                              maxWidth: "100%",
                              fontSize: "0.75rem",
                              height: "24px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.08)",
                                borderColor: "primary.main",
                              },
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}

                  {/* Content */}
                  <Box
                    sx={{
                      backgroundColor: "white",
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <TiptapReadOnly
                      content={announcement.content}
                      showErrorAlert={false}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
      </CardContent>

      {/* Snackbar for attachment notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};
