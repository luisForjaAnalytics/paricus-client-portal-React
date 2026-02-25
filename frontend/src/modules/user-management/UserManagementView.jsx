import Box from "@mui/material/Box";
import { NavBarOptions } from "./components";
import { Outlet, useOutletContext } from "react-router-dom";
import { boxTypography } from "../../common/styles/styles";

export const UserManagementView = () => {
  const context = useOutletContext();
  const setTitleState = context?.setTitleState;

  return (
    <Box sx={boxTypography.box}>
      <NavBarOptions setTitleState={setTitleState} />
      <Outlet />
    </Box>
  );
};