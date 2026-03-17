import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { MenuSectionsAvatar } from "../Navigation/MenuSection";
import { useSelector } from "react-redux";
import { navBar, colors } from "../../../styles/styles";
import { getAvatarSrc } from "../../../../modules/profile";

export const AvatarButton = ({ setTitleState }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userAuth = useSelector((item) => (item?.auth || {}).user);

  const initials = React.useMemo(() => {
    const first = userAuth?.firstName?.[0] || "";
    const last = userAuth?.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  }, [userAuth?.firstName, userAuth?.lastName]);

  const avatarSrc = React.useMemo(
    () => getAvatarSrc(userAuth?.avatarUrl),
    [userAuth?.avatarUrl],
  );

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0, marginBottom: 1 }}>
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
          <Avatar
            src={avatarSrc}
            sx={{
              color: colors.primary,
              bgcolor: colors.financialClientAvatar,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {!avatarSrc && initials}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={navBar.menuAvatar}
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
