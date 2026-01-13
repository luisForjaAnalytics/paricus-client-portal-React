import { Box, Chip, Card, CardContent, Typography, Button } from "@mui/material";
import {
  Phone,
  PhoneCallback,
  TrendingUp,
  CheckCircle,
  CalendarToday,
  Description,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { dashboardStyles, colors } from "../../../../common/styles/styles";


const StatCard = ({ icon, value, label, badge, badgeColor = "success", viewReportsText }) => {
  return (
    <Card sx={dashboardStyles.dashboardStatsCard}>
      <CardContent sx={{ padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
        
        sx={
          {
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between'
          }
        }
        >

        {/* Icon Container */}
        <Box
          sx={{
            ...dashboardStyles.dashboardIconContainer,
            mb: 2,
          }}
        >
          {icon}
        </Box>

        {/* Badge (if exists) */}
        {badge && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={badge}
              color={badgeColor}
              size="small"
              sx={{
                fontSize: "0.625rem",
                fontWeight: "bold",
                height: 20,
                borderRadius: "0.5rem",
              }}
            />
          </Box>
        )}
        </Box>

        {/* Value */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: colors.textPrimary,
            mb: 0.5,
            fontSize: "1.75rem",
          }}
        >
          {value}
        </Typography>

        {/* Label with micro-typography */}
        <Typography sx={{...dashboardStyles.dashboardMicroLabel, mb: 2}}>
          {label}
        </Typography>

        {/* View Reports Link */}
        {viewReportsText && (
          <Box sx={{ mt: "auto" }}>
            <Typography
              variant="caption"
              sx={{
                color: colors.primary,
                textTransform: "uppercase",
                fontWeight: "600",
                letterSpacing: "0.05em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {viewReportsText}
              <TrendingUp sx={{ fontSize: "0.875rem" }} />
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardStatisticsView = ({ stats }) => {
  const { t } = useTranslation();

  // Mock data for the stats cards
  const mockStats = {
    callsOffered: 1482,
    callsAnswered: 1314,
    answerRate: "88.6%",
    slaCompliance: "99.4%",
    callsOfferedChange: "+12.5%",
    callsAnsweredChange: "+8.2%",
    answerRateChange: "+2.4%",
  };

  return (
    <Box>
      {/* Top Row - 4 Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <StatCard
          icon={<Phone />}
          value={mockStats.callsOffered.toLocaleString()}
          label={t("dashboard.statistics.callsOffered")}
          badge={mockStats.callsOfferedChange}
          badgeColor="success"
          viewReportsText={t("dashboard.statistics.viewReports")}
        />

        <StatCard
          icon={<PhoneCallback />}
          value={mockStats.callsAnswered.toLocaleString()}
          label={t("dashboard.statistics.callsAnswered")}
          badge={mockStats.callsAnsweredChange}
          badgeColor="success"
          viewReportsText={t("dashboard.statistics.viewReports")}
        />

        <StatCard
          icon={<TrendingUp />}
          value={mockStats.answerRate}
          label={t("dashboard.statistics.answerRate")}
          badge={mockStats.answerRateChange}
          badgeColor="success"
          viewReportsText={t("dashboard.statistics.viewReports")}
        />

        <StatCard
          icon={<CheckCircle />}
          value={mockStats.slaCompliance}
          label={t("dashboard.statistics.slaCompliance")}
          badge="EXCELLENT"
          badgeColor="success"
          viewReportsText={t("dashboard.statistics.viewReports")}
        />
      </Box>

    </Box>
  );
};
