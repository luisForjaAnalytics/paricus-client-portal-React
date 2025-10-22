import DescriptionIcon from "@mui/icons-material/Description";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LocalAtmSharpIcon from "@mui/icons-material/LocalAtmSharp";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SettingsIcon from "@mui/icons-material/Settings";
import { ItemMenu } from "./ItemMenu";
import { ListItem, MenuItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Drawer menu //
const menuItems = [
  {
    label: "dashboard",
    icon: <LeaderboardIcon sx={{ color: "white" }} fontSize="large" />,
    route: "dashboard",
  },

  {
    label: "reporting",
    icon: <DescriptionIcon sx={{ color: "white" }} fontSize="large" />,
    route: "reporting",
  },

  {
    label: "audioRetrieval",
    icon: <VolumeUpIcon sx={{ color: "white" }} fontSize="large" />,
    route: "audio-recordings",
  },

  {
    label: "knowledgeBase",
    icon: <AutoStoriesIcon sx={{ color: "white" }} fontSize="large" />,
    route: "knowledge-base",
  },
  {
    label: "financial",
    icon: <LocalAtmSharpIcon sx={{ color: "white" }} fontSize="large" />,
    route: "financial",
  },
  {
    label: "reportsManagement",
    icon: <DescriptionIcon sx={{ color: "white" }} fontSize="large" />,
    route: "reports-management",
  },
  {
    label: "userManagement",
    icon: <SettingsIcon sx={{ color: "white" }} fontSize="large" />,
    route: "users-management",
  },
];

// Menu Avatar buttom //
const menuItemsAvatar = [
  {
    label: "myProfile",
    route: "users-profile",
  },
  {
    label: "userManagement",
    route: "users-management",
  },
];

export const MenuSections = () => {
  return (
    <>
      {menuItems.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <ItemMenu label={item.label} icon={item.icon} route={item.route} />
        </ListItem>
      ))}
    </>
  );
};

export const MenuSectionsAvatar = ({ handleCloseUserMenu }) => {
  const navigate = useNavigate();
  const handleMenuOption = (route) => {
    navigate(`/app/${route}`);
  };

  const { t } = useTranslation();
  return (
    <>
      {menuItemsAvatar.map((setting) => (
        <MenuItem
          key={setting}
          onClick={() => {
            handleCloseUserMenu();
            handleMenuOption(setting.route);
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            {t(`tooltips.${setting.label}`)}
          </Typography>
        </MenuItem>
      ))}
    </>
  );
};
