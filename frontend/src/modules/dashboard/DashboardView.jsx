import { useTranslation } from "react-i18next";
import { boxTypography, typography } from "../../common/styles/styles";
import { Box, Typography } from "@mui/material";
import { DashboardViewSelect } from "./components/DashboardViewSelect/DashboardViewSelect";

export const DashboardView = () => {
  const { t } = useTranslation();
  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <Typography variant="h5" sx={boxTypography.typography}>
        {t("dashboard.title")}
      </Typography>
      <DashboardViewSelect />
    </Box>
  );
};
