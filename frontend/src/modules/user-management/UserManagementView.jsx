import Box from "@mui/material/Box";
import { NavBarOptions } from "./components";
import { Outlet, useOutletContext } from "react-router-dom";

export const UserManagementView = () => {
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

export default UserManagementView;
