import { Box, CircularProgress, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../../../store/api/dashboardApi";
import { AnnouncementsInbox } from "../AnnouncementsInbox";
import { DashboardStatisticsView } from "../DashboardStatisticsView/DashboardStatisticsView";
import { ActiveTasks } from "../ActiveTasks";
import { MasterRepository } from "../MasterRepository";

export const DashboardViewSelect = () => {
  // Get user permissions to check if BPO Admin
  const permissions = useSelector((state) => state.auth.permissions);
  const isBPOAdmin = permissions?.includes("admin_clients");

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useGetDashboardStatsQuery(undefined, {
    // Refetch every 5 minutes
    pollingInterval: 300000,
    // Refetch when window regains focus
    refetchOnFocus: true,
  });

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
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={refetch}>
          Error loading dashboard data. Click to retry.
        </Alert>
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
      {/* Top Stats Cards */}
      <DashboardStatisticsView stats={stats} />

      {/* Main Content Grid: Quick Broadcast (60%) + Charts (40%) */}
      <Box
        sx={{
          mb: 2,
          height: "25vh", /// Announcements Inbox
        }}
      >
        {/* Announcements Inbox */}
        <AnnouncementsInbox />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Latest Interactions */}
        {/* <LatestInteractions /> */}

        {/* Active Tasks */}
        <ActiveTasks />

        {/* Master Repository */}
        <MasterRepository />
      </Box>
    </Box>
  );
};
