import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


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
    // <Box sx={{ margin: { xs: "0 3rem 0 3rem", md: "1.5rem 3rem 0 3rem" } }}>
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
              color: "#1a7e22ff", // Color del texto cuando está seleccionado
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1a7e22ff", // Color de la línea indicadora
            },
          }}
        >
          <Tab label={t("userManagement.clients.label")} {...a11yProps(0)} />
          <Tab label={t("userManagement.users.label")} {...a11yProps(1)} />
          <Tab
            label={t("userManagement.rolesPermissions.label")}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
    </>
  );
};
