import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  boxTypography,
  headerTitleBox,
  typography,
} from "../../common/styles/styles";
import { Outlet } from "react-router-dom";
import { HeaderBoxTypography } from "../../common/components/ui/HeaderBoxTypography/HeaderBoxTypography";

export const KnowledgeBaseView = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <HeaderBoxTypography text={t("tooltips.knowledgeBase")} />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};