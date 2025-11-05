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
import {
  primaryIconButton,
  outlinedIconButton,
} from "../../../layouts/style/styles";

export const ClientSummary = ({
  loading,
  refetchAllClients,
  formatCurrency,
  payload
}) => {
  return (
    <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="semibold">
          All Clients Summary
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<OpenIcon />}
            href="https://my.waveapps.com/login_external/"
            target="_blank"
            rel="noopener noreferrer"
            sx={primaryIconButton}
          >
            Wave Apps
          </Button>
          <Button
            variant="outlined"
            startIcon={
              loading ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            onClick={refetchAllClients}
            disabled={loading}
            sx={outlinedIconButton}
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
