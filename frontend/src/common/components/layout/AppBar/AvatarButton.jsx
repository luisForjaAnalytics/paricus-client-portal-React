import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { MenuSectionsAvatar } from "../Navigation/MenuSection";
import { useSelector } from "react-redux";

export const AvatarButton = ({ setTitleState }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userAuth = useSelector((item) => (item?.auth || {}).user);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0, marginLeft: 2, marginBottom: 1 }}>
      <Tooltip title="Open settings">
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
          onClick={handleOpenUserMenu}
          sx={{ p: 0 }}
        >
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuSectionsAvatar
          handleCloseUserMenu={handleCloseUserMenu}
          userAuth={userAuth}
          setTitleState={setTitleState}
        />
      </Menu>
    </Box>
  );
};

AvatarButton.propTypes = {
  setTitleState: PropTypes.func.isRequired,
};
