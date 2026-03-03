import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { useTranslation } from "react-i18next";
import { PermissionsModal } from "./PermissionsModal";
import { FilterButton } from "../FilterButton";
import { ActionButton } from "../../../../common/components/ui/ActionButton";

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
  initialPermissions,
  savePermissions,
  isUpdatingPermissions,
  handlePermissionToggle,
  handleBatchPermissionToggle,
  permissionsDialog,
  closePermissionsDialog,
  selectedRole,
}) => {
  const { t } = useTranslation();

  return (
    <>
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
        initialPermissions={initialPermissions}
        savePermissions={savePermissions}
        isUpdatingPermissions={isUpdatingPermissions}
        onPermissionToggle={handlePermissionToggle}
        onBatchPermissionToggle={handleBatchPermissionToggle}
      />
    </>
  );
};

RolesTabDesktop.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  openAddDialog: PropTypes.func.isRequired,
  permissions: PropTypes.array,
  selectedPermissions: PropTypes.array,
  initialPermissions: PropTypes.array,
  savePermissions: PropTypes.func.isRequired,
  isUpdatingPermissions: PropTypes.bool,
  handlePermissionToggle: PropTypes.func.isRequired,
  handleBatchPermissionToggle: PropTypes.func.isRequired,
  permissionsDialog: PropTypes.bool.isRequired,
  closePermissionsDialog: PropTypes.func.isRequired,
  selectedRole: PropTypes.object,
};
