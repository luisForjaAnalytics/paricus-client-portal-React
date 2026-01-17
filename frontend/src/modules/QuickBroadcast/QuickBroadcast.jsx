import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { QuickBroadcastView } from "./components/QuickBroadcastView";
import { boxTypography } from "../../common/styles/styles";

export const QuickBroadcast = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <Typography variant="h5" sx={boxTypography.typography}>
        {t("quickBroadcast.title")}
      </Typography>
      <QuickBroadcastView />
    </Box>
  );
};
