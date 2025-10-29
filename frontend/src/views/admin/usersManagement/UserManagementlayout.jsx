import * as React from "react";
import Box from "@mui/material/Box";
import { NavBarOptions } from "./components/layout/NavBarOptions";
import { Outlet } from "react-router-dom";

export const UserManagementlayout = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <NavBarOptions />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
