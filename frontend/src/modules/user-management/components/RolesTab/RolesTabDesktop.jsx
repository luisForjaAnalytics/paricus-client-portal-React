import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { useTranslation } from "react-i18next";
import { PermissionsModal } from "./PermissionsModal";
import { FilterButton } from "../FilterButton/FilterButton";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";

/**
 * RolesTabDesktop - Desktop view for roles table
 * Receives all data via props from parent (index.jsx)
 * No internal hook calls - pure presentational component
 */
export const RolesTabDesktop = ({
  // Data from useRolesTableConfig (via parent)
  rows,
  columns,
  emptyMessage,
  // State
  isLoading,
  isOpen,
  setIsOpen,
  // Actions
  openAddDialog,
  // Permissions dialog props
  permissions,
  selectedPermissions,
  savePermissions,
  isUpdatingPermissions,
  handlePermissionToggle,
  permissionsDialog,
  closePermissionsDialog,
  selectedRole,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 3 }}>
      {/* Roles Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
        }}
      >
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 1,
            marginRight: 2,
            gap: 1,
          }}
        >
          <ActionButton
            handleClick={openAddDialog}
            icon={<AddIcon />}
            text={t("roles.addRole")}
          />

          {/* filter Button */}
          <FilterButton
            folderName="roles.filters"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          emptyMessage={emptyMessage}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
        />
      </Box>

      {/* Permissions Dialog */}
      <PermissionsModal
        permissionsDialog={permissionsDialog}
        closePermissionsDialog={closePermissionsDialog}
        selectedRole={selectedRole}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        savePermissions={savePermissions}
        isUpdatingPermissions={isUpdatingPermissions}
        onPermissionToggle={handlePermissionToggle}
      />
    </Box>
  );
};
