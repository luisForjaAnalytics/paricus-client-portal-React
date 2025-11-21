import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { ItemMenu } from "./ItemMenu";
import { AccordionMenuItem } from "./AccordionMenuItem";
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
import { colors } from "../../../styles/styles";

// Drawer menu //
const menuItemsCommon = [
  {
    label: "dashboard",
    icon: <LeaderboardOutlinedIcon fontSize="medium" />,
    route: "dashboard",
  },

  {
    label: "reporting",
    icon: <DescriptionOutlinedIcon fontSize="medium" />,
    route: "reporting",
  },

  {
    label: "audioRetrieval",
    icon: <VolumeUpOutlinedIcon fontSize="medium" />,
    route: "audio-recordings",
  },

  {
    label: "knowledgeBase",
    icon: <AutoStoriesOutlinedIcon fontSize="medium" />,
    route: "knowledge-base/articles",
  },
];

const menuItemsAdmin = [
  // {
  //   label: "dashboard",
  //   icon: <LeaderboardOutlinedIcon fontSize="medium" />,
  //   route: "dashboard",
  // },

  // {
  //   label: "reporting",
  //   icon: <DescriptionOutlinedIcon fontSize="medium" />,
  //   route: "reporting",
  // },

  // {
  //   label: "audioRetrieval",
  //   icon: <VolumeUpOutlinedIcon fontSize="medium" />,
  //   route: "audio-recordings",
  // },

  // {
  //   label: "knowledgeBase",
  //   icon: <AutoStoriesOutlinedIcon fontSize="medium" />,
  //   route: "knowledge-base/articles",
  // },
  {
    label: "financial",
    icon: <LocalAtmOutlinedIcon fontSize="medium" />,
    route: "financial",
  },
  {
    label: "reportsManagement",
    icon: <DescriptionOutlinedIcon fontSize="medium" />,
    route: "reports-management",
  },
  {
    label: "userManagement",
    icon: <SettingsOutlinedIcon fontSize="medium" />,
    route: "users-management/clients",
    subItems: [
      {
        label: "clientManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/clients",
      },
      {
        label: "usersManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/users",
      },
      {
        label: "roleManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/rolesPermissions",
      },
    ],
  },
];

// Menu Avatar buttom //
const menuItemsAvatar = [
  {
    label: "myProfile",
    icon: <PersonOutlineIcon fontSize="small" />,
    route: "users-profile",
  },
  {
    label: "userManagement",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    route: "users-management",
  },
];

export const MenuSections = ({ setTitleState, titleState, open }) => {
  const isMobileDrawer = open === undefined;

  return (
    <>
      {menuItemsCommon.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          {isMobileDrawer && item.subItems ? (
            <AccordionMenuItem
              label={item.label}
              icon={item.icon}
              subItems={item.subItems}
              setTitleState={setTitleState}
              titleState={titleState}
            />
          ) : (
            <ItemMenu
              label={item.label}
              icon={item.icon}
              route={item.route}
              setTitleState={setTitleState}
              titleState={titleState}
              open={open}
            />
          )}
        </ListItem>
      ))}
      <Divider
        sx={{
          width: "60%",
          height: 3.5,
          bgcolor: colors.border,
          alignSelf: "center",
          borderRadius: 2,
          mx: "auto",
          mb: 0,
        }}
      />
      {menuItemsAdmin.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          {isMobileDrawer && item.subItems ? (
            <AccordionMenuItem
              label={item.label}
              icon={item.icon}
              subItems={item.subItems}
              setTitleState={setTitleState}
              titleState={titleState}
            />
          ) : (
            <ItemMenu
              label={item.label}
              icon={item.icon}
              route={item.route}
              setTitleState={setTitleState}
              titleState={titleState}
              open={open}
            />
          )}
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
