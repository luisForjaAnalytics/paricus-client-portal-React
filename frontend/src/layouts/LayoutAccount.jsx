import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AppBarLayout } from "./component/AppBarLayout";
import { useTranslation } from "react-i18next";
import { MenuSections } from "./component/menus/MenuSection.jsx";
import { Outlet } from "react-router-dom";
import { Language as LanguageIcon } from "@mui/icons-material";
import { colors } from "./style/styles";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          backgroundColor: colors.primario,
          color: "white",
          borderRight: "none",
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: colors.primario,
          color: "white",
          borderRight: "none",
        },
      }),
}));

export const LayoutAccount = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState("dashboard");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: "none", md: "flex" },
        }}
      >
        <DrawerHeader sx={{ justifyContent: "center" }}>
          {/* <Typography
            variant="subtitle1"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            {t("brand.name")}
          </Typography> */}
          <LanguageIcon sx={{ fontSize: 32, color: "white" }} />
        </DrawerHeader>
        <Divider
          sx={{
            width: "80%",
            height: 2.5,
            bgcolor: "rgba(255, 255, 255, 0.3)",
            alignSelf: "center",
            borderRadius: 2,
          }}
        />
        <List
          sx={{
            marginTop: { sx: "none", md: 4 },
            marginBottom: { sx: "none", md: 4 },
          }}
        >
          <MenuSections setTitleState={setTitleState} titleState={titleState} />
        </List>

        <Divider
          sx={{
            width: "80%",
            height: 3.5,
            bgcolor: "rgba(255, 255, 255, 0.3)",
            alignSelf: "center",
            borderRadius: 2,
          }}
        />

        <DrawerHeader>
          <IconButton>
            {open === false ? (
              <MenuIcon
                onClick={handleDrawerOpen}
                sx={[
                  {
                    color: "white",
                    marginRight: 0.3,
                  },
                  open && { display: "none" },
                ]}
              />
            ) : (
              <ChevronLeftIcon
                onClick={handleDrawerClose}
                sx={{ color: "white" }}
              />
            )}
          </IconButton>
        </DrawerHeader>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: "#ececec60", // gris claro
        }}
      >
        <AppBarLayout titleState={titleState} setTitleState={setTitleState} />
        <Box
          sx={{
            margin: { xs: "0 1.2rem 0 1.2rem", md: "1.5rem 1rem 0 1rem" },
          }}
        >
          <Outlet context={{ setTitleState }} />
        </Box>
      </Box>
    </Box>
  );
};
