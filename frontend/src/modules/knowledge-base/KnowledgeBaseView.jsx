import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { boxWrapCards, typography } from "../../common/styles/styles";
import { Outlet } from "react-router-dom";

export const KnowledgeBaseView = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          {t("tooltips.knowledgeBase")}
        </Typography>
      </Box>
      <Box sx={boxWrapCards}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default KnowledgeBaseView;
