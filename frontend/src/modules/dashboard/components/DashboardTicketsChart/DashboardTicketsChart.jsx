import { useMemo } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Box, Typography, Skeleton } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { styled } from "@mui/material/styles";
import { useGetDashboardStatsQuery } from "../../../../store/api/dashboardApi";

// ====================== COMPANY COLORS ======================
const CompanyColors = [
  "rgb(66, 84, 251)",    // Blue
  "rgb(255, 180, 34)",   // Orange
  "rgb(250, 79, 88)",    // Red
  "rgb(13, 190, 255)",   // Cyan
  "rgb(123, 97, 255)",   // Purple
  "rgb(52, 211, 153)",   // Green
];

// ====================== CENTER LABEL ======================
const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
  fontWeight: "bold",
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

// ====================== MAIN COMPONENT ======================
export const DashboardTicketsChart = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  // Transform data for pie chart
  const chartData = useMemo(() => {
    if (!stats?.ticketsBySegment) return [];

    return stats.ticketsBySegment
      .filter((segment) => segment.count > 0) // Only show segments with tickets
      .map((segment, index) => ({
        id: segment.clientId,
        label: segment.clientName,
        value: segment.count,
        percentage: segment.percentage,
        color: CompanyColors[index % CompanyColors.length],
      }));
  }, [stats]);

  const totalTickets = stats?.totalTickets || 0;

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", p: 3 }}>
        <Skeleton variant="circular" width={200} height={200} sx={{ mx: "auto" }} />
        <Skeleton variant="text" width="80%" sx={{ mx: "auto", mt: 2 }} />
      </Box>
    );
  }

  // No data state
  if (chartData.length === 0) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No ticket data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      {/* ================= PIE + LEGEND ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 1,
          height: 'auto',

        }}
      >
        {/* ===== DONUT CHART ===== */}
        <PieChart
          hideLegend={true}
          series={[
            {
              innerRadius: 20,
              outerRadius: 50,
              data: chartData,
              highlightScope: { fade: "global", highlight: "item" },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
          ]}
          width={100}
          height={100}
          slotProps={{
            legend: { hidden: true },
          }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontSize: "12px",
            },
          }}
        >
          <PieCenterLabel>{totalTickets}</PieCenterLabel>
        </PieChart>

        {/* ===== LEGEND ===== */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {chartData.map((item) => (
            <Box
              key={item.id}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                <strong>{item.label}:</strong> {item.value} ({item.percentage}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
