import { useState, useMemo, useCallback } from "react";
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
import { extractApiError } from "../../../../common/utils/apiHelpers";
import { formatDate as formatDateUtil } from "../../../../common/utils/formatters";
import { UsersTabDesktop } from "./UsersTabDesktop";
import { UsersTabMobile } from "./UsersTabMobile";
import { AddNewUserModal } from "./AddNewUserModal";
import { useUsersTableConfig } from "./useUsersTableConfig";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetClientsQuery,
  useGetRolesQuery,
} from "../../../../store/api/adminApi";

/**
 * Componente unificado UsersTab que maneja la lógica de datos
 * y renderiza la versión móvil o desktop según el breakpoint actual.
 */
export const UsersTab = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const authUser = useSelector((state) => state.auth.user);
  const { notificationRef, showNotification } = useNotification();

  // Check if user is BPO Admin or Client Admin
  const isBPOAdmin = authUser?.permissions?.includes("admin_users");
  const isClientAdmin =
    authUser?.permissions?.includes("view_invoices") && !isBPOAdmin;

  // RTK Query hooks
  const { data: users = [], isLoading: loading } = useGetUsersQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const [createUserMutation, { isLoading: creating }] = useCreateUserMutation();
  const [updateUserMutation, { isLoading: updating }] = useUpdateUserMutation();

  // State
  const [dialog, setDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const saving = creating || updating;

  // Form data
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    client_id: null,
    role_id: null,
    password: "",
  });

  // Computed values
  const clientOptions = useMemo(() => {
    try {
      return clients.map((client) => ({
        title: client.name,
        value: client.id,
      }));
    } catch (err) {
      console.error(`ERROR clientOptions: ${err}`);
      return [];
    }
  }, [clients]);

  const roleOptions = useMemo(() => {
    try {
      return roles
        .filter((role) => role.client_id === userForm.client_id)
        .map((role) => ({ title: role.role_name, value: role.id }));
    } catch (err) {
      console.error(`ERROR roleOptions: ${err}`);
      return [];
    }
  }, [roles, userForm.client_id]);

  const filteredUsers = useMemo(() => {
    try {
      let filtered = users;

      // For Client Admins, only show users from their company
      if (isClientAdmin && authUser?.clientId) {
        filtered = filtered.filter(
          (user) => user.clientId === authUser.clientId
        );
      }

      // For BPO Admins, use the selected client filter
      if (isBPOAdmin && selectedClient) {
        filtered = filtered.filter((user) => user.clientId === selectedClient);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query)
        );
      }

      return filtered;
    } catch (err) {
      console.error(`ERROR filteredUsers: ${err}`);
      return users;
    }
  }, [
    users,
    selectedClient,
    searchQuery,
    isClientAdmin,
    isBPOAdmin,
    authUser?.clientId,
  ]);

  const isFormValid = useMemo(() => {
    try {
      const emailRegex = /.+@.+\..+/;
      return (
        userForm.first_name &&
        userForm.last_name &&
        userForm.email &&
        emailRegex.test(userForm.email) &&
        userForm.client_id &&
        userForm.role_id &&
        (editingUser || userForm.password)
      );
    } catch (err) {
      console.error(`ERROR isFormValid: ${err}`);
      return false;
    }
  }, [userForm, editingUser]);

  // Methods
  const openAddDialog = () => {
    try {
      setEditingUser(null);
      setUserForm({
        first_name: "",
        last_name: "",
        email: "",
        // For Client Admins, pre-set their clientId
        client_id: isClientAdmin ? authUser?.clientId : null,
        role_id: null,
        password: "",
      });
      setDialog(true);
    } catch (err) {
      console.error(`ERROR openAddDialog: ${err}`);
    }
  };

  const openEditDialog = (user) => {
    try {
      setEditingUser(user);
      setUserForm({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        client_id: user.clientId,
        role_id: user.roleId,
        password: "",
      });
      setDialog(true);
    } catch (err) {
      console.error(`ERROR openEditDialog: ${err}`);
    }
  };

  const closeDialog = () => {
    try {
      setDialog(false);
      setEditingUser(null);
      setUserForm({
        first_name: "",
        last_name: "",
        email: "",
        client_id: null,
        role_id: null,
        password: "",
      });
    } catch (err) {
      console.error(`ERROR closeDialog: ${err}`);
    }
  };

  const saveUser = async () => {
    try {
      const userData = { ...userForm };

      // Convert empty string role_id to null for server validation
      if (userData.role_id === "" || userData.role_id === undefined) {
        userData.role_id = null;
      }

      if (editingUser && !userData.password) {
        delete userData.password;
      }

      if (editingUser) {
        // Update existing user
        await updateUserMutation({ id: editingUser.id, ...userData }).unwrap();
        showNotification(t("users.messages.userUpdated"), "success");
      } else {
        // Create new user
        await createUserMutation(userData).unwrap();
        showNotification(t("users.messages.userCreated"), "success");
      }

      closeDialog();
    } catch (error) {
      console.error("Error saving user:", error);
      showNotification(
        extractApiError(error, t("users.messages.saveFailed")),
        "error"
      );
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await updateUserMutation({
        id: user.id,
        isActive: !user.isActive,
      }).unwrap();

      showNotification(
        !user.isActive
          ? t("users.messages.userActivated")
          : t("users.messages.userDeactivated"),
        "success"
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      showNotification(
        extractApiError(error, t("users.messages.statusUpdateFailed")),
        "error"
      );
    }
  };


  const locale = t("common.locale") || "en-US";
  const formatDate = useCallback((ds) => formatDateUtil(ds, locale), [locale]);

  const handleClientChange = (clientId) => {
    try {
      setUserForm((prev) => ({ ...prev, client_id: clientId, role_id: null }));
    } catch (err) {
      console.error(`ERROR handleClientChange: ${err}`);
    }
  };

  // Clear all filters
  const clearFilters = useCallback(() => {
    try {
      setSearchQuery("");
      setSelectedClient("");
    } catch (error) {
      console.error("clearFilters error:", error);
    }
  }, []);

  // Mobile filter handler
  const handleMobileFilterChange = useCallback((key, value) => {
    if (key === "name") setSearchQuery(value);
    else if (key === "client") setSelectedClient(value);
  }, []);

  // Mobile filter config
  const mobileFilterConfig = useMemo(() => {
    const cfg = [
      {
        key: "name",
        label: t("users.table.name"),
        type: "text",
        value: searchQuery,
      },
    ];
    if (isBPOAdmin) {
      cfg.push({
        key: "client",
        label: t("users.table.client"),
        type: "select",
        value: selectedClient,
        options: clientOptions.map((c) => ({ label: c.title, value: c.value })),
      });
    }
    return cfg;
  }, [t, searchQuery, selectedClient, isBPOAdmin, clientOptions]);

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
  } = useUsersTableConfig({
    users: filteredUsers,
    formatDate,
    openEditDialog,
    toggleUserStatus,
    isBPOAdmin,
    selectedClient,
    setSelectedClient,
    searchQuery,
    setSearchQuery,
    isOpen,
    clientOptions,
    clearFilters,
  });

  // Props compartidos para Desktop y Mobile
  const sharedProps = {
    // Data
    rows,
    renderActions,
    actionsLabel,
    emptyMessage,
    headerTitle,
    // State
    loading,
    isOpen,
    setIsOpen,
    // Actions
    openAddDialog,
  };

  return (
    <>
      {isMobile ? (
        <UsersTabMobile
          {...sharedProps}
          columns={mobileColumns}
          renderPrimaryIcon={renderPrimaryIcon}
          headerActions={
            <MobileSpeedDial
              actions={[
                {
                  icon: <FilterListIcon />,
                  name: t("users.filters"),
                  onClick: () => setIsOpen(!isOpen),
                },
                {
                  icon: <AddIcon />,
                  name: t("users.addNewUser"),
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
              loading={loading}
            />
          }
        />
      ) : (
        <UsersTabDesktop
          {...sharedProps}
          columns={desktopColumns}
        />
      )}
      <AddNewUserModal
        dialog={dialog}
        editingUser={editingUser}
        userForm={userForm}
        setUserForm={setUserForm}
        closeDialog={closeDialog}
        saveUser={saveUser}
        saving={saving}
        isFormValid={isFormValid}
        notificationRef={notificationRef}
        clientOptions={clientOptions}
        roleOptions={roleOptions}
        isBPOAdmin={isBPOAdmin}
        handleClientChange={handleClientChange}
      />
    </>
  );
};
