import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { MenuSections } from "./MenuSection.jsx";
import { colors } from "../../style/styles";

export const MobilMenu = () => {
  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState("dashboard");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250}} role="presentation" onClick={toggleDrawer(false)} >
      <List>
        <MenuSections setTitleState={setTitleState} titleState={titleState} />
      </List>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(true)} sx={{ display: { md: "none" } }}>
        <MenuOpenIcon sx={{color:"white"}}/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: colors.primario,
            color: "white",
            borderRight: "none",
          },
        }}>
        {DrawerList}
      </Drawer>
    </>
  );
};
