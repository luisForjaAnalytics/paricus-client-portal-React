import Box from "@mui/material/Box";
import { NavBarOptions } from "./components";
import { Outlet, useOutletContext } from "react-router-dom";

export const UserManagementView = () => {
  let setTitleState;
  try {
    const context = useOutletContext();
    setTitleState = context?.setTitleState;
  } catch (err) {
    console.error(`UserManagementView useOutletContext: ${err}`);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ px: { xs: 2, md: 1,  }, py: { xs: 2, md: 3 } }}>
        <NavBarOptions setTitleState={setTitleState} />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserManagementView;
