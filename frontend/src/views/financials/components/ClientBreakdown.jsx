import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Business as BusinessIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";

export const ClientBreakdown = ({
  clientBreakdowns,
  selectedFolder,
  formatCurrency,
  selectClient,
}) => {
  return (
    <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
      <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
        Client Breakdown
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: "100%",
        }}
      >
        {clientBreakdowns.map((client) => (
          <Box flex={1} key={client.folder}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s",
                border: selectedFolder === client.folder ? 2 : 0,
                borderRadius: "1rem",
                borderColor: "primary.main",
                bgcolor:
                  selectedFolder === client.folder
                    ? "action.selected"
                    : "background.paper",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => selectClient(client.folder)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      <BusinessIcon color="primary" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="semibold">
                        {client.folderDisplay}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.totalInvoices} invoices
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" color="primary">
                    <OpenIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid >
                    <Typography variant="caption" color="text.secondary">
                      Revenue
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {formatCurrency(client.totalRevenue)}
                    </Typography>
                  </Grid>
                  <Grid >
                    <Typography variant="caption" color="text.secondary">
                      Outstanding
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="warning.main"
                    >
                      {formatCurrency(client.outstandingBalance)}
                    </Typography>
                  </Grid>
                  <Grid >
                    <Typography variant="caption" color="text.secondary">
                      Overdue
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="error.main"
                    >
                      {formatCurrency(client.overdueAmount)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Empty State */}
        {clientBreakdowns.length === 0 && (
          <Grid >
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
