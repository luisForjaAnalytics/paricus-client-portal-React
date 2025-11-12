import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Business as BusinessIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import {
  clientCard,
  clientCardSelected,
  colors,
  typography,
  spacing,
  titlesTypography,
} from "../../../layouts/style/styles";

export const ClientBreakdown = ({
  clientBreakdowns,
  selectedFolder,
  formatCurrency,
  selectClient,
}) => {
  const getInitials = (folderDisplay = "") => {
    try {
      const companyName = folderDisplay.trim().split(" ");
      const firstInitial = companyName[0]?.[0] || "";
      const lastInitial = companyName[companyName.length - 1]?.[0] || "";
      return `${firstInitial}${lastInitial}`.toUpperCase();
    } catch (err) {
      console.warn(`ERROR: ${err}`);
    }
  };

  return (
    <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
      <Typography
        sx={{
          ...titlesTypography.primaryTitle,
          mb: 2,
        }}
      >
        Client Breakdown
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: spacing.md / 8, // gap-6 (24px converted to MUI units)
          width: "100%",
        }}
      >
        {clientBreakdowns.map((client) => (
          <Box flex={1} key={client.folder}>
            <Card
              sx={{
                ...(selectedFolder === client.folder
                  ? clientCardSelected
                  : clientCard),
              }}
              onClick={() => selectClient(client.folder)}
            >
              <CardContent sx={{ p: spacing.gap5 / 8 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        color: colors.primary,
                        bgcolor: colors.financialClientAvatar,
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(client?.folderDisplay)}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          ...titlesTypography.sectionTitle,
                          marginTop: "0.5rem",
                        }}
                      >
                        {client.folderDisplay}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.small, // text-xs (12px)
                          color: colors.textMuted,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        {client.totalInvoices} invoices
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      color: colors.primary,
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                      },
                    }}
                  >
                    <OpenIcon />
                  </IconButton>
                </Box>

                <Divider
                  sx={{
                    width: selectedFolder === client.folder ? "100%" : "30%",
                    backgroundColor: "#ffffffff",
                    borderBottomWidth: 2,
                    borderRadius: "2rem",
                    transition: " 0.4s ease",
                    mx: "auto",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0.5rem 1rem 0 1rem",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.small, // text-xs (12px)
                        color: colors.textMuted,
                        fontFamily: typography.fontFamily,
                      }}
                    >
                      Revenue
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.body, // text-sm (14px)
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textPrimary,
                        fontFamily: typography.fontFamily,
                      }}
                    >
                      {formatCurrency(client.totalRevenue)}
                    </Typography>
                  </Box>
                  <Grid>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.small,
                        color: colors.textMuted,
                        fontFamily: typography.fontFamily,
                      }}
                    >
                      Outstanding
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.body,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textPrimary,
                        fontFamily: typography.fontFamily,
                      }}
                    >
                      {formatCurrency(client.outstandingBalance)}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.small,
                        color: colors.error,
                        fontFamily: typography.fontFamily,
                      }}
                    >
                      Overdue
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: typography.fontSize.body,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.error,
                        fontFamily: typography.fontFamily,
                      }}
                    >
                      {formatCurrency(client.overdueAmount)}
                    </Typography>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Empty State */}
        {clientBreakdowns.length === 0 && (
          <Grid>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <BusinessIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                No clients found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload invoices to see client data
              </Typography>
            </Box>
          </Grid>
        )}
      </Box>
    </Box>
  );
};
