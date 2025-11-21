import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { DashboardCards } from "./components/DashboardCards";
import { DashboardCards1 } from "./components/DashboardCards1";

const KpiCard = ({ title, value, trend, trendValue }) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (trend === "up") return theme.palette.success.main;
    if (trend === "down") return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const TrendIcon = trend === "up" ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card elevation={2} sx={{ borderRadius: "1.5rem" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h3"
          component="div"
          fontWeight={600}
          sx={{ mt: 1 }}
        >
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          {trend && (
            <>
              <TrendIcon
                sx={{ fontSize: 16, mr: 0.5, color: getTrendColor() }}
              />
              <Typography variant="body2" sx={{ color: getTrendColor() }}>
                {trendValue}
              </Typography>
            </>
          )}
          {!trend && (
            <Typography variant="body2" color="text.secondary">
              {trendValue}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const kpiData = [
    {
      title: "Service Level",
      value: "98.5%",
      trend: "up",
      trendValue: "1.2%",
    },
    {
      title: "Avg. Handle Time",
      value: "4m 32s",
      trend: "down",
      trendValue: "3.5%",
    },
    {
      title: "First Call Resolution",
      value: "89.1%",
      trend: "up",
      trendValue: "0.8%",
    },
    {
      title: "Agent Adherence",
      value: "94.2%",
      trend: null,
      trendValue: "-0.2%",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        margin: { xs: "0 0 0 0", md: "0 0 0 2rem" },
        height:"100%"
      }}
    >
      <Box
      >
        {kpiData.map((kpi, index) => (
          <Box sx={{ margin: "1rem 0 0 0" }} key={index}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          alignItems: "center",
          margin: { md: "1rem 0 0 6rem" },
          gap: 5,
        }}
      >
        <DashboardCards />
        <DashboardCards1 />
      </Box>
    </Box>
  );
};

export default Dashboard;
export { Dashboard as DashboardView };
