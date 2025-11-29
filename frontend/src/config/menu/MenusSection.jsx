import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { permissionListSection } from "../../common/utils/permissionParser";

// Permission per section
const {
  dashboard,
  reporting,
  audioRetrieval,
  knowledgeBase,
  financial,
  reportsManagement,
} = permissionListSection();

// Drawer menu - Exported for filtering in router
export const menuItemsCommon = [
  {
    label: "dashboard",
    icon: <LeaderboardOutlinedIcon fontSize="medium" />,
    route: "dashboard",
    permission: "view_dashboard",
    permissionList: dashboard,
  },
  {
    label: "reporting",
    icon: <DescriptionOutlinedIcon fontSize="medium" />,
    route: "reporting",
    permission: "view_reporting",
    permissionList: reporting,
  },
  {
    label: "audioRetrieval",
    icon: <VolumeUpOutlinedIcon fontSize="medium" />,
    route: "audio-recordings",
    permission: "view_interactions",
    permissionList: audioRetrieval,
  },
  {
    label: "knowledgeBase",
    icon: <AutoStoriesOutlinedIcon fontSize="medium" />,
    route: "knowledge-base/articles",
    permission: "view_knowledge_base",
    permissionList:knowledgeBase
  },
];

export const menuItemsAdmin = [
  {
    label: "financial",
    icon: <LocalAtmOutlinedIcon fontSize="medium" />,
    route: "financial",
    permission: "view_financials",
    permissionList: financial
  },
  {
    label: "reportsManagement",
    icon: <DescriptionOutlinedIcon fontSize="medium" />,
    route: "reports-management",
    permission: "admin_reports",
    permissionList: reportsManagement,
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
        permissionList: ["admin_clients"],
      },
      {
        label: "usersManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/users",
        permission: "admin_users",
        permissionList: ["admin_users"],
      },
      {
        label: "roleManagement",
        icon: <SettingsOutlinedIcon fontSize="medium" />,
        route: "users-management/rolesPermissions",
        permission: "admin_roles",
        permissionList: ["admin_roles"],
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
