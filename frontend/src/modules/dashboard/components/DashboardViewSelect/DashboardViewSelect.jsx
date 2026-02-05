import { Box, CircularProgress, Chip } from "@mui/material";
import { AlertInline } from "../../../../common/components/ui/AlertInline";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useGetDashboardStatsQuery } from "../../../../store/api/dashboardApi";
import { AnnouncementsInbox } from "../AnnouncementsInbox";
import { DashboardStatisticsView } from "../DashboardStatisticsView/DashboardStatisticsView";
import { ActiveTasks } from "../ActiveTasks";
import { MasterRepository } from "../MasterRepository";
import { SwiperView } from "../../../../common/components/ui/Swiper/SwiperView";
import { useGetCarouselImagesQuery } from "../../../../store/api/carouselApi";
import { getAttachmentUrl } from "../../../../common/utils/getAttachmentUrl";

/**
 * DashboardViewSelect - Displays dashboard content based on selected client/user
 * @param {Object} props
 * @param {number|null} props.selectedClientId - Client ID to filter data
 * @param {number|null} props.selectedUserId - User ID to simulate user view
 */
export const DashboardViewSelect = ({
  selectedClientId = null,
  selectedUserId = null,
}) => {
  const { t } = useTranslation();

  // Get user permissions and token
  const permissions = useSelector((state) => state.auth?.permissions);
  const token = useSelector((state) => state.auth?.token);
  const isBPOAdmin = permissions?.includes("admin_clients") ?? false;

  // Fetch carousel images
  const { data: carouselImages = [] } = useGetCarouselImagesQuery();

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useGetDashboardStatsQuery(selectedClientId, {
    // Refetch every 5 minutes
    pollingInterval: 300000,
    // Refetch when window regains focus
    refetchOnFocus: true,
  });

  /**
   * Handle retry on error
   */
  const handleRetry = () => {
    try {
      refetch();
    } catch (err) {
      console.error("Error refetching dashboard data:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      t(
        "dashboard.errorLoadingData",
        "Error loading dashboard data. Click to retry.",
      );

    return (
      <Box sx={{ p: 3 }}>
        <AlertInline
          message={errorMessage}
          severity="error"
          onClose={handleRetry}
          sx={{ cursor: "pointer" }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 3, md: 0 },
        paddingTop: { xs: 3, md: 3 },
      }}
    >
      {/* Selected Client Indicator */}
      {isBPOAdmin && stats?.selectedClient && (
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`${t("dashboard.viewing", "Viewing")}: ${stats.selectedClient.name}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      {/* Top Stats Cards */}
      <DashboardStatisticsView stats={stats} />

      {/* Main Content Grid: Announcements (50%) + Swiper (50%) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          mb: 3,
          gap: 3,
          height: "32vh",
          // minHeight: { xs: "auto", lg: "35vh" },
          // "& > *": {
          //   minHeight: { xs: "250px", lg: "100%" },
          //   height: "30vh",
          // },
        }}
      >
        {/* Announcements Inbox */}
        <AnnouncementsInbox />
        {/* Swiper — map API data into fixed 4-slot array */}
        <SwiperView
          images={Array.from({ length: 4 }, (_, i) => {
            const img = carouselImages.find((c) => c.slotIndex === i);
            if (!img) return null;
            return {
              previewUrl: getAttachmentUrl(img, token),
              name: img.fileName,
            };
          })}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr ",
          },
          gap: 3,
        }}
      >
        {/* Active Tasks */}
        <ActiveTasks
          selectedClientId={selectedClientId}
          selectedUserId={selectedUserId}
        />

        {/* Master Repository */}
        <MasterRepository />
      </Box>
    </Box>
  );
};

DashboardViewSelect.propTypes = {
  selectedClientId: PropTypes.number,
  selectedUserId: PropTypes.number,
};
