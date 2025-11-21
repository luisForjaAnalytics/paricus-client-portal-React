import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { MenuSections } from "./MenuSection.jsx";
import { colors } from "../../../styles/styles";

export const MobilMenu = () => {
  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState("dashboard");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSetTitleState = (newTitle) => {
    setTitleState(newTitle);
    setOpen(false); // Close drawer only when navigating
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <MenuSections setTitleState={handleSetTitleState} titleState={titleState} />
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
