import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { typography } from "../../common/styles/styles";
import { Outlet } from "react-router-dom";

export const KnowledgeBaseView = () => {
  const { t } = useTranslation();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          Knowledge Base
        </Typography>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default KnowledgeBaseView;
