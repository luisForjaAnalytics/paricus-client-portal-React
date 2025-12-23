import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { typography } from "../../common/styles/styles";
import { Outlet } from "react-router-dom";

export const TicketsView = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: typography.fontWeight.semibold,
          fontFamily: typography.fontFamily,
        }}
      >
        {t("tickets.sectionTitle")}
      </Typography>
      <Outlet />
    </Box>
  );
};
