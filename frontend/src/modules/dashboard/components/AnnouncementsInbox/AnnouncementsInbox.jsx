import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {
  Notifications,
  AttachFile,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { TiptapReadOnly } from "../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { dashboardStyles, colors, modalCard, titlesTypography } from "../../../../common/styles/styles";
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
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const token = useSelector((state) => state.auth?.token);

  // Get announcements from API (filtered by user role on backend)
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useGetAnnouncementsQuery();

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
  const handleImageClick = (e, attachment) => {
    e.stopPropagation();
    setSelectedImage(attachment);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  // Handle announcement click to open modal
  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseAnnouncementModal = () => {
    setSelectedAnnouncement(null);
  };

  return (
    <Card sx={{ ...dashboardStyles.dashboardStatsCard, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
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
            {announcements.length > 0 && (
              <Chip
                label="New"
                color="error"
                size="small"
                sx={{ fontSize: "0.625rem", height: 20 }}
              />
            )}
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

        {/* Announcements List */}
        {!isLoading && !error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
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
                  onClick={() => handleAnnouncementClick(announcement)}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "pointer",
                    borderRadius: 1,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
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
                      {/* Title */}
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ mt: '0.2rem', textTransform: "uppercase" }}
                      >
                        {announcement.title}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{
                      mb: '-0.2rem'
                    }}>
                      {formatDateTime(announcement.createdAt)}
                    </Typography>
                  </Box>

                  {/* Content Preview - Limited to 4 lines */}
                  <Box
                    sx={{
                      backgroundColor: "white",
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      overflow: "hidden",
                      "& .ProseMirror": {
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  >
                    <TiptapReadOnly
                      content={announcement.content}
                      showErrorAlert={false}
                    />
                  </Box>

                  {/* Attachments indicator */}
                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                      <AttachFile sx={{ fontSize: "0.875rem", color: "text.secondary" }} />
                      <Typography variant="caption" color="text.secondary">
                        {announcement.attachments.length} {t("common.attachments", "attachment(s)")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))
            )}
          </Box>
        )}
      </CardContent>

      {/* Announcement Detail Modal */}
      <Dialog
        open={!!selectedAnnouncement}
        onClose={handleCloseAnnouncementModal}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: modalCard?.dialogSection,
          },
        }}
      >
        {selectedAnnouncement && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={handleCloseAnnouncementModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                <Chip
                  label={getPriorityLabel(selectedAnnouncement.priority, t)}
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    ...getPriorityStyles(selectedAnnouncement.priority),
                  }}
                />
                <Typography
                  sx={{
                    ...titlesTypography.primaryTitle,
                  }}
                >
                  {selectedAnnouncement.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(selectedAnnouncement.createdAt)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {/* Full Content */}
              <Box
                sx={{
                  backgroundColor: colors.background || "#f9fafb",
                  p: 2,
                  borderRadius: "1rem",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  mb: 2,
                }}
              >
                <TiptapReadOnly
                  content={selectedAnnouncement.content}
                  showErrorAlert={false}
                />
              </Box>

              {/* Attachments */}
              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    {t("tickets.ticketView.attachments", "Attachments")}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedAnnouncement.attachments.map((attachment) => (
                      <Chip
                        key={attachment.id}
                        icon={<AttachFile />}
                        label={attachment.fileName}
                        onClick={(e) => handleImageClick(e, attachment)}
                        size="small"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={handleCloseImageDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
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
