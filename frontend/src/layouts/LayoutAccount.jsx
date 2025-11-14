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
import { colors } from "./style/styles";
const drawerWidth = 260;

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
  width: "80px",
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
          backgroundColor: "white",
          color: colors.textPrimary,
          borderRight: `1px solid ${colors.border}`,
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: "white",
          color: colors.textPrimary,
          borderRight: `1px solid ${colors.border}`,
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
        <DrawerHeader sx={{ justifyContent: "center", py: 0 }}>
          <Box
            component="img"
            src="/paricus_logo.jpeg"
            alt="Paricus Logo"
            sx={{
              width: open ? 120 : 40,
              height: "auto",
              transition: "all 0.3s ease",
              objectFit: "contain",
            }}
          />
        </DrawerHeader>
        <Divider
          sx={{
            width: "70%",
            height: 2.5,
            bgcolor: colors.border,
            alignSelf: "center",
            borderRadius: 2,
          }}
        />
        <List
          sx={{
            marginTop: { sx: "none", md: 2 },
            marginBottom: { sx: "none", md: 10 },
          }}
        >
          <MenuSections
            setTitleState={setTitleState}
            titleState={titleState}
            open={open}
          />
        </List>

        <Divider
          sx={{
            width: "70%",
            height: 3.5,
            bgcolor: colors.border,
            alignSelf: "center",
            borderRadius: 2,
          }}
        />

        <DrawerHeader>
          <IconButton
          sx={{
            marginRight: '0.9rem',
          }}
          >
            {open === false ? (
              <MenuIcon
                onClick={handleDrawerOpen}
                sx={[
                  {
                    color: "grey.500",
                  },
                  open && { display: "none" },
                ]}
              />
            ) : (
              <ChevronLeftIcon
                onClick={handleDrawerClose}
                sx={{ color: colors.textPrimary }}
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
            margin: { xs: "0 1.2rem 0 1.2rem", md: "0 1rem 0 1rem" },
          }}
        >
          <Outlet context={{ setTitleState }} />
        </Box>
      </Box>
    </Box>
  );
};
