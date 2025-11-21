import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import { ClientSummaryCard } from "./ClientSummaryCard";
import {
  primaryIconButton,
  outlinedIconButton,
  titlesTypography,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";

export const ClientSummaryDesktop = ({
  loading,
  refetchAllClients,
  formatCurrency,
  payload,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: { xs: "none", md: "block" }, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            ...titlesTypography.primaryTitle,
          }}
        >
          {t("financials.clientSummary.title")}
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
            {t("financials.clientSummary.waveAppsButton")}
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
            {loading ? t("financials.clientSummary.loading") : t("financials.clientSummary.refreshButton")}
          </Button>
        </Stack>
      </Box>
      <ClientSummaryCard formatCurrency={formatCurrency} payload={payload} />
    </Box>
  );
};
