import { Box, Chip, Card, CardContent, Typography } from "@mui/material";
import {
  Phone,
  PhoneCallback,
  TrendingUp,
  CheckCircle,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { dashboardStyles, colors } from "../../../../common/styles/styles";
import { isTargetAchieved } from "../../../../store/kpi/kpiSlice";

/**
 * StatCard - Desktop version with full details
 */
const StatCard = ({
  icon,
  value,
  label,
  badge,
  achieved,
  viewReportsText,
}) => {
  const badgeColor = achieved ? "success" : "error";

  return (
    <Card sx={dashboardStyles.dashboardStatsCard}>
      <CardContent
        sx={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
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
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
            }}
          >
            {/* Value */}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: colors.textPrimary,
                mb: 0.5,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
              }}
            >
              {value}
            </Typography>

            {/* Label with micro-typography */}
            <Typography sx={{ ...dashboardStyles.dashboardMicroLabel, mb: 2 }}>
              {label}
            </Typography>
          </Box>
          {/* Badge */}
          {badge && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={badge}
                color={badgeColor}
                size="small"
                sx={{
                  fontSize: { xs: "0.5rem", md: "0.8rem" },
                  fontWeight: "bold",
                  borderRadius: "1rem",
                }}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
          }}
        >
          {/* Value */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: colors.textPrimary,
              mb: 0.5,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
            }}
          >
            {value}
          </Typography>

          {/* Label with micro-typography */}
          <Typography sx={{ ...dashboardStyles.dashboardMicroLabel, mb: 2 }}>
            {label}
          </Typography>
        </Box>
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
  const kpi = useSelector((state) => state.kpi);

  const cardsData = [
    {
      icon: <Phone />,
      value: Number(kpi.callsOffered.value).toLocaleString(),
      label: t("dashboard.statistics.callsOffered"),
      badge: kpi.callsOffered.change,
      achieved: isTargetAchieved(kpi.callsOffered.value, kpi.callsOffered.target),
    },
    {
      icon: <PhoneCallback />,
      value: Number(kpi.callsAnswered.value).toLocaleString(),
      label: t("dashboard.statistics.callsAnswered"),
      badge: kpi.callsAnswered.change,
      achieved: isTargetAchieved(kpi.callsAnswered.value, kpi.callsAnswered.target),
    },
    {
      icon: <TrendingUp />,
      value: `${kpi.answerRate.value}%`,
      label: t("dashboard.statistics.answerRate"),
      badge: kpi.answerRate.change,
      achieved: isTargetAchieved(kpi.answerRate.value, kpi.answerRate.target),
    },
    {
      icon: <CheckCircle />,
      value: `${kpi.slaCompliance.value}%`,
      label: t("dashboard.statistics.slaCompliance"),
      badge: kpi.slaCompliance.change,
      achieved: isTargetAchieved(kpi.slaCompliance.value, kpi.slaCompliance.target),
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
        gap: 3,
        mb: 3,
      }}
    >
      {cardsData.map((card, index) => (
        <StatCard
          key={index}
          icon={card.icon}
          value={card.value}
          label={card.label}
          badge={card.badge}
          achieved={card.achieved}
          viewReportsText={t("dashboard.statistics.viewReports")}
        />
      ))}
    </Box>
  );
};
