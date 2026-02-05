import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../../common/hooks";
import {
  useGetAllClientsDataQuery,
  useGetClientInvoicesAndStatsQuery,
  useGetMyInvoicesQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useLazyGetDownloadUrlQuery,
} from "../../../store/api/invoicesApi";
import { useCreateLogMutation } from "../../../store/api/logsApi";
import {
  AttachMoney as MoneyIcon,
  AccessTime as ClockIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { colors } from "../../../common/styles/styles";
import {
  formatDate,
  formatCurrency,
  slugToTitle,
} from "../../../common/utils/formatters";
import { extractApiError } from "../../../common/utils/apiHelpers";

/**
 * Custom hook for financials module logic
 * Handles all state, queries, and business logic
 */
export const useFinancials = () => {
  // Auth store
  const authUser = useSelector((state) => state.auth.user);

  // Computed values for permissions
  const isBPOAdmin = authUser?.permissions?.includes("admin_invoices");
  const isClientAdmin =
    authUser?.permissions?.includes("view_invoices") && !isBPOAdmin;
  const hasViewAccess = authUser?.permissions?.includes("view_invoices");

  // Local state for selected folder
  const [selectedFolder, setSelectedFolder] = useState("");

  // RTK Query hooks - BPO Admin queries all clients data
  const {
    data: allClientsData,
    isLoading: loadingAllClients,
    error: allClientsError,
    refetch: refetchAllClients,
  } = useGetAllClientsDataQuery(undefined, {
    skip: !isBPOAdmin,
  });

  // RTK Query hooks - Client invoices and stats for selected folder (BPO admin)
  const {
    data: clientInvoicesData,
    error: invoicesError,
  } = useGetClientInvoicesAndStatsQuery(selectedFolder, {
    skip: !isBPOAdmin || !selectedFolder,
  });

  // RTK Query hooks - Client Admin's invoices (their own company)
  const {
    data: myInvoicesData,
    isLoading: loadingMyInvoices,
    error: myInvoicesError,
    refetch: refetchMyInvoices,
  } = useGetMyInvoicesQuery(undefined, {
    skip: !hasViewAccess || isBPOAdmin,
  });

  // RTK Query mutations
  const [updateInvoiceMutation, { isLoading: savingInvoiceEdit }] =
    useUpdateInvoiceMutation();
  const [deleteInvoiceMutation] = useDeleteInvoiceMutation();
  const [getDownloadUrl] = useLazyGetDownloadUrlQuery();
  const [createLog] = useCreateLogMutation();

  // Derived state from RTK Query
  const clientBreakdowns = allClientsData?.clientBreakdowns || [];
  const overallStats = allClientsData?.overallStats || null;

  // For BPO Admin: collect ALL invoices from allClientsData
  const allInvoices = useMemo(() => {
    if (isBPOAdmin && allClientsData?.clientBreakdowns) {
      const invoicesArray = [];
      allClientsData.clientBreakdowns.forEach((client) => {
        if (client.invoices && Array.isArray(client.invoices)) {
          invoicesArray.push(...client.invoices);
        }
      });
      return invoicesArray;
    }
    return [];
  }, [isBPOAdmin, allClientsData]);

  const invoices = isBPOAdmin
    ? allInvoices
    : myInvoicesData?.invoices || [];
  const clientStats = myInvoicesData?.stats || null;
  const loading = loadingAllClients || loadingMyInvoices;

  // For Client Admins: Create a breakdown with only their company's data
  const clientAdminBreakdown =
    isClientAdmin && clientStats && authUser?.clientName
      ? [
          {
            folder: authUser.clientName.toLowerCase().replace(/\s+/g, "-"),
            folderDisplay: authUser.clientName,
            totalRevenue: clientStats.totalPaid || 0,
            outstandingBalance: clientStats.outstandingBalance || 0,
            overdueAmount: clientStats.overdueAmount || 0,
            totalInvoices:
              (clientStats.paidCount || 0) + (clientStats.unpaidCount || 0),
            paidCount: clientStats.paidCount || 0,
            unpaidCount: clientStats.unpaidCount || 0,
            overdueCount: clientStats.overdueCount || 0,
            hasAccess: true,
          },
        ]
      : [];

  // For Client Admins: Create overall stats from their client stats
  const clientAdminOverallStats =
    isClientAdmin && clientStats
      ? {
          totalRevenue: clientStats.totalPaid || 0,
          outstandingBalance: clientStats.outstandingBalance || 0,
          overdueAmount: clientStats.overdueAmount || 0,
          totalClients: 1,
          totalInvoices: (clientStats.paidCount || 0) + (clientStats.unpaidCount || 0),
          totalPaidInvoices: clientStats.paidCount || 0,
          totalUnpaidInvoices: clientStats.unpaidCount || 0,
          totalOverdueInvoices: clientStats.overdueCount || 0,
        }
      : null;

  // Error handling for permissions
  const permissionError =
    !isBPOAdmin && !hasViewAccess
      ? "You do not have permission to view invoices"
      : null;
  const error =
    permissionError ||
    allClientsError?.data?.message ||
    invoicesError?.data?.message ||
    myInvoicesError?.data?.message ||
    null;

  // Notification hook
  const { notificationRef, showNotification } = useNotification();

  // Modal states
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);

  // Form states
  const [editInvoiceForm, setEditInvoiceForm] = useState({
    id: 0,
    invoiceNumber: "",
    title: "",
    amount: 0,
    currency: "USD",
    status: "sent",
    dueDate: "",
    issuedDate: "",
    paidDate: "",
    paymentMethod: "",
  });

  // Refs
  const invoicesSection = useRef(null);

  // Computed values
  const selectedFolderDisplay = slugToTitle(selectedFolder);

  // Auto-select first folder when data loads (BPO Admin only)
  useEffect(() => {
    if (isBPOAdmin && clientBreakdowns.length > 0 && !selectedFolder) {
      setSelectedFolder(clientBreakdowns[0].folder);
    }
  }, [isBPOAdmin, clientBreakdowns, selectedFolder]);

  // Methods
  const selectClient = (clientFolder) => {
    try {
      setSelectedFolder(clientFolder);
      scrollToInvoices();
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  const scrollToInvoices = () => {
    try {
      setTimeout(() => {
        invoicesSection.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  const viewInvoice = async (invoice) => {
    try {
      let downloadUrl = invoice.downloadUrl;

      if (!downloadUrl) {
        const clientFolder = invoice.folder || selectedFolder;
        const result = await getDownloadUrl({
          clientFolder,
          fileName: invoice.fileName,
        }).unwrap();
        downloadUrl = result.downloadUrl;
      }

      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
        showNotification("Opening invoice...", "success");

        try {
          await createLog({
            userId: authUser?.id?.toString() || "unknown",
            eventType: 'VIEW',
            entity: 'Invoice',
            description: `Viewed invoice ${invoice.invoiceNumber} (${invoice.title})`,
            status: 'SUCCESS',
          }).unwrap();
        } catch (logErr) {
          console.error("Error logging view invoice action:", logErr);
        }
      }
    } catch (err) {
      console.error("Error viewing invoice:", err);
      showNotification(extractApiError(err, "Failed to view invoice"), "error");

      try {
        await createLog({
          userId: authUser?.id?.toString() || "unknown",
          eventType: 'VIEW',
          entity: 'Invoice',
          description: `Failed to view invoice ${invoice.invoiceNumber} (${invoice.title})`,
          status: 'FAILURE',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging view invoice failure:", logErr);
      }
    }
  };

  const downloadInvoice = async (invoice) => {
    try {
      let downloadUrl = invoice.downloadUrl;

      if (!downloadUrl) {
        const clientFolder = invoice.folder || selectedFolder;
        const result = await getDownloadUrl({
          clientFolder,
          fileName: invoice.fileName,
        }).unwrap();
        downloadUrl = result.downloadUrl;
      }

      if (downloadUrl) {
        showNotification("Downloading invoice...", "success");

        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = invoice.fileName || 'invoice.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          showNotification("Download completed", "success");
        } catch (err) {
          console.error(`FinancialsView downloadInvoice: ${err}`);
          throw err;
        }

        try {
          await createLog({
            userId: authUser?.id?.toString() || "unknown",
            eventType: 'DOWNLOAD',
            entity: 'Invoice',
            description: `Downloaded invoice ${invoice.invoiceNumber} (${invoice.title})`,
            status: 'SUCCESS',
          }).unwrap();
        } catch (logErr) {
          console.error("Error logging download invoice action:", logErr);
        }
      }
    } catch (err) {
      console.error("Error downloading invoice:", err);
      showNotification(extractApiError(err, "Failed to download invoice"), "error");

      try {
        await createLog({
          userId: authUser?.id?.toString() || "unknown",
          eventType: 'DOWNLOAD',
          entity: 'Invoice',
          description: `Failed to download invoice ${invoice.invoiceNumber} (${invoice.title})`,
          status: 'FAILURE',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging download invoice failure:", logErr);
      }
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    await deleteInvoiceMutation(invoice.id).unwrap();
  };

  const openPaymentLink = (paymentLink) => {
    try {
      window.open(paymentLink, "_blank");
      showNotification("Opening payment page...", "success");
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  const openEditInvoiceModal = (invoice) => {
    try {
      setEditInvoiceForm({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        title: invoice.title,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "",
        issuedDate: invoice.issuedDate
          ? new Date(invoice.issuedDate).toISOString().split("T")[0]
          : "",
        paidDate: invoice.paidDate
          ? new Date(invoice.paidDate).toISOString().split("T")[0]
          : "",
        paymentMethod: invoice.paymentMethod || "",
      });
      setShowEditInvoiceModal(true);
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  const markAsPaid = () => {
    try {
      setEditInvoiceForm((prev) => ({
        ...prev,
        status: "paid",
        paidDate: prev.paidDate || new Date().toISOString().split("T")[0],
      }));
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  const dateToISOString = (dateString) => {
    try {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
      return adjustedDate.toISOString();
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
      return new Date().toISOString();
    }
  };

  const handleSaveInvoiceEdit = async (e) => {
    e.preventDefault();
    if (!editInvoiceForm.id) return;

    try {
      const updateData = {
        id: editInvoiceForm.id,
        title: editInvoiceForm.title,
        amount: editInvoiceForm.amount,
        currency: editInvoiceForm.currency,
        status: editInvoiceForm.status,
        dueDate: dateToISOString(editInvoiceForm.dueDate),
        issuedDate: dateToISOString(editInvoiceForm.issuedDate),
        paymentMethod: editInvoiceForm.paymentMethod || null,
      };

      if (editInvoiceForm.status === "paid" && editInvoiceForm.paidDate) {
        updateData.paidDate = dateToISOString(editInvoiceForm.paidDate);
      }

      await updateInvoiceMutation(updateData).unwrap();

      showNotification("Invoice updated successfully", "success");
      setShowEditInvoiceModal(false);
    } catch (err) {
      console.error("Error updating invoice:", err);
      showNotification(extractApiError(err, "Failed to update invoice"), "error");
    }
  };


  const getStatusColor = (status) => {
    try {
      const statusColors = {
        draft: "default",
        sent: "info",
        viewed: "primary",
        paid: "success",
        overdue: "error",
        cancelled: "default",
      };
      return statusColors[status] || "default";
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
      return "default";
    }
  };

  // Use clientAdminOverallStats for Client Admins, overallStats for BPO Admins
  const statsToDisplay = isBPOAdmin ? overallStats : clientAdminOverallStats;

  const ClientSummaryCardInfo = statsToDisplay
    ? [
        {
          borderCol: colors.successBorder,
          cardColor: colors.successBackground,
          textColor: colors.successText,
          label: isBPOAdmin ? "Total Revenue" : "Total Paid",
          invoiceState: "paid invoices",
          overallStatsInfo: {
            tp1: statsToDisplay.totalRevenue,
            tp2: statsToDisplay.totalPaidInvoices,
          },
          icon: { icon: <MoneyIcon color="success" />, color: "success.light" },
        },
        {
          borderCol: colors.warningBorder,
          cardColor: colors.warningBackground,
          textColor: colors.warningText,
          label: "Outstanding Balance",
          invoiceState: "unpaid invoices",
          overallStatsInfo: {
            tp1: statsToDisplay.outstandingBalance,
            tp2: statsToDisplay.totalUnpaidInvoices,
          },
          icon: { icon: <ClockIcon color="warning" />, color: "warning.light" },
        },
        {
          borderCol: colors.errorBorder,
          cardColor: colors.errorBackground,
          textColor: colors.errorText,
          label: "Overdue Amount",
          invoiceState: "overdue invoices",
          overallStatsInfo: {
            tp1: statsToDisplay.overdueAmount,
            tp2: statsToDisplay.totalOverdueInvoices,
          },
          icon: { icon: <WarningIcon color="error" />, color: "error.light" },
        },
        {
          borderCol: colors.infoBorder,
          cardColor: colors.infoBackground,
          textColor: colors.infoText,
          label: isBPOAdmin ? "Active Clients" : "Total Invoices",
          invoiceState: "total invoices",
          overallStatsInfo: {
            tp1: isBPOAdmin ? statsToDisplay.totalClients : statsToDisplay.totalInvoices,
            tp2: statsToDisplay.totalInvoices,
          },
          icon: {
            icon: isBPOAdmin ? <PeopleIcon color="primary" /> : <PdfIcon color="primary" />,
            color: "primary.light",
          },
        },
      ]
    : [];

  return {
    // Permissions
    isBPOAdmin,
    isClientAdmin,
    hasViewAccess,
    authUser,

    // Data
    clientBreakdowns,
    clientAdminBreakdown,
    statsToDisplay,
    ClientSummaryCardInfo,
    invoices,
    selectedFolder,
    selectedFolderDisplay,
    loading,
    error,

    // Refs
    invoicesSection,

    // Refetch functions
    refetchAllClients,
    refetchMyInvoices,

    // Modal state
    showEditInvoiceModal,
    setShowEditInvoiceModal,
    editInvoiceForm,
    setEditInvoiceForm,
    savingInvoiceEdit,

    // Notification
    notificationRef,

    // Actions
    selectClient,
    viewInvoice,
    downloadInvoice,
    handleDeleteInvoice,
    openPaymentLink,
    openEditInvoiceModal,
    markAsPaid,
    handleSaveInvoiceEdit,
    showNotification,

    // Utilities
    formatDate,
    formatCurrency,
    getStatusColor,
  };
};
