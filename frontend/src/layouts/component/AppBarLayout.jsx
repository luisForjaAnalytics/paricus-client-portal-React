import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { AvatarButton } from "./AvatarButton";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import { MobilMenu } from "./menus/MobilMenu";

// 🔹 Estilo de la barra de búsqueda
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "1.5rem",
  backgroundColor: alpha(theme.palette.grey[300], 0.7), // fondo gris claro
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[400], 0.9),
  },
  width: "80%",
  [theme.breakpoints.down("sm")]: {
    width: "180px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "black", // ícono de búsqueda negro
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black", // texto negro
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

export const AppBarLayout = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const menuId = "primary-search-account-menu";

  ///Avatar Menu///
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  ///  Menu Mobil ///
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon sx={{ color: "black" }} />
          </Badge>
        </IconButton>
        <p style={{ color: "black" }}>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon sx={{ color: "black" }} />
          </Badge>
        </IconButton>
        <p style={{ color: "black" }}>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle sx={{ color: "black" }} />
        </IconButton>
        <p style={{ color: "black" }}>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white", // barra blanca
          color: "black", // texto negro
          boxShadow: 2,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <MobilMenu />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 0,
              ml: { xs: 1, sm: 4 },
              display: { xs: "none", sm: "block" },
              fontWeight: "bold",
            }}
          >
            {t("navigation.dashboard")}
          </Typography>

          {/* Barra de búsqueda */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t("header.searchPlaceholder")}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>

          {/* ICONOS Y AVATAR */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              marginRight: "2.5rem",
              alignItems: "center",
            }}
          >
            {/* /// LanguageMenu /// */}
            <LanguageMenu />
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon sx={{ color: "black" }} />
              </Badge>
            </IconButton>
            <AvatarButton />
          </Box>

          {/* 🔹 MENÚ MÓVIL */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};
