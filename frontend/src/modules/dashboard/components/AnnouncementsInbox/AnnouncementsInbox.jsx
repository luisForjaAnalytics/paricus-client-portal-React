import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Notifications,
  AttachFile,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { TiptapReadOnly } from "../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { dashboardStyles } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetAnnouncementsQuery } from "../../../../store/api/dashboardApi";
import { getPriorityStyles } from "../../../../common/utils/getStatusProperty";


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
  const [selectedImage, setSelectedImage] = useState(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const firstAnnouncementRef = useRef(null);

  const token = useSelector((state) => state.auth?.token);

  // Get announcements from API (filtered by user role on backend)
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useGetAnnouncementsQuery();

  // Measure first announcement height and set container height
  useEffect(() => {
    if (firstAnnouncementRef.current && announcements.length > 0) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        const height = firstAnnouncementRef.current?.offsetHeight;
        if (height) {
          setContainerHeight(height + 16); // Add some padding
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [announcements]);

  // Build image URL with token (same pattern as TicketDescriptionInfo)
  const getImageUrl = (attachment) => {
    try {
      if (!attachment?.url || !token) {
        return null;
      }
      const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
      const fullUrl = `${baseUrl}${attachment.url}`;
      const finalUrl = `${fullUrl}?token=${encodeURIComponent(token)}`;
      return finalUrl;
    } catch (error) {
      console.error(`AnnouncementsInbox getImageUrl: ${error}`);
      return null;
    }
  };

  // Handle image click to open in dialog
  const handleImageClick = (attachment) => {
    setSelectedImage(attachment);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
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

        {/* Announcements List - Height adapts to first announcement */}
        {!isLoading && !error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              maxHeight: containerHeight || "auto",
              overflowY: announcements.length > 1 ? "auto" : "hidden",
              overflowX: "hidden",
              paddingRight: announcements.length > 1 ? 1 : 0,
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
              announcements.map((announcement, index) => (
                <Box
                  key={announcement.id}
                  ref={index === 0 ? firstAnnouncementRef : null}
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
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        ...getPriorityStyles(announcement.priority),
                      }}
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
                  {/* Attachments - Display as clickable attachment chips */}
                  {announcement.attachments &&
                    announcement.attachments.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {announcement.attachments.map((attachment) => (
                          <Chip
                            key={attachment.id}
                            icon={<AttachFile />}
                            label={attachment.fileName}
                            onClick={() => handleImageClick(attachment)}
                            size="small"
                            sx={{
                              cursor: "pointer",
                              mt: 1,
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                </Box>
              ))
            )}
          </Box>
        )}
      </CardContent>

      {/* Image Preview Dialog - Same as TicketDescriptionInfo */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogActions sx={{ p: 1 }}>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <Box
              component="img"
              src={getImageUrl(selectedImage)}
              alt={selectedImage.fileName}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
