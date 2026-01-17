import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { boxTypography, typography } from "../../common/styles/styles";
import { Outlet } from "react-router-dom";

export const KnowledgeBaseView = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={boxTypography.typography}>
          {t("tooltips.knowledgeBase")}
        </Typography>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default KnowledgeBaseView;
