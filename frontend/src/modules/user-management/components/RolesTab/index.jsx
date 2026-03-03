import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { useNotification } from "../../../../common/hooks";
import { MobileFilterPanel } from "../../../../common/components/ui/MobileFilterPanel";
import { MobileSpeedDial } from "../../../../common/components/ui/MobileSpeedDial";
import { RolesTabDesktop } from "./RolesTabDesktop";
import { RolesTabMobile } from "./RolesTabMobile";
import { AddNewRoleModal } from "./AddNewRoleModal";
import { ViewPermissionsModal } from "./ViewPermissionsModal";
import { useRolesTableConfig } from "./useRolesTableConfig";
import { AlertInline } from "../../../../common/components/ui/AlertInline";
import { formatDate as formatDateUtil } from "../../../../common/utils/formatters";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetClientsQuery,
  useGetPermissionsQuery,
  useLazyGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
} from "../../../../store/api/adminApi";
import { extractApiError } from "../../../../common/utils/apiHelpers";

/**
 * Componente unificado RolesTab que maneja la lógica de datos
 * y renderiza la versión móvil o desktop según el breakpoint actual.
 */
export const RolesTab = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const authUser = useSelector((state) => state.auth.user);
  const { notificationRef, showNotification } = useNotification();

  // Check if user is BPO Admin or Client Admin
  const isBPOAdmin = authUser?.permissions?.includes("admin_users");
  const isClientAdmin =
    authUser?.permissions?.includes("view_invoices") && !isBPOAdmin;

  // RTK Query hooks
  const { data: roles = [], isLoading, error } = useGetRolesQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: permissions = [] } = useGetPermissionsQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [getRolePermissions] = useLazyGetRolePermissionsQuery();
  const [updateRolePermissions, { isLoading: isUpdatingPermissions }] =
    useUpdateRolePermissionsMutation();

  // Show error notification when query fails
  useEffect(() => {
    if (error) {
      showNotification(t("common.errorLoadingData"), "error");
    }
  }, [error, t]);

  // Dialog states
  const [dialog, setDialog] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [viewPermissionsDialog, setViewPermissionsDialog] = useState(false);
  const [viewingRole, setViewingRole] = useState(null);

  // Selection states
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [initialPermissions, setInitialPermissions] = useState([]);

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

  // Computed values
  const isSaving = isCreating || isUpdating;

  const filteredRoles = useMemo(() => {
    let filtered = roles;

    // Filter by client
    if (selectedClient) {
      filtered = filtered.filter(
        (role) => (role.clientId || role.client_id) === selectedClient
      );
    }

    // Filter by search query (role name or description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (role) =>
          (role.roleName || role.role_name)?.toLowerCase().includes(query) ||
          role.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [roles, selectedClient, searchQuery]);

  const openAddDialog = () => {
    setEditingRole(null);
    setDialog(true);
  };

  const openEditDialog = (role) => {
    setEditingRole(role);
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
    setEditingRole(null);
  };

  const openPermissionsDialog = async (role) => {
    setSelectedRole(role);

    if (!role.id) {
      showNotification(t("roles.messages.invalidRole"), "error");
      return;
    }

    try {
      const result = await getRolePermissions(role.id).unwrap();
      setSelectedPermissions(result);
      setInitialPermissions(result);
    } catch (error) {
      showNotification(extractApiError(error, t("roles.messages.permissionsFetchFailed")), "error");
      setSelectedPermissions([]);
      setInitialPermissions([]);
    }

    setPermissionsDialog(true);
  };

  const closePermissionsDialog = () => {
    setPermissionsDialog(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const saveRole = async (data) => {
    try {
      if (editingRole) {
        await updateRole({
          id: editingRole.id,
          role_name: data.role_name,
          description: data.description,
          client_id: data.client_id,
        }).unwrap();
        showNotification(t("roles.messages.roleUpdated"), "success");
      } else {
        await createRole({
          clientId: data.client_id,
          roleName: data.role_name,
          description: data.description,
          permissionIds: [],
        }).unwrap();
        showNotification(t("roles.messages.roleCreated"), "success");
      }

      closeDialog();
    } catch (error) {
      showNotification(extractApiError(error, t("roles.messages.roleSaveFailed")), "error");
    }
  };

  const savePermissions = async () => {
    if (!selectedRole?.id) {
      showNotification(t("roles.messages.invalidRole"), "error");
      return;
    }

    try {
      await updateRolePermissions({
        roleId: selectedRole.id,
        permissions: selectedPermissions,
      }).unwrap();

      showNotification(t("roles.messages.permissionsUpdated"), "success");
      closePermissionsDialog();
    } catch (error) {
      showNotification(extractApiError(error, t("roles.messages.permissionsUpdateFailed")), "error");
    }
  };

  // Función para eliminar rol directamente (la confirmación se maneja en DeleteButton)
  const handleDeleteRole = async (role) => {
    try {
      await deleteRole(role.id).unwrap();
      showNotification(t("roles.messages.roleDeleted"), "success");
    } catch (error) {
      showNotification(extractApiError(error, t("roles.messages.roleDeleteFailed")), "error");
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleBatchPermissionToggle = (ids, action) => {
    setSelectedPermissions((prev) => {
      if (action === "add") {
        const newIds = ids.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      }
      return prev.filter((id) => !ids.includes(id));
    });
  };

  const locale = t("common.locale") || "en-US";
  const formatDate = useCallback((ds) => formatDateUtil(ds, locale), [locale]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedClient("");
  }, []);

  const isProtectedRole = (roleName) =>
    roleName === "BPO Admin" || roleName === "Client Admin";

  const onViewPermissions = (role) => {
    setViewingRole(role);
    setViewPermissionsDialog(true);
  };

  // Mobile filter handler
  const handleMobileFilterChange = useCallback((key, value) => {
    if (key === "roleName") setSearchQuery(value);
    else if (key === "client") setSelectedClient(value);
  }, []);

  // Mobile filter config
  const mobileFilterConfig = useMemo(() => {
    const cfg = [
      {
        key: "roleName",
        label: t("roles.table.roleName"),
        type: "text",
        value: searchQuery,
      },
    ];
    if (isBPOAdmin) {
      cfg.push({
        key: "client",
        label: t("roles.table.client"),
        type: "select",
        value: selectedClient,
        options: clients.map((c) => ({ label: c.name, value: c.id })),
      });
    }
    return cfg;
  }, [t, searchQuery, selectedClient, isBPOAdmin, clients]);

  // Use shared table configuration - called ONCE here and passed to children
  const {
    rows,
    desktopColumns,
    mobileColumns,
    renderActions,
    renderPrimaryIcon,
    actionsLabel,
    emptyMessage,
    headerTitle,
  } = useRolesTableConfig({
    roles: filteredRoles,
    clients,
    formatDate,
    openEditDialog,
    handleDeleteRole,
    openPermissionsDialog,
    onViewPermissions,
    isProtectedRole,
    isBPOAdmin,
    selectedClient,
    setSelectedClient,
    searchQuery,
    setSearchQuery,
    isOpen,
    clearFilters,
  });

  // Props compartidos para Desktop y Mobile
  const sharedProps = {
    // Data from hook
    rows,
    renderActions,
    actionsLabel,
    emptyMessage,
    headerTitle,
    // State
    isLoading,
    isOpen,
    setIsOpen,
    // Actions
    openAddDialog,
    // Permissions dialog props (Desktop only)
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
  };

  return (
    <>
      {isMobile ? (
        <RolesTabMobile
          {...sharedProps}
          columns={mobileColumns}
          renderPrimaryIcon={renderPrimaryIcon}
          headerActions={
            <MobileSpeedDial
              actions={[
                {
                  icon: <FilterListIcon />,
                  name: t("roles.filters"),
                  onClick: () => setIsOpen(!isOpen),
                },
                {
                  icon: <AddIcon />,
                  name: t("roles.addRole"),
                  onClick: openAddDialog,
                },
              ]}
            />
          }
          subHeader={
            <MobileFilterPanel
              isOpen={isOpen}
              filters={mobileFilterConfig}
              onFilterChange={handleMobileFilterChange}
              onClear={clearFilters}
              loading={isLoading}
            />
          }
        />
      ) : (
        <RolesTabDesktop
          {...sharedProps}
          columns={desktopColumns}
        />
      )}
      <AddNewRoleModal
        dialog={dialog}
        editingRole={editingRole}
        closeDialog={closeDialog}
        onSave={saveRole}
        isSaving={isSaving}
        clients={clients}
        isBPOAdmin={isBPOAdmin}
        isProtectedRole={isProtectedRole}
        defaultClientId={isClientAdmin ? authUser?.clientId : null}
      />

      <ViewPermissionsModal
        open={viewPermissionsDialog}
        onClose={() => {
          setViewPermissionsDialog(false);
          setViewingRole(null);
        }}
        role={viewingRole}
      />

      {/* Snackbar para notificaciones */}
      <AlertInline ref={notificationRef} asSnackbar />
    </>
  );
};
