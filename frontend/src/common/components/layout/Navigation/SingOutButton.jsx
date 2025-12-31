import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../../../store/api/authApi";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import Logout from "@mui/icons-material/Logout";

export const SingOutButton = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleMenuOption = async () => {
    try {
      await logout();
      navigate(`/login`,{ replace: true });
    } catch (err) {
      console.log(`ERROR handleMenuOption: ${err}`);
    }
  };
  const { t } = useTranslation();
  return (
    <>
      <MenuItem onClick={handleMenuOption}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          {t(`userDropdown.signOut`)}
        </Typography>
      </MenuItem>
    </>
  );
};
