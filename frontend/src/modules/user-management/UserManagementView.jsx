import Box from "@mui/material/Box";
import { NavBarOptions } from "./components";
import { Outlet, useOutletContext } from "react-router-dom";
import { boxTypography } from "../../common/styles/styles";

export const UserManagementView = () => {
  let setTitleState;
  try {
    const context = useOutletContext();
    setTitleState = context?.setTitleState;
  } catch (err) {
    console.error(`UserManagementView useOutletContext: ${err}`);
  }

  return (
    <Box sx={boxTypography.box}>
      <NavBarOptions setTitleState={setTitleState} />
      <Outlet />
    </Box>
  );
};