import { useState, useMemo, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AppBarLayout } from "./AppBar/AppBarLayout";
import { useTranslation } from "react-i18next";

import { Outlet, useLocation } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { colors } from "../../styles/styles";
import {
  menuItemsAdmin,
  menuItemsCommon,
} from "../../../config/menu/MenusSection";
import { MenuSections } from "./Navigation/MenuSection";
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
          backgroundColor: colors.drawer,
          color: colors.textPrimary,
          borderRight: `1px solid ${colors.border}`,
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: colors.drawer,
          color: colors.textPrimary,
          borderRight: `1px solid ${colors.border}`,
        },
      }),
}));

// Helper function to get label from route path
const getLabelFromPath = (pathname) => {
  // Remove /app/ prefix and get the main route segment
  const path = pathname.replace("/app/", "");

  // Check all menu items (common and admin) for matching route
  const allItems = [...menuItemsCommon, ...menuItemsAdmin];

  for (const item of allItems) {
    // Check if the path starts with the item's route
    if (path.startsWith(item.route) || path === item.route) {
      return item.label;
    }
    // Check subItems if they exist - return parent label to keep parent menu active
    if (item.subItems) {
      for (const subItem of item.subItems) {
        if (path.startsWith(subItem.route) || path === subItem.route) {
          return item.label;
        }
      }
    }
  }

  // Default mappings for special routes
  if (path.startsWith("users-profile")) return "myProfile";
  if (path.startsWith("broadcast")) return "broadcast";

  return "dashboard"; // Default fallback
};

export const LayoutAccount = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState("dashboard");
  const { hasPermission } = usePermissions();

  // Sync titleState with current route
  useEffect(() => {
    const label = getLabelFromPath(location.pathname);
    setTitleState(label);
  }, [location.pathname]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  // Filter menu items based on user permissions
  const filteredCommonItems = useMemo(
    () =>
      menuItemsCommon.filter((item) =>
        item.permission ? hasPermission(item.permission) : true
      ),
    [hasPermission]
  );

  const filteredAdminItems = useMemo(
    () =>
      menuItemsAdmin.filter((item) => {
        if (item.permission && !hasPermission(item.permission)) return false;
        if (item.subItems) {
          const filteredSubs = item.subItems.filter((subItem) =>
            subItem.permission ? hasPermission(subItem.permission) : true
          );
          return filteredSubs.length > 0;
        }
        return true;
      }),
    [hasPermission]
  );

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
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
              filteredCommonItems={filteredCommonItems}
              filteredAdminItems={filteredAdminItems}
            />
          </List>

          <Box sx={{ marginTop: "auto" }}>
            <Divider
              sx={{
                width: "70%",
                height: 3.5,
                bgcolor: colors.border,
                alignSelf: "center",
                borderRadius: 2,
                mx: "auto",
                mb: 0,
              }}
            />

            <DrawerHeader>
              <IconButton
                sx={{
                  marginRight: "0.8rem",
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
          </Box>
        </Box>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <AppBarLayout titleState={titleState} setTitleState={setTitleState} />
        <Box
          sx={{
            margin: { xs: 0, md: "0 1rem 0 1rem" }, // Mobile: sin margin (controlado por boxTypography.box), Desktop: margin lateral
          }}
        >
          <Outlet context={{ setTitleState }} />
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutAccount;
