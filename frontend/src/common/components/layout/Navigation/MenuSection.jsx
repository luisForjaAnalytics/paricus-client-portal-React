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

// Drawer menu - Exported for filtering in router
export const menuItemsCommon = [
  {
    label: "dashboard",
    icon: <LeaderboardOutlinedIcon fontSize="medium" />,
    route: "dashboard",
    permission: "view_dashboard",
  },
  {
    label: "reporting",
    icon: <DescriptionOutlinedIcon fontSize="medium" />,
    route: "reporting",
    permission: "view_reporting",
  },
  {
    label: "audioRetrieval",
    icon: <VolumeUpOutlinedIcon fontSize="medium" />,
    route: "audio-recordings",
    permission: "view_interactions",
  },
  {
    label: "knowledgeBase",
    icon: <AutoStoriesOutlinedIcon fontSize="medium" />,
    route: "knowledge-base/articles",
    permission: "view_knowledge_base",
  },
];

export const menuItemsAdmin = [
  {
    label: "financial",
    icon: <LocalAtmOutlinedIcon fontSize="medium" />,
    route: "financial",
    permission: "view_financials",
  },
  {
    label: "reportsManagement",
    icon: <DescriptionOutlinedIcon fontSize="medium" />,
    route: "reports-management",
    permission: "admin_reports",
  },
  {
    label: "userManagement",
    icon: <SettingsOutlinedIcon fontSize="medium" />,
    route: "users-management/clients",
    permission: "admin_users",
    subItems: [
      {
        label: "clientManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/clients",
        permission: "admin_clients",
      },
      {
        label: "usersManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/users",
        permission: "admin_users",
      },
      {
        label: "roleManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/rolesPermissions",
        permission: "admin_roles",
      },
    ],
  },
];

// Menu Avatar buttom //
export const menuItemsAvatar = [
  {
    label: "myProfile",
    icon: <PersonOutlineIcon fontSize="small" />,
    route: "users-profile",
    permission: null, // Everyone can access their profile
  },
  {
    label: "userManagement",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    route: "users-management",
    permission: "admin_users",
  },
];

export const MenuSections = ({
  setTitleState,
  titleState,
  open,
  filteredCommonItems = menuItemsCommon,
  filteredAdminItems = menuItemsAdmin
}) => {
  const isMobileDrawer = open === undefined;

  return (
    <>
      {filteredCommonItems.map((item, index) => (
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

      {filteredAdminItems.length > 0 && (
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
      )}

      {filteredAdminItems.map((item, index) => (
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
  filteredAvatarItems = menuItemsAvatar
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleMenuOption = (route) => {
    navigate(`/app/${route}`);
  };

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
      {filteredAvatarItems.map((setting, index) => (
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
