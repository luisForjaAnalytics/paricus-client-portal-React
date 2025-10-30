import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {

  Refresh as RefreshIcon,
  OpenInNew as OpenIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { ClientSummaryCard } from "./ClientSummaryCard";

export const ClientSummary = ({
  loading,
  refetchAllClients,
  formatCurrency,
  payload
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight="semibold">
          All Clients Summary
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<OpenIcon sx={{ display: { xs: "none", sm: "block" } }} />}
            href="https://my.waveapps.com/login_external/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ borderRadius: "0.5rem", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Wave Apps
          </Button>
          <Button
            variant="outlined"
            startIcon={
              loading ? <CircularProgress size={16} /> : <RefreshIcon sx={{ display: { xs: "none", sm: "block" } }} />
            }
            onClick={refetchAllClients}
            disabled={loading}
            sx={{ borderRadius: "0.5rem", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            {loading ? "Loading..." : "Refresh All"}
          </Button>
        </Stack>
      </Box>
      <ClientSummaryCard
        formatCurrency={formatCurrency}
        payload={payload}
      />
    </Box>
  );
};
