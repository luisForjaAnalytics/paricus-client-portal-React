import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import HeaderBoxTypography from "../../common/components/ui/HeaderBoxTypography/HeaderBoxTypography";
import { boxTypography } from "../../common/styles/styles";
import { ProfileFormView } from "./components/ProfileFormView";


export const ProfileView = () => {
  const { t } = useTranslation();

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header */}
      <HeaderBoxTypography text={t("profile.title")} />
      <Box>
        <ProfileFormView />
      </Box>
    </Box>
  );
};