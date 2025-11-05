import DescriptionIcon from "@mui/icons-material/Description";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LocalAtmSharpIcon from "@mui/icons-material/LocalAtmSharp";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { ItemMenu } from "./ItemMenu";
import {
  Divider,
  ListItem,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SingOutButton } from "./SingOutButton";

// Drawer menu //
const menuItems = [
  {
    label: "dashboard",
    icon: <LeaderboardIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "dashboard",
  },

  {
    label: "reporting",
    icon: <DescriptionIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "reporting",
  },

  {
    label: "audioRetrieval",
    icon: <VolumeUpIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "audio-recordings",
  },

  {
    label: "knowledgeBase",
    icon: <AutoStoriesIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "knowledge-base",
  },
  {
    label: "financial",
    icon: <LocalAtmSharpIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "financial",
  },
  {
    label: "reportsManagement",
    icon: <DescriptionIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "reports-management",
  },
  {
    label: "userManagement",
    icon: <SettingsIcon sx={{ color: "white" }} fontSize="medium" />,
    route: "users-management/clients",
  },
];

// Menu Avatar buttom //
const menuItemsAvatar = [
  {
    label: "myProfile",
    icon: <PersonIcon fontSize="small" />,
    route: "users-profile",
  },
  {
    label: "userManagement",
    icon: <SettingsIcon fontSize="small" />,
    route: "users-management",
  },
];

export const MenuSections = ({ setTitleState, titleState }) => {
  return (
    <>
      {menuItems.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <ItemMenu
            label={item.label}
            icon={item.icon}
            route={item.route}
            setTitleState={setTitleState}
            titleState={titleState}
          />
        </ListItem>
      ))}
    </>
  );
};

export const MenuSectionsAvatar = ({
  handleCloseUserMenu,
  userAuth,
  setTitleState,
}) => {
  const navigate = useNavigate();
  const handleMenuOption = (route) => {
    navigate(`/app/${route}`);
  };

  const { t } = useTranslation();
  return (
    <>
      <MenuItem
        onClick={handleCloseUserMenu}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography sx={{ textAlign: "justify", fontWeight: "bold" }}>
          {`${userAuth.firstName} ${userAuth.lastName}`}
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: "justify", color: "text.secondary" }}
        >
          {userAuth.email}
        </Typography>
      </MenuItem>

      <Divider />
      {menuItemsAvatar.map((setting, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            setTitleState(setting.label);
            handleMenuOption(setting.route);
            handleCloseUserMenu();
          }}
        >
          <ListItemIcon>{setting.icon}</ListItemIcon>
          <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
            {t(`tooltips.${setting.label}`)}
          </Typography>
        </MenuItem>
      ))}
      <SingOutButton />
    </>
  );
};
