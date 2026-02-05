import { Box, Chip, Card, CardContent, Typography } from "@mui/material";
import {
  Phone,
  PhoneCallback,
  TrendingUp,
  CheckCircle,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  dashboardStyles,
  colors,
  summaryCard,
} from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText";


/**
 * StatCardMobile - Mobile version styled like ClientSummaryMobile
 */
const StatCardMobile = ({ value, label, badge, borderColor }) => {
  return (
    <Card
      sx={{
        ...summaryCard,
        width: "100%",
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: "2.5rem",
        bgcolor: colors.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent
        sx={{
          padding: "0.5rem !important",
          textAlign: "center",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <AppText
          variant="small"
          color="muted"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            mb: 0.25,
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </AppText>
        <AppText
          variant="h3"
          sx={{
            mb: 0.25,
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </AppText>
        {badge && (
          <AppText
            variant="small"
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: colors.success,
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </AppText>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * StatCard - Desktop version with full details
 */
const StatCard = ({ icon, value, label, badge, badgeColor = "success", viewReportsText }) => {
  return (
    <Card sx={dashboardStyles.dashboardStatsCard}>
      <CardContent sx={{ padding: "1.5rem", display: "flex", flexDirection: "column", height: "100%" }}>
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
        <Typography sx={{ ...dashboardStyles.dashboardMicroLabel, mb: 2 }}>
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

  // Card data with colors for mobile
  const cardsData = [
    {
      icon: <Phone />,
      value: mockStats.callsOffered.toLocaleString(),
      label: t("dashboard.statistics.callsOffered"),
      badge: mockStats.callsOfferedChange,
      borderColor: colors.primary,
    },
    {
      icon: <PhoneCallback />,
      value: mockStats.callsAnswered.toLocaleString(),
      label: t("dashboard.statistics.callsAnswered"),
      badge: mockStats.callsAnsweredChange,
      borderColor: colors.success,
    },
    {
      icon: <TrendingUp />,
      value: mockStats.answerRate,
      label: t("dashboard.statistics.answerRate"),
      badge: mockStats.answerRateChange,
      borderColor: colors.warning || "#f59e0b",
    },
    {
      icon: <CheckCircle />,
      value: mockStats.slaCompliance,
      label: t("dashboard.statistics.slaCompliance"),
      badge: "EXCELLENT",
      borderColor: colors.info || "#3b82f6",
    },
  ];

  return (
    <Box>
      {/* Mobile View - 2x2 Grid like ClientSummaryMobile */}
      <Box
        sx={{
          display: { xs: "grid", md: "none" },
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 3,
        }}
      >
        {cardsData.map((card, index) => (
          <StatCardMobile
            key={index}
            value={card.value}
            label={card.label}
            badge={card.badge}
            borderColor={card.borderColor}
          />
        ))}
      </Box>

      {/* Desktop View - 4 columns */}
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "repeat(4, 1fr)",
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
            badgeColor="success"
            viewReportsText={t("dashboard.statistics.viewReports")}
          />
        ))}
      </Box>
    </Box>
  );
};
