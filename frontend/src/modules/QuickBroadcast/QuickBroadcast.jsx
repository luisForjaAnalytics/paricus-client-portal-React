import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { QuickBroadcastView } from "./components/QuickBroadcastView";
import { boxTypography, headerTitleBox } from "../../common/styles/styles";
import { HeaderBoxTypography } from "../../common/components/ui/HeaderBoxTypography/HeaderBoxTypography";
import { SwiperControl } from "./components/SwiperControl";

export const QuickBroadcast = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      <HeaderBoxTypography text={t("quickBroadcast.title")} />
      <QuickBroadcastView />
      <SwiperControl/>
    </Box>
  );
};
