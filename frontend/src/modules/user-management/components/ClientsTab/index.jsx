import { useState, useCallback, useMemo } from "react";
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { useNotification } from "../../../../common/hooks";
import { MobileFilterPanel } from "../../../../common/components/ui/MobileFilterPanel";
import { MobileSpeedDial } from "../../../../common/components/ui/MobileSpeedDial";
import { ClientsTabDesktop } from "./ClientsTabDesktop";
import { ClientsTabMobile } from "./ClientsTabMobile";
import { useClientsTableConfig } from "./useClientsTableConfig";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "../../../../store/api/adminApi";
import { AddNewClientModal } from "./AddNewClientModal";
import { extractApiError } from "../../../../common/utils/apiHelpers";
import { formatDate as formatDateUtil } from "../../../../common/utils/formatters";

/**
 * Componente unificado ClientsTab que maneja la lógica de datos
 * y renderiza la versión móvil o desktop según el breakpoint actual.
 */
export const ClientsTab = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { notificationRef, showNotification } = useNotification();

  // RTK Query hooks
  const { data: allClients = [], isLoading, error } = useGetClientsQuery();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  // Filter out BPO Administration (super admin client)
  const clients = allClients.filter(
    (client) => client.id !== 1 && client.name !== "BPO Administration"
  );

  // State management
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDeactivate, setClientToDeactivate] = useState(null);

  // Form state
  const [clientForm, setClientForm] = useState({
    name: "",
    isProspect: false,
    isActive: true,
  });

  // Computed values
  const isSaving = isCreating || isUpdating;

  const handleEdit = (client) => {
    try {
      setEditingClient(client);
      setClientForm({
        name: client.name,
        isProspect: client.isProspect,
        isActive: client.isActive,
      });
      setShowCreateDialog(true);
    } catch (err) {
      console.error(`ERROR handleEdit: ${err}`);
    }
  };

  const handleDeactivate = (client) => {
    try {
      setClientToDeactivate(client);
      setShowConfirmDialog(true);
    } catch (err) {
      console.error(`ERROR handleDeactivate: ${err}`);
    }
  };

  const confirmDeactivation = async () => {
    try {
      await deleteClient(clientToDeactivate.id).unwrap();
      showNotification(t("clients.messages.clientDeactivated"), "success");
      setShowConfirmDialog(false);
      setClientToDeactivate(null);
    } catch (error) {
      console.error(`ERROR confirmDeactivation: ${error}`);
      showNotification(t("clients.messages.clientDeactivateFailed"), "error");
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    try {
      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientForm }).unwrap();
        showNotification(t("clients.messages.clientUpdated"), "success");
      } else {
        await createClient(clientForm).unwrap();
        showNotification(t("clients.messages.clientCreated"), "success");
      }

      handleCloseDialog();
    } catch (error) {
      console.error(`ERROR handleSave: ${error}`);
      showNotification(extractApiError(error, t("clients.messages.clientSaveFailed")), "error");
    }
  };

  const handleCloseDialog = () => {
    try {
      setShowCreateDialog(false);
      setEditingClient(null);
      setClientForm({
        name: "",
        isProspect: false,
        isActive: true,
      });
    } catch (err) {
      console.error(`ERROR handleCloseDialog: ${err}`);
    }
  };

  const isFormValid = () => {
    try {
      return clientForm.name && clientForm.name.length >= 2;
    } catch (err) {
      console.error(`ERROR isFormValid: ${err}`);
      return false;
    }
  };

  const locale = t("common.locale") || "en-US";
  const formatDate = useCallback((ds) => formatDateUtil(ds, locale), [locale]);

  // Use shared table configuration - called ONCE here and passed to children
  const {
    rows,
    desktopColumns,
    mobileColumns,
    renderActions,
    renderPrimaryIcon,
    isOpen,
    setIsOpen,
    filters,
    handleFilterChange,
    clearFilters,
    statusOptions,
    actionsLabel,
    emptyMessage,
    headerTitle,
  } = useClientsTableConfig({
    clients,
    formatDate,
    handleEdit,
    handleDeactivate,
  });

  // Mobile filter config
  const mobileFilterConfig = useMemo(
    () => [
      {
        key: "name",
        label: t("clients.table.clientName"),
        type: "text",
        value: filters.name,
      },
      {
        key: "status",
        label: t("clients.table.status"),
        type: "select",
        value: filters.status,
        options: statusOptions.map((opt) => ({ label: opt.name, value: opt.value })),
      },
    ],
    [t, filters, statusOptions]
  );

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
    onAddClick: () => setShowCreateDialog(true),
  };

  // Props for modal
  const modalProps = {
    editingClient,
    clients,
    showCreateDialog,
    showConfirmDialog,
    clientForm,
    isSaving,
    clientToDeactivate,
    notificationRef,
    confirmDeactivation,
    isFormValid,
    handleCloseDialog,
    handleSave,
    setClientForm,
    setShowConfirmDialog,
  };

  return (
    <>
      {isMobile ? (
        <ClientsTabMobile
          {...sharedProps}
          columns={mobileColumns}
          renderPrimaryIcon={renderPrimaryIcon}
          headerActions={
            <MobileSpeedDial
              actions={[
                {
                  icon: <FilterListIcon />,
                  name: t("clients.filters"),
                  onClick: () => setIsOpen(!isOpen),
                },
                {
                  icon: <AddIcon />,
                  name: t("clients.addClient"),
                  onClick: () => setShowCreateDialog(true),
                },
              ]}
            />
          }
          subHeader={
            <MobileFilterPanel
              isOpen={isOpen}
              filters={mobileFilterConfig}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              loading={isLoading}
            />
          }
        />
      ) : (
        <ClientsTabDesktop
          {...sharedProps}
          columns={desktopColumns}
        />
      )}
      <AddNewClientModal {...modalProps} />
    </>
  );
};
