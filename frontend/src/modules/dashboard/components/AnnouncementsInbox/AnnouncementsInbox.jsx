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
  Tooltip,
} from "@mui/material";
import {
  Notifications,
  AttachFile,
  Close as CloseIcon,
  PriorityHigh as PriorityHighIcon,
  Warning as WarningIcon,
  ArrowDownward as LowPriorityIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useModal } from "../../../../common/hooks";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { getAttachmentUrl } from "../../../../common/utils/getAttachmentUrl";
import { TiptapReadOnly } from "../../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { dashboardStyles, colors, modalCard, titlesTypography, scrollableContainer, imagePreview } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetAnnouncementsQuery } from "../../../../store/api/dashboardApi";
import { getPriorityStyles } from "../../../../common/utils/getStatusProperty";

const priorityConfig = {
  high: {
    icon: PriorityHighIcon,
    labelKey: "dashboard.announcementsInbox.highPriority",
  },
  medium: {
    icon: WarningIcon,
    labelKey: "dashboard.announcementsInbox.mediumPriority",
  },
  low: {
    icon: LowPriorityIcon,
    labelKey: "dashboard.announcementsInbox.lowPriority",
  },
};

const PriorityIndicator = ({ priority, t }) => {
  const key = priority?.toLowerCase() || "default";
  const config = priorityConfig[key];
  const styles = getPriorityStyles(priority);

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Tooltip title={t(config.labelKey)} arrow placement="top">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: styles.backgroundColor,
          cursor: "default",
        }}
      >
        <Icon sx={{ fontSize: "1rem", color: styles.color }} />
      </Box>
    </Tooltip>
  );
};

export const AnnouncementsInbox = () => {
  const { t } = useTranslation();
  const imageModal = useModal();
  const announcementModal = useModal();

  const token = useSelector((state) => state.auth?.token);

  // Get announcements from API (filtered by user role on backend)
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useGetAnnouncementsQuery();

  // Handle image click (needs stopPropagation to avoid triggering parent click)
  const handleImageClick = (e, attachment) => {
    e.stopPropagation();
    imageModal.open(attachment);
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
              ...scrollableContainer,
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
                  onClick={() => announcementModal.open(announcement)}
                  sx={{
                    mb: 2,
                    p: '0.5rem',
                    //px:'0.5',
                    //borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    cursor: "pointer",
                    borderRadius: '1rem',
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#4ee78611",
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
                      <PriorityIndicator priority={announcement.priority} t={t} />
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
                      mx:'0.5rem',
                      borderRadius: '1rem',
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
        open={announcementModal.isOpen}
        onClose={announcementModal.close}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: modalCard?.dialogSection,
          },
        }}
      >
        {announcementModal.data && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={announcementModal.close} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                <PriorityIndicator priority={announcementModal.data.priority} t={t} />
                <Typography
                  sx={{
                    ...titlesTypography.primaryTitle,
                  }}
                >
                  {announcementModal.data.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(announcementModal.data.createdAt)}
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
                  content={announcementModal.data.content}
                  showErrorAlert={false}
                />
              </Box>

              {/* Attachments */}
              {announcementModal.data.attachments && announcementModal.data.attachments.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    {t("tickets.ticketView.attachments", "Attachments")}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {announcementModal.data.attachments.map((attachment) => (
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
        open={imageModal.isOpen}
        onClose={imageModal.close}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={imageModal.close} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {imageModal.data && (
            <Box
              component="img"
              src={getAttachmentUrl(imageModal.data, token)}
              alt={imageModal.data.fileName}
              sx={imagePreview}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
