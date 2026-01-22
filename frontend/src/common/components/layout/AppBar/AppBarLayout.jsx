import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import { AvatarButton } from "./AvatarButton";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import { MobilMenu } from "../Navigation/MobilMenu";
import { MenuSectionsAvatar } from "../Navigation/MenuSection";
import { colors, layout, typography } from "../../../styles/styles";
import { useSelector } from "react-redux";

// 🔹 Estilo de la barra de búsqueda (basado en STYLE_GUIDE.md)
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: layout.borderRadius.sm, // rounded-lg from style guide
  backgroundColor: colors.background, // bg-gray-50
  border: `1px solid ${colors.borderInput}`, // border-gray-300
  "&:hover": {
    backgroundColor: colors.surfaceHighest, // bg-gray-100
  },
  "&:focus-within": {
    borderColor: colors.focusRing, // focus:border-green-500
    boxShadow: `0 0 0 1px ${colors.focusRing}`, // focus:ring-green-500
  },
  width: "350px",
  maxWidth: "100%",
  transition: "all 250ms ease-in-out",
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
  color: colors.textMuted, // text-gray-500
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: colors.textPrimary, // text-gray-900
  fontSize: typography.fontSize.body, // text-sm (14px)
  fontFamily: typography.fontFamily,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    "&::placeholder": {
      color: colors.textMuted, // text-gray-500
      opacity: 1,
    },
  },
}));

export const AppBarLayout = ({ titleState, setTitleState }) => {
  const { t } = useTranslation();
  const userAuth = useSelector((item) => (item?.auth || {}).user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

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

  const mobileMenuId = "primary-search-account-menu-mobile";

  ///  Menu Mobil ///
  const renderMobileMenu = (
    <Menu
      sx={{ mt: "45px" }}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuSectionsAvatar
        handleCloseUserMenu={handleMobileMenuClose}
        userAuth={userAuth}
        setTitleState={setTitleState}
      />
    </Menu>
  );
  /// Nav Bar responsive features
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", md: "contents" },
        alignContent: "center",
        margin: { xs: "0.5rem 0 0 0rem", md: "0" },
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: { xs: colors.navBarColor, md: colors.surface },
          color: colors.textPrimary,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          borderBottom: `1px solid ${colors.border}`,
          borderRadius: { xs: "3rem", md: "0" },
          width: { xs: "94%", md: "100%" },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            padding: { xs: "0 0 0 0.5rem", md: 0 },
          }}
        >
          <MobilMenu />

          {/* Barra de búsqueda */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Search
              sx={{
                borderRadius: "2rem",
              }}
            >
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
              gap: 1,
            }}
          >
            {/* /// LanguageMenu /// */}
            <Box
              sx={{
                margin: "0 -0.5rem 0 0",
              }}
            >
              <LanguageMenu />
            </Box>
            <IconButton
              size="large"
              sx={{
                color: colors.textSecondary,
                "&:hover": {
                  backgroundColor: colors.background,
                },
              }}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <AvatarButton setTitleState={setTitleState} />
          </Box>

          {/* 🔹 MENÚ MÓVIL */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              padding: 0,
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                "& .MuiIconButton-root": {
                  color: colors.textWhite,
                },
              }}
            >
              <Box
                sx={{
                  margin: "0 -1.5rem 0 0",
                }}
              >
                <LanguageMenu />
              </Box>
            </Box>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              sx={{ color: colors.textWhite }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      
    </Box>
  );
};

AppBarLayout.propTypes = {
  titleState: PropTypes.string.isRequired,
  setTitleState: PropTypes.func.isRequired,
};
