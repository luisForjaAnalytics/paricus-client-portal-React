import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { RolesTabDesktop } from "./RolesTabDesktop";
import { RolesTabMobile } from "./RolesTabMobile";
import { AddNewRoleModal } from "./AddNewRoleModal";
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

/**
 * Componente unificado RolesTab que maneja la lógica de datos
 * y renderiza la versión móvil o desktop según el breakpoint actual.
 */
export const RolesTab = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const authUser = useSelector((state) => state.auth.user);

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
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [getRolePermissions] = useLazyGetRolePermissionsQuery();
  const [updateRolePermissions, { isLoading: isUpdatingPermissions }] =
    useUpdateRolePermissionsMutation();

  // Dialog states
  const [dialog, setDialog] = useState(false);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Selection states
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [roleForm, setRoleForm] = useState({
    role_name: "",
    description: "",
    client_id: null,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Computed values
  const isSaving = isCreating || isUpdating;

  const filteredRoles = useMemo(() => {
    try {
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
    } catch (err) {
      console.log(`ERROR filteredRoles: ${err}`);
      return roles;
    }
  }, [roles, selectedClient, searchQuery]);

  const openAddDialog = () => {
    try {
      setEditingRole(null);
      setRoleForm({
        role_name: "",
        description: "",
        // For Client Admins, pre-set their clientId
        client_id: isClientAdmin ? authUser?.clientId : null,
      });
      setDialog(true);
    } catch (err) {
      console.log(`ERROR openAddDialog: ${err}`);
    }
  };

  const openEditDialog = (role) => {
    try {
      setEditingRole(role);
      setRoleForm({
        role_name: role.roleName || role.role_name,
        description: role.description || "",
        client_id: role.clientId || role.client_id,
      });
      setDialog(true);
    } catch (err) {
      console.log(`ERROR openEditDialog: ${err}`);
    }
  };

  const closeDialog = () => {
    try {
      setDialog(false);
      setEditingRole(null);
      setRoleForm({
        role_name: "",
        description: "",
        client_id: null,
      });
    } catch (err) {
      console.log(`ERROR closeDialog: ${err}`);
    }
  };

  const openPermissionsDialog = async (role) => {
    try {
      setSelectedRole(role);

      if (!role.id) {
        showNotification(t("roles.messages.invalidRole"), "error");
        return;
      }

      try {
        const result = await getRolePermissions(role.id).unwrap();
        setSelectedPermissions(result);
      } catch (error) {
        console.error("Error fetching role permissions:", error);
        setSelectedPermissions([]);
      }

      setPermissionsDialog(true);
    } catch (err) {
      console.log(`ERROR openPermissionsDialog: ${err}`);
    }
  };

  const closePermissionsDialog = () => {
    try {
      setPermissionsDialog(false);
      setSelectedRole(null);
      setSelectedPermissions([]);
    } catch (err) {
      console.log(`ERROR closePermissionsDialog: ${err}`);
    }
  };

  const saveRole = async () => {
    if (!isFormValid()) return;

    try {
      if (editingRole) {
        const updateData = {
          id: editingRole.id,
          role_name: roleForm.role_name,
          description: roleForm.description,
          client_id: roleForm.client_id,
        };
        await updateRole(updateData).unwrap();
        showNotification(t("roles.messages.roleUpdated"), "success");
      } else {
        const roleData = {
          clientId: roleForm.client_id,
          roleName: roleForm.role_name,
          description: roleForm.description,
          permissionIds: [],
        };

        if (!roleData.clientId) {
          showNotification(t("roles.messages.selectClient"), "error");
          return;
        }

        await createRole(roleData).unwrap();
        showNotification(t("roles.messages.roleCreated"), "success");
      }

      closeDialog();
    } catch (error) {
      const errorMessage =
        error.data?.error ||
        error.data?.message ||
        t("roles.messages.roleSaveFailed");
      showNotification(errorMessage, "error");
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
      const errorMessage =
        error.data?.error || t("roles.messages.permissionsUpdateFailed");
      showNotification(errorMessage, "error");
    }
  };

  const confirmDelete = (role) => {
    try {
      setRoleToDelete(role);
      setDeleteDialog(true);
    } catch (err) {
      console.log(`ERROR confirmDelete: ${err}`);
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleToDelete.id).unwrap();
      showNotification(t("roles.messages.roleDeleted"), "success");
      setDeleteDialog(false);
      setRoleToDelete(null);
    } catch (error) {
      const errorMessage =
        error.data?.error || t("roles.messages.roleDeleteFailed");
      showNotification(errorMessage, "error");
    }
  };

  const handlePermissionToggle = (permissionId) => {
    try {
      setSelectedPermissions((prev) =>
        prev.includes(permissionId)
          ? prev.filter((id) => id !== permissionId)
          : [...prev, permissionId]
      );
    } catch (err) {
      console.log(`ERROR handlePermissionToggle: ${err}`);
    }
  };

  const isFormValid = () => {
    try {
      return (
        roleForm.role_name &&
        roleForm.role_name.length >= 2 &&
        roleForm.client_id
      );
    } catch (err) {
      console.log(`ERROR isFormValid: ${err}`);
      return false;
    }
  };

  const formatDate = (dateString) => {
    try {
      const locale = t("common.locale") || "en-US";
      return new Date(dateString).toLocaleDateString(locale);
    } catch (err) {
      console.log(`ERROR formatDate: ${err}`);
      return dateString;
    }
  };

  const showNotification = (message, severity = "success") => {
    try {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    } catch (err) {
      console.log(`ERROR showNotification: ${err}`);
    }
  };

  const handleCloseSnackbar = () => {
    try {
      setSnackbar({ ...snackbar, open: false });
    } catch (err) {
      console.log(`ERROR handleCloseSnackbar: ${err}`);
    }
  };

  const isProtectedRole = (roleName) => {
    try {
      return roleName === "BPO Admin" || roleName === "Client Admin";
    } catch (err) {
      console.log(`ERROR isProtectedRole: ${err}`);
      return false;
    }
  };

  const sharedProps = {
    roles: filteredRoles,
    isLoading,
    isBPOAdmin,
    isClientAdmin,
    authUser,
    selectedClient,
    setSelectedClient,
    searchQuery,
    setSearchQuery,
    isOpen,
    setIsOpen,
    clients,
    openAddDialog,
    openEditDialog,
    confirmDelete,
    openPermissionsDialog,
    formatDate,
    isProtectedRole,
    permissions,
    selectedPermissions,
    savePermissions,
    isUpdatingPermissions,
    handlePermissionToggle,
    permissionsDialog,
    closePermissionsDialog,
    selectedRole,
  };

  return (
    <>
      {isMobile ? (
        <RolesTabMobile {...sharedProps} />
      ) : (
        <RolesTabDesktop {...sharedProps} />
      )}
      <AddNewRoleModal
        dialog={dialog}
        editingRole={editingRole}
        roleForm={roleForm}
        setRoleForm={setRoleForm}
        closeDialog={closeDialog}
        saveRole={saveRole}
        isSaving={isSaving}
        isFormValid={isFormValid}
        snackbar={snackbar}
        handleCloseSnackbar={handleCloseSnackbar}
        clients={clients}
        isBPOAdmin={isBPOAdmin}
        isProtectedRole={isProtectedRole}
        deleteDialog={deleteDialog}
        setDeleteDialog={setDeleteDialog}
        roleToDelete={roleToDelete}
        handleDeleteRole={handleDeleteRole}
        isDeleting={isDeleting}
      />
    </>
  );
};
