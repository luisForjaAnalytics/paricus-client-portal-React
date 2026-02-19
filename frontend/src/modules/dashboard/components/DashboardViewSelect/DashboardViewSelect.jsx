import { Box, Chip } from "@mui/material";
import { useOutletContext, useLocation } from "react-router-dom";
import { AlertInline } from "../../../../common/components/ui/AlertInline";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useGetDashboardStatsQuery } from "../../../../store/api/dashboardApi";
import { AnnouncementsInbox } from "../AnnouncementsInbox";
import { DashboardStatisticsView } from "../DashboardStatisticsView/DashboardStatisticsView";
import { ActiveTasks } from "../ActiveTasks";
import { MasterRepository } from "../MasterRepository";
import { SwiperView } from "../../../../common/components/ui/Swiper";
import { useGetCarouselImagesQuery } from "../../../../store/api/carouselApi";
import { getAttachmentUrl } from "../../../../common/utils/getAttachmentUrl";
import { LoadingProgress } from "../../../../common/components/ui/LoadingProgress";

/**
 * DashboardViewSelect - Displays dashboard content based on selected client/user
 * Desktop: all sections visible (no changes)
 * Mobile: shows only the active section based on current route
 *   - /kpi → DashboardStatisticsView
 *   - /swiper → SwiperView
 *   - /general-info → AnnouncementsInbox + ActiveTasks + MasterRepository
 */
export const DashboardViewSelect = () => {
  const { selectedClientId = null, selectedUserId = null } =
    useOutletContext() || {};
  const { t } = useTranslation();
  const location = useLocation();

  // Determine active mobile section from route
  const section = location.pathname.split("/").pop();

  // Get user permissions and token
  const permissions = useSelector((state) => state.auth?.permissions);
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);
  const isBPOAdmin = permissions?.includes("admin_clients") ?? false;

  // Fetch carousel images
  const carouselClientId = isBPOAdmin
    ? selectedClientId || undefined
    : user?.clientId;
  const { data: carouselImages = [] } =
    useGetCarouselImagesQuery(carouselClientId);
  const hasCarouselImages = carouselImages.length > 0;

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useGetDashboardStatsQuery(selectedClientId, {
    pollingInterval: 300000,
    refetchOnFocus: true,
  });

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
        <LoadingProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    const errorMessage =
      error?.data?.message || error?.message || t("dashboard.errorLoadingData");

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
            label={`${t("dashboard.viewing")}: ${stats.selectedClient.name}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      {/* Section KPI: Statistics — mobile: only on /kpi, desktop: always */}
      <Box
        sx={{
          display: {
            xs: section === "kpi" ? "block" : "none",
            md: "block",
          },
        }}
      >
        <DashboardStatisticsView />
      </Box>

      {/* Announcements + Swiper grid — mobile: both on /swiper, desktop: always */}
      <Box
        sx={{
          display: {
            xs: section === "swiper" ? "grid" : "none",
            md: "grid",
          },
          gridTemplateColumns: {
            xs: "1fr",
            lg: hasCarouselImages ? "1fr 1fr" : "1fr",
          },
          mb: 3,
          gap: 3,
          height: { xs: "auto", md: "32vh" },
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <AnnouncementsInbox />
        </Box>

        {hasCarouselImages && (
          <Box sx={{ minHeight: 0, overflow: "hidden" }}>
            <SwiperView
              images={Array.from({ length: 4 }, (_, i) => {
                const img = carouselImages.find((c) => c.slotIndex === i);
                if (!img) return null;
                return {
                  previewUrl: getAttachmentUrl(img, token),
                  name: img.fileName,
                };
              }).filter(Boolean)}
            />
          </Box>
        )}

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <AnnouncementsInbox />
        </Box>
      </Box>

      {/* Section General Info: Active Tasks + Master Repository */}
      <Box
        sx={{
          display: {
            xs: section === "general-info" ? "grid" : "none",
            md: "grid",
          },
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        <ActiveTasks
          selectedClientId={selectedClientId}
          selectedUserId={selectedUserId}
        />
        <MasterRepository />
      </Box>
    </Box>
  );
};
