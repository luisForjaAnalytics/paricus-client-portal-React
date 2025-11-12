import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  summaryCard,
  colors,
  typography,
  spacing,
} from "../../../layouts/style/styles";

export const ClientSummaryCard = ({ payload, formatCurrency }) => {
  return (
    <Box
      sx={{
        display: "flex",
        mb: 3,
        gap: spacing.md / 8, // gap-6 (24px converted to MUI units)
        width: "100%",
        flexDirection: { xs: "column", md: "row" },
              }}
    >
      {payload.map((item, index) => {
        return (
          <Box flex={1} key={index}>
            <Card
              sx={{
                ...summaryCard,
                height: "100%",
                borderLeft: `4px solid ${item.borderCol}`, // 4px left border for status
                bgcolor: colors.surface,
              }}
            >
              <CardContent sx={{padding:'1rem 0 0 1rem'  }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: typography.fontWeight.bold,
                      fontSize: typography.fontSize.small, // text-xs (12px)
                      color: colors.textMuted,
                      fontFamily: typography.fontFamily,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.h2,
                    fontWeight: typography.fontWeight.bold,
                    fontFamily: typography.fontFamily,
                    color: colors.textPrimary,
                  }}
                >
                  {formatCurrency(item.overallStatsInfo.tp1)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: typography.fontSize.small, // text-xs (12px)
                    color: colors.textMuted,
                    fontFamily: typography.fontFamily,
                  }}
                >
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
