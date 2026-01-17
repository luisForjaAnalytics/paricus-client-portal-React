import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { ClientsTabDesktop } from "./ClientsTabDesktop";
import { ClientsTabMobile } from "./ClientsTabMobile";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "../../../../store/api/adminApi";
import { AddNewClientModal } from "./AddNewClientModal";

/**
 * Componente unificado ClientsTab que maneja la lógica de datos
 * y renderiza la versión móvil o desktop según el breakpoint actual.
 */
export const ClientsTab = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

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

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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
      const errorMessage =
        error.data?.error || t("clients.messages.clientSaveFailed");
      showNotification(errorMessage, "error");
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

  const formatDate = (dateString) => {
    try {
      const locale = t("common.locale") || "en-US";
      return new Date(dateString).toLocaleDateString(locale);
    } catch (err) {
      console.error(`ERROR formatDate: ${err}`);
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
      console.error(`ERROR showNotification: ${err}`);
    }
  };

  const handleCloseSnackbar = () => {
    try {
      setSnackbar({ ...snackbar, open: false });
    } catch (err) {
      console.error(`ERROR handleCloseSnackbar: ${err}`);
    }
  };

  const sharedProps = {
    editingClient,
    clients,
    isLoading,
    showCreateDialog,
    showConfirmDialog,
    clientForm,
    isSaving,
    clientToDeactivate,
    snackbar,
    confirmDeactivation,
    isFormValid,
    handleEdit,
    handleDeactivate,
    formatDate,
    handleCloseSnackbar,
    handleCloseDialog,
    handleSave,
    setClientForm,
    setShowConfirmDialog,
    onAddClick: () => setShowCreateDialog(true),
  };

  return (
    <>
      {isMobile ? (
        <ClientsTabMobile {...sharedProps} />
      ) : (
        <ClientsTabDesktop {...sharedProps} />
      )}
      <AddNewClientModal {...sharedProps} />
    </>
  );
};
