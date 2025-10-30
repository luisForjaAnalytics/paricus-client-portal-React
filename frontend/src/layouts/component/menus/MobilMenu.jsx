import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { MenuSections } from "./MenuSection.jsx";

export const MobilMenu = () => {
  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState("dashboard");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250, }} role="presentation" onClick={toggleDrawer(false)} >
      <List>
        <MenuSections setTitleState={setTitleState} titleState={titleState} />
      </List>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(true)} sx={{ display: { md: "none" } }}>
        <MenuOpenIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}  sx={{
          "& .MuiDrawer-paper": {
            background:
              "linear-gradient(to bottom, #0c7b3f 0%, #339137ff 100%)",
            color: "white",
            borderRight: "none",
          },
        }}>
        {DrawerList}
      </Drawer>
    </>
  );
};
