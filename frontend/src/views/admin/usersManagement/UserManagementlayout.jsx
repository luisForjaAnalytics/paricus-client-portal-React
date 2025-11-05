import Box from "@mui/material/Box";
import { NavBarOptions } from "./components/layout/NavBarOptions";
import { Outlet, useOutletContext } from "react-router-dom";

export const UserManagementlayout = () => {
  const { setTitleState } = useOutletContext();

  return (
    <Box sx={{ width: "100%" }}>
      <NavBarOptions setTitleState={setTitleState} />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
