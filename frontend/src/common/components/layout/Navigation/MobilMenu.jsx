import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { MenuSections } from "./MenuSection.jsx";
import { colors } from "../../../styles/styles";
import { usePermissions } from "../../../hooks/usePermissions";
import { menuItemsAdmin, menuItemsCommon } from "../../../../config/menu/MenusSection";

export const MobilMenu = () => {
  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState("dashboard");
  const { hasPermission } = usePermissions();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSetTitleState = (newTitle) => {
    setTitleState(newTitle);
    setOpen(false); // Close drawer only when navigating
  };

  // Filter menu items based on user permissions (same as desktop)
  const filteredCommonItems = useMemo(() =>
    menuItemsCommon.filter((item) =>
      item.permission ? hasPermission(item.permission) : true
    ), [hasPermission]
  );

  const filteredAdminItems = useMemo(() =>
    menuItemsAdmin.filter((item) => {
      if (item.permission && !hasPermission(item.permission)) return false;
      if (item.subItems) {
        const filteredSubs = item.subItems.filter((subItem) =>
          subItem.permission ? hasPermission(subItem.permission) : true
        );
        return filteredSubs.length > 0;
      }
      return true;
    }), [hasPermission]
  );

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Box
          component="img"
          src="/paricus_logo.jpeg"
          alt="Paricus Logo"
          sx={{
            width: 80,
            height: "auto",
            objectFit: "contain",
            borderRadius: "3rem",
          }}
        />
      </Box>
        <Divider
          sx={{
            width: "60%",
            height: 2.5,
            bgcolor: colors.border,
            alignSelf: "center",
            borderRadius: 2,
            mx: "auto",
            mb: 0,
          }}
        />

      <List>
        <MenuSections
          setTitleState={handleSetTitleState}
          titleState={titleState}
          filteredCommonItems={filteredCommonItems}
          filteredAdminItems={filteredAdminItems}
        />
      </List>
    </Box>
  );

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        sx={{ display: { md: "none" }, marginLeft: "-0.5rem" }}
      >
        <MenuOpenIcon sx={{ color: "white" }} fontSize={"large"} />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            background: colors.gradiantMobilPrimaryColor,
            color: "white",
            borderRight: "none",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </>
  );
};
