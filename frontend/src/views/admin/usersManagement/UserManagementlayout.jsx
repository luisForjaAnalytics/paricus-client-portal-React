import Box from "@mui/material/Box";
import { NavBarOptions } from "./components/navBarOptions/NavBarOptions";
import { Outlet, useOutletContext } from "react-router-dom";
import { boxWrapCards } from "../../../layouts/style/styles";

export const UserManagementlayout = () => {
  const { setTitleState } = useOutletContext();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ px: { xs: 2, md: 3, lg: 14 }, py: { xs: 2, md: 4 } }}>
        <NavBarOptions setTitleState={setTitleState} />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
