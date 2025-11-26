import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { colors, titlesTypography } from "../../../../common/styles/styles";
import { Typography } from "@mui/material";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const NavBarOptions = ({ setTitleState }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  // Check if user is BPO Admin or Client Admin
  const isBPOAdmin = authUser?.permissions?.includes("admin_users");
  const isClientAdmin = authUser?.permissions?.includes("view_invoices") && !isBPOAdmin;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // For Client Admins (2 tabs: Users, Roles)
    if (isClientAdmin) {
      switch (value) {
        case 0:
          navigate(`/app/users-management/users`);
          if (setTitleState) setTitleState("usersManagement");
          break;
        case 1:
          navigate(`/app/users-management/rolesPermissions`);
          if (setTitleState) setTitleState("roleManagement");
          break;
      }
      return;
    }

    // For BPO Admins (3 tabs: Clients, Users, Roles)
    switch (value) {
      case 0:
        navigate(`/app/users-management/clients`);
        if (setTitleState) setTitleState("clientManagement");
        break;
      case 1:
        navigate(`/app/users-management/users`);
        if (setTitleState) setTitleState("usersManagement");
        break;
      case 2:
        navigate(`/app/users-management/rolesPermissions`);
        if (setTitleState) setTitleState("roleManagement");
        break;
    }
  }, [value, navigate, setTitleState, isClientAdmin]);

  return (
    <>
      <Box sx={{ borderBottom: 0, display: { xs: "none", md: "contents" } }}>
        {/* Client Admins: Show Users and Roles tabs (2 tabs) */}
        {isClientAdmin ? (
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              "& .MuiTab-root": {
                color: "#1a7e22ff 0%",
              },
              "& .Mui-selected": {
                color: `black !important`,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: `${colors.primary}`,
              },
            }}
          >
            <Tab
              label={
                <Typography sx={titlesTypography.managementSection}>
                  {t("userManagement.users.title")}
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Typography sx={titlesTypography.managementSection}>
                  {t("userManagement.rolesPermissions.title")}
                </Typography>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        ) : (
          /* BPO Admins: Show all tabs (3 tabs) */
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              "& .MuiTab-root": {
                color: "#1a7e22ff 0%",
              },
              "& .Mui-selected": {
                color: `black !important`,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: `${colors.primary}`,
              },
            }}
          >
            <Tab
              label={
                <Typography sx={titlesTypography.managementSection}>
                  {t("userManagement.clients.title")}
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Typography sx={titlesTypography.managementSection}>
                  {t("userManagement.users.title")}
                </Typography>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Typography sx={titlesTypography.managementSection}>
                  {t("userManagement.rolesPermissions.title")}
                </Typography>
              }
              {...a11yProps(2)}
            />
          </Tabs>
        )}
      </Box>
    </>
  );
};

export default NavBarOptions;
