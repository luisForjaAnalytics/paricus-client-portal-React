import { Fragment, useState } from "react";
import PropTypes from "prop-types";
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
import { permissionSections, parentChildPermissions } from "../../../../common/utils/permissionParser";

// Checkbox Permission component
const CheckboxList = ({
  permission,
  selectedPermissions,
  t,
  onToggle,
  disabled,
  isChild,
}) => {
  const checked = selectedPermissions.includes(permission.id);

  const handleChecked = () => {
    if (disabled) return;
    onToggle(permission.id);
  };

  return (
    <List component="div" disablePadding>
      <ListItemButton
        sx={{
          pl: isChild ? 6 : 4,
          "&:hover": {
            borderRadius: "1.5rem",
          },
        }}
        disabled={disabled}
      >
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

// Parent checkbox with indeterminate support
const ParentCheckboxItem = ({
  permission,
  childIds,
  selectedPermissions,
  t,
  onToggle,
  disabled,
}) => {
  const allChildrenSelected = childIds.every((id) => selectedPermissions.includes(id));
  const someChildrenSelected = childIds.some((id) => selectedPermissions.includes(id));
  const isChecked = allChildrenSelected && selectedPermissions.includes(permission.id);
  const isIndeterminate = !allChildrenSelected && someChildrenSelected;

  const handleChecked = () => {
    if (disabled) return;
    onToggle(permission.id);
  };

  return (
    <List component="div" disablePadding>
      <ListItemButton
        sx={{
          pl: 4,
          "&:hover": {
            borderRadius: "1.5rem",
          },
        }}
        disabled={disabled}
      >
        <Checkbox
          checked={isChecked || isIndeterminate}
          indeterminate={isIndeterminate}
          disabled={disabled}
          sx={{
            "&.Mui-checked": { color: colors.primary },
            "&.MuiCheckbox-indeterminate": { color: colors.primary },
          }}
          onChange={handleChecked}
        />
        <ListItemText
          primary={t(`permission.${permission.permissionName}`)}
          primaryTypographyProps={{ fontWeight: "bold" }}
        />
      </ListItemButton>
    </List>
  );
};

const NestedList = ({
  t,
  index,
  item,
  selectedPermissions,
  onToggle,
  disabled,
  allPermissions,
}) => {
  const [open, setOpen] = useState(false);

  // Don't render if no permissions
  if (!item?.permissionList || item.permissionList.length === 0) {
    return null;
  }

  // Build a set of child permission names for quick lookup
  const childPermissionNames = new Set();
  Object.values(parentChildPermissions).forEach((children) => {
    children.forEach((name) => childPermissionNames.add(name));
  });

  return (
    <Fragment key={index}>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={t(`navigation.${item.label}`)} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {item.permissionList.map((permission) => {
          const childNames = parentChildPermissions[permission.permissionName];

          // Parent permission — render with indeterminate support
          if (childNames) {
            const childIds = childNames
              .map((name) => allPermissions.find((p) => p.permissionName === name)?.id)
              .filter(Boolean);

            return (
              <ParentCheckboxItem
                key={permission.id}
                permission={permission}
                childIds={childIds}
                selectedPermissions={selectedPermissions}
                t={t}
                onToggle={onToggle}
                disabled={disabled}
              />
            );
          }

          // Child permission — render indented
          if (childPermissionNames.has(permission.permissionName)) {
            return (
              <CheckboxList
                key={permission.id}
                permission={permission}
                selectedPermissions={selectedPermissions}
                t={t}
                onToggle={onToggle}
                disabled={disabled}
                isChild
              />
            );
          }

          // Normal permission
          return (
            <CheckboxList
              key={permission.id}
              permission={permission}
              selectedPermissions={selectedPermissions}
              t={t}
              onToggle={onToggle}
              disabled={disabled}
            />
          );
        })}
      </Collapse>
    </Fragment>
  );
};

export const PermissionsModal = ({
  permissionsDialog,
  closePermissionsDialog,
  selectedRole,
  selectedPermissions,
  initialPermissions = [],
  savePermissions,
  isUpdatingPermissions,
  onPermissionToggle,
  onBatchPermissionToggle,
}) => {
  const { t } = useTranslation();
  const { data: allPermissions = [] } = useGetPermissionsQuery();
  const authUser = useSelector((state) => state.auth.user);

  // Check if the selected role is the user's own role
  const isEditingOwnRole = selectedRole?.id === authUser?.roleId;

  // Check if permissions have changed from the initial state
  const hasChanges =
    selectedPermissions.length !== initialPermissions.length ||
    selectedPermissions.some((id) => !initialPermissions.includes(id));

  // Helper to get permissions for a section (preserves defined order)
  const getPermissionsForSection = (sectionKey) => {
    const permissionNames = permissionSections[sectionKey] || [];
    return permissionNames
      .map((name) => allPermissions.find((p) => p.permissionName === name))
      .filter(Boolean);
  };

  // Smart toggle: handles parent-child logic
  const handleSmartToggle = (permissionId) => {
    const permission = allPermissions.find((p) => p.id === permissionId);
    if (!permission) return;

    const childNames = parentChildPermissions[permission.permissionName];

    if (childNames) {
      // It's a parent permission — toggle parent + all children together
      const childIds = childNames
        .map((name) => allPermissions.find((p) => p.permissionName === name)?.id)
        .filter(Boolean);
      const allIds = [permissionId, ...childIds];

      const allSelected = allIds.every((id) => selectedPermissions.includes(id));
      onBatchPermissionToggle(allIds, allSelected ? "remove" : "add");
      return;
    }

    // Check if it's a child permission
    for (const [parentName, children] of Object.entries(parentChildPermissions)) {
      if (children.includes(permission.permissionName)) {
        const parentId = allPermissions.find((p) => p.permissionName === parentName)?.id;
        const isCurrentlySelected = selectedPermissions.includes(permissionId);

        if (isCurrentlySelected) {
          // Deselecting a child — only deselect parent if no other siblings remain
          const idsToRemove = [permissionId];
          if (parentId) {
            const siblingIds = children
              .map((name) => allPermissions.find((p) => p.permissionName === name)?.id)
              .filter(Boolean);
            const otherSelectedSiblings = siblingIds.filter(
              (id) => id !== permissionId && selectedPermissions.includes(id)
            );
            if (otherSelectedSiblings.length === 0) {
              idsToRemove.push(parentId);
            }
          }
          onBatchPermissionToggle(idsToRemove, "remove");
        } else {
          // Selecting a child — also select parent
          const idsToAdd = [permissionId];
          if (parentId && !selectedPermissions.includes(parentId)) {
            idsToAdd.push(parentId);
          }
          onBatchPermissionToggle(idsToAdd, "add");
        }
        return;
      }
    }

    // Normal permission — simple toggle
    onPermissionToggle(permissionId);
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
              onToggle={handleSmartToggle}
              disabled={isEditingOwnRole}
              allPermissions={allPermissions}
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
          disabled={isUpdatingPermissions || isEditingOwnRole || !hasChanges}
          sx={primaryIconButton}
        >
          {isUpdatingPermissions
            ? t("common.saving")
            : t("roles.actions.savePermissions")}
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

PermissionsModal.propTypes = {
  permissionsDialog: PropTypes.bool.isRequired,
  closePermissionsDialog: PropTypes.func.isRequired,
  selectedRole: PropTypes.object,
  selectedPermissions: PropTypes.array.isRequired,
  initialPermissions: PropTypes.array,
  savePermissions: PropTypes.func.isRequired,
  isUpdatingPermissions: PropTypes.bool,
  onPermissionToggle: PropTypes.func.isRequired,
  onBatchPermissionToggle: PropTypes.func.isRequired,
};
