import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { boxTypography } from "../../common/styles/styles";
import { HeaderBoxTypography } from "../../common/components/ui/HeaderBoxTypography/HeaderBoxTypography";

export const TicketsView = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <HeaderBoxTypography text={t("tickets.sectionTitle")} />

      {/* Nested Routes Content */}
      <Outlet />
    </Box>
  );
};
