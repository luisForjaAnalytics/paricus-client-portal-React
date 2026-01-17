import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  colors,
  primaryIconButton,
  titlesTypography,
  outlinedIconButton,
  modalCard,
} from "../../../../common/styles/styles";
import {
  menuItemsAdmin,
  menuItemsCommon,
} from "../../../../config/menu/MenusSection";
import { useGetPermissionsQuery } from "../../../../store/api/adminApi";
import { permissionSections } from "../../../../common/utils/permissionParser";

// Checkbox Permission component
const CheckboxList = ({ permission, selectedPermissions, t, onToggle, disabled }) => {
  const checked = selectedPermissions.includes(permission.id);

  const handleChecked = () => {
    if (disabled) return;
    onToggle(permission.id);
  };

  return (
    <List component="div" disablePadding>
      <ListItemButton sx={{ pl: 4 }} disabled={disabled}>
        <Checkbox
          checked={checked}
          disabled={disabled}
          sx={{ "&.Mui-checked": { color: colors.primary } }}
          onChange={handleChecked}
        >
          <StarBorder />
        </Checkbox>
        <ListItemText primary={t(`permission.${permission.permissionName}`)} />
      </ListItemButton>
    </List>
  );
};

const NestedList = ({ t, index, item, selectedPermissions, onToggle, disabled }) => {
  const [open, setOpen] = useState(false);

  // Don't render if no permissions
  if (!item?.permissionList || item.permissionList.length === 0) {
    return null;
  }

  return (
    <React.Fragment key={index}>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={t(`navigation.${item.label}`)} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {item.permissionList.map((permission) => (
          <CheckboxList
            key={permission.id}
            permission={permission}
            selectedPermissions={selectedPermissions}
            t={t}
            onToggle={onToggle}
            disabled={disabled}
          />
        ))}
      </Collapse>
    </React.Fragment>
  );
};

export const PermissionsModal = ({
  permissionsDialog,
  closePermissionsDialog,
  selectedRole,
  selectedPermissions,
  savePermissions,
  isUpdatingPermissions,
  onPermissionToggle,
}) => {
  const { t } = useTranslation();
  const { data: allPermissions = [] } = useGetPermissionsQuery();
  const authUser = useSelector((state) => state.auth.user);

  // Check if the selected role is the user's own role
  const isEditingOwnRole = selectedRole?.id === authUser?.roleId;

  // Helper to get permissions for a section
  const getPermissionsForSection = (sectionKey) => {
    const permissionNames = permissionSections[sectionKey] || [];
    return allPermissions.filter((p) => permissionNames.includes(p.permissionName));
  };

  // Build menu items with permission lists from API
  const menuItems = [
    ...menuItemsCommon.map((item) => ({
      ...item,
      permissionList: getPermissionsForSection(item.label),
    })),
    ...menuItemsAdmin.map((item) => {
      // Special handling for userManagement with subItems
      if (item.label === "userManagement" && item.subItems) {
        return {
          ...item,
          permissionList: getPermissionsForSection("userManagement"),
        };
      }
      return {
        ...item,
        permissionList: getPermissionsForSection(item.label),
      };
    }),
  ];

  return (
    <Dialog
      open={permissionsDialog}
      onClose={closePermissionsDialog}
      maxWidth="md"
      slotProps={{
        paper: { sx: modalCard?.dialogSection },
      }}
    >
      <DialogTitle>
        <Typography sx={titlesTypography.primaryTitle}>
          {t("roles.configurePermissions")} - {selectedRole?.role_name}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("roles.form.permissionsTitle")}
        </Typography>

        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {menuItems.map((item, index) => (
            <NestedList
              key={index}
              t={t}
              index={index}
              item={item}
              selectedPermissions={selectedPermissions}
              onToggle={onPermissionToggle}
              disabled={isEditingOwnRole}
            />
          ))}
        </List>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          px: 5,
          py: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={savePermissions}
          disabled={isUpdatingPermissions || isEditingOwnRole}
          sx={primaryIconButton}
        >
          {isUpdatingPermissions ? t("common.saving") : t("roles.actions.savePermissions")}
        </Button>
        <Button onClick={closePermissionsDialog} sx={outlinedIconButton}>
          {t("common.cancel")}
        </Button>
      </Box>
      {isEditingOwnRole && (
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ px: 5, pb: 2, display: "block" }}
        >
          {t("roles.cannotEditOwnRole")}
        </Typography>
      )}
    </Dialog>
  );
};
