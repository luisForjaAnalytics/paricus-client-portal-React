import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const NavBarOptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [valueMenu, setalueMenu] = useState(0);

  const handleRedirect = () => {
    switch (valueMenu) {
      case 0:
        navigate(`/app/users-management/clients`);
        break;
      case 1:
        navigate(`/app/users-management/users`);
        break;
      case 2:
        navigate(`/app/users-management/rolesPermissions`);
        break;
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

useEffect(() => {
  switch (value) {
    case 0:
      navigate(`/app/users-management/clients`);
      break;
    case 1:
      navigate(`/app/users-management/users`);
      break;
    case 2:
      navigate(`/app/users-management/rolesPermissions`);
      break;
  }
}, [value, navigate]);

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
      <CustomTabPanel value={value} index={0}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          {t("userManagement.clients.title")}
        </Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          {t("userManagement.users.title")}
        </Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          {t("userManagement.rolesPermissions.title")}
        </Typography>
      </CustomTabPanel>
    </>
    // </Box>
  );
};
