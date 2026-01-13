import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../../../store/api/dashboardApi";
import { QuickBroadcast } from "../QuickBroadcast";
import { AnnouncementsInbox } from "../AnnouncementsInbox";
import { DashboardStatisticsView } from "../DashboardStatisticsView/DashboardStatisticsView";
import { LatestInteractions } from "../LatestInteractions";
import { ActiveTasks } from "../ActiveTasks";
import { MasterRepository } from "../MasterRepository";

export const DashboardViewSelect = () => {
  // Get user permissions to check if BPO Admin
  const permissions = useSelector((state) => state.auth.permissions);
  const isBPOAdmin = permissions?.includes('admin_clients');

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
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      {/* Header */}
      {/* <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            color: "text.primary",
          }}
        >
          BPO Command Center
        </Typography>
      </Box> */}

      {/* Top Stats Cards */}
      <DashboardStatisticsView stats={stats} />

      {/* Main Content Grid: Quick Broadcast (70%) + Charts (30%) */}
      <Box
        sx={{
           display: "grid",
          gridTemplateColumns: isBPOAdmin
            ? { xs: "1fr", lg: "60% 40%" }
            : "1fr",
          gap: 2,
          mb: 4,
        }}
      >
        {/* Quick Broadcast - Only for BPO Admin */}
        {isBPOAdmin && <QuickBroadcast />}

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
        <LatestInteractions />

        {/* Active Tasks */}
        <ActiveTasks />

        {/* Master Repository */}
        <MasterRepository />
      </Box>
    </Box>
  );
};
