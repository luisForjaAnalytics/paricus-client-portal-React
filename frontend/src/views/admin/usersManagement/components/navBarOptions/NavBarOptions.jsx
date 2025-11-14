import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { colors, titlesTypography} from "../../../../../layouts/style/styles";
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
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
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
  }, [value, navigate, setTitleState]);

  return (
      <>
      <Box sx={{ borderBottom: 0, borderColor: "divider"}}>
        <Tabs
          value={value}
          onChange={handleChange}
          //aria-label="basic tabs example"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none", // Desactiva mayúsculas
              color: "#1a7e22ff 0%", // Color del texto cuando no está seleccionado
            },
            "& .Mui-selected": {
              color: `black !important`, // Color del texto cuando está seleccionado
            },
            "& .MuiTabs-indicator": {
              backgroundColor: `${colors.primary}`, // Color de la línea indicadora
            },
          }}
        >
          <Tab
            label={
              <Typography
                sx={
                  titlesTypography.sectionTitle
                }
              >
                {t("userManagement.clients.title")}
              </Typography>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Typography
                sx={
                  titlesTypography.sectionTitle
                }
              >
                {t("userManagement.users.title")}
              </Typography>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <Typography
                sx={
                  titlesTypography.sectionTitle
                }
              >
                {t("userManagement.rolesPermissions.title")}
              </Typography>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
    </>
  );
};
