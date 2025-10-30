import React from "react";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";


export const ClientSummaryCard = ({
  payload,
  formatCurrency,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        mb: 3,
        gap: 3,
        width: "100%",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {payload.map((item, index) => {
        return (
          <Box flex={1}
          key={index}>
            <Card
              sx={{
                height: "100%",
                borderLeft: 4,
                borderColor: `${item.borderCol}`,
                borderRadius: "1rem",
                bgcolor: `${item.cardColor}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Avatar sx={{ bgcolor: item.icon.color }}>
                    {item.icon.icon}
                  </Avatar>
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color={item.borderCol}
                >
                  {formatCurrency(item.overallStatsInfo.tp1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.overallStatsInfo.tp2} {item.invoiceState}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};
