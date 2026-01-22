import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Container,
  Avatar,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  AccessTime as ClockIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import {
  useGetAllClientsDataQuery,
  useGetClientInvoicesAndStatsQuery,
  useGetMyInvoicesQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useLazyGetDownloadUrlQuery,
} from "../../store/api/invoicesApi";
import { useCreateLogMutation } from "../../store/api/logsApi";
import { useSelector } from "react-redux";
import { ClientSummary } from "./components/ClientSummary";
import { ClientBreakdown } from "./components/ClientBreakdown";
import { InvoicesTable } from "./components/InvoicesTable";
import { EditInvoiceModal } from "./components/EditInvoiceModal";
import {
  primaryButton,
  outlinedButton,
  colors,
  typography,
} from "../../common/styles/styles";

export const FinancialsView = () => {
  // Auth store
  const authUser = useSelector((state) => state.auth.user);

  // Computed values
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
    isLoading: loadingInvoices,
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

  // For BPO Admin: collect ALL invoices from allClientsData instead of using selectedFolder
  const allInvoices = React.useMemo(() => {
    if (isBPOAdmin && allClientsData?.clientBreakdowns) {
      // Extract all invoices from each client breakdown
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
  const arStats = clientInvoicesData?.stats || null;
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

  // Local state
  const [notification, setNotification] = useState(null);

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
  const selectedFolderDisplay = selectedFolder
    ? selectedFolder
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  // Auto-select first folder when data loads (BPO Admin only)
  React.useEffect(() => {
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
        // Open PDF in new tab for viewing
        window.open(downloadUrl, '_blank');
        showNotification("success", "Opening invoice...");

        // Log the view invoice action
        try {
          await createLog({
            userId: authUser.id.toString(),
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
      showNotification(
        "error",
        err.data?.message || "Failed to view invoice"
      );

      // Log the failed view invoice action
      try {
        await createLog({
          userId: authUser.id.toString(),
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
        showNotification("success", "Downloading invoice...");

        try {
          // Fetch the file as a blob to force download
          const response = await fetch(downloadUrl);
          const blob = await response.blob();

          // Create a blob URL
          const blobUrl = window.URL.createObjectURL(blob);

          // Create a temporary anchor element to trigger download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = invoice.fileName || 'invoice.pdf';
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);

          showNotification("success", "Download completed");
        } catch (err) {
          console.error(`FinancialsView downloadInvoice: ${err}`);
          throw err;
        }

        // Log the download invoice action
        try {
          await createLog({
            userId: authUser.id.toString(),
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
      showNotification(
        "error",
        err.data?.message || "Failed to download invoice"
      );

      // Log the failed download invoice action
      try {
        await createLog({
          userId: authUser.id.toString(),
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
    // La confirmación se maneja en el DeleteButton via modal
    await deleteInvoiceMutation(invoice.id).unwrap();
  };

  const openPaymentLink = (paymentLink) => {
    try {
      window.open(paymentLink, "_blank");
      showNotification("success", "Opening payment page...");
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

      showNotification("success", "Invoice updated successfully");
      setShowEditInvoiceModal(false);
    } catch (err) {
      console.error("Error updating invoice:", err);
      const errorMessage =
        err.data?.error ||
        err.data?.errors?.[0]?.msg ||
        "Failed to update invoice";
      showNotification("error", errorMessage);
    }
  };

  const showNotification = (type, message) => {
    try {
      setNotification({ type, message });
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  const handleCloseNotification = () => {
    try {
      setNotification(null);
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
      return "N/A";
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (err) {
      console.error(`FinancialsView: ${err}`);
      return `$${amount}`;
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
          borderCol: colors.successBorder, // border-green-500
          cardColor: colors.successBackground, // bg-green-100
          textColor: colors.successText, // text-green-800
          label: "Total Revenue",
          invoiceState: "paid invoices",
          overallStatsInfo: {
            tp1: statsToDisplay.totalRevenue,
            tp2: statsToDisplay.totalPaidInvoices,
          },
          icon: { icon: <MoneyIcon color="success" />, color: "success.light" },
        },
        {
          borderCol: colors.warningBorder, // border-yellow-500
          cardColor: colors.warningBackground, // bg-yellow-100
          textColor: colors.warningText, // text-yellow-800
          label: "Outstanding Balance",
          invoiceState: "unpaid invoices",
          overallStatsInfo: {
            tp1: statsToDisplay.outstandingBalance,
            tp2: statsToDisplay.totalUnpaidInvoices,
          },
          icon: { icon: <ClockIcon color="warning" />, color: "warning.light" },
        },
        {
          borderCol: colors.errorBorder, // border-red-500
          cardColor: colors.errorBackground, // bg-red-100
          textColor: colors.errorText, // text-red-800
          label: "Overdue Amount",
          invoiceState: "overdue invoices",
          overallStatsInfo: {
            tp1: statsToDisplay.overdueAmount,
            tp2: statsToDisplay.totalOverdueInvoices,
          },
          icon: { icon: <WarningIcon color="error" />, color: "error.light" },
        },
        {
          borderCol: colors.infoBorder, // border-blue-500
          cardColor: colors.infoBackground, // bg-blue-100
          textColor: colors.infoText, // text-blue-800
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

  return (
    <Box>
      <Container
        maxWidth="100%"
        // sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 1 } }}
        sx={{ margin: "2rem 0 0 0" }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              //fontSize: typography.fontSize.h4, // text-xl (20px) - Section Title
              fontWeight: typography.fontWeight.semibold,
              fontFamily: typography.fontFamily,
            }}
          >
            {isBPOAdmin ? "Financials" : "Financials"}
          </Typography>
        </Box>

        {/* CARDS CONTAINER */}

        <Box
          sx={{
            marginLeft: "0rem",
          }}
        >
          {/* Overall Statistics - Desktop (BPO Admin and Client Admin) */}
          {statsToDisplay && (
            <ClientSummary
              loading={loading}
              refetchAllClients={isBPOAdmin ? refetchAllClients : refetchMyInvoices}
              formatCurrency={formatCurrency}
              overallStats={statsToDisplay}
              payload={ClientSummaryCardInfo}
            />
          )}

          {/* BPO Admin: Client Breakdown */}
          {isBPOAdmin && (
            <ClientBreakdown
              clientBreakdowns={clientBreakdowns}
              selectedFolder={selectedFolder}
              formatCurrency={formatCurrency}
              selectClient={selectClient}
              invoices={invoices}
              isAdmin={isBPOAdmin}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              viewInvoice={viewInvoice}
              downloadInvoice={downloadInvoice}
              openEditInvoiceModal={openEditInvoiceModal}
              handleDeleteInvoice={handleDeleteInvoice}
              openPaymentLink={openPaymentLink}
              onPaymentLinkSuccess={(message) =>
                showNotification("success", message)
              }
              onPaymentLinkError={(message) =>
                showNotification("error", message)
              }
            />
          )}

          {/* Client Admin: Client Breakdown Table */}
          {isClientAdmin && clientAdminBreakdown.length > 0 && (
            <ClientBreakdown
              clientBreakdowns={clientAdminBreakdown}
              selectedFolder={clientAdminBreakdown[0].folder}
              formatCurrency={formatCurrency}
              selectClient={selectClient}
              invoices={invoices}
              isAdmin={false}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              viewInvoice={viewInvoice}
              downloadInvoice={downloadInvoice}
              openEditInvoiceModal={openEditInvoiceModal}
              handleDeleteInvoice={handleDeleteInvoice}
              openPaymentLink={openPaymentLink}
              onPaymentLinkSuccess={(message) =>
                showNotification("success", message)
              }
              onPaymentLinkError={(message) =>
                showNotification("error", message)
              }
            />
          )}

          {/* Client User (non-admin): Invoices Table */}
          {!isBPOAdmin && !isClientAdmin && invoices.length > 0 && (
            <Box sx={{ mb: 4 }} ref={invoicesSection}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: typography.fontFamily,
                }}
              >
                Your Invoices
              </Typography>
              <InvoicesTable
                invoices={invoices}
                isAdmin={false}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
                viewInvoice={viewInvoice}
                downloadInvoice={downloadInvoice}
                openPaymentLink={openPaymentLink}
                openEditInvoiceModal={openEditInvoiceModal}
                handleDeleteInvoice={handleDeleteInvoice}
                onPaymentLinkSuccess={(message) =>
                  showNotification("success", message)
                }
                onPaymentLinkError={(message) =>
                  showNotification("error", message)
                }
              />
            </Box>
          )}

          {/* Edit Invoice Modal */}
          <EditInvoiceModal
            showEditInvoiceModal={showEditInvoiceModal}
            editInvoiceForm={editInvoiceForm}
            setEditInvoiceForm={setEditInvoiceForm}
            handleSaveInvoiceEdit={handleSaveInvoiceEdit}
            setShowEditInvoiceModal={setShowEditInvoiceModal}
            savingInvoiceEdit={savingInvoiceEdit}
            markAsPaid={markAsPaid}
          />

          {/* Notification Snackbar */}
          <Snackbar
            open={!!notification}
            autoHideDuration={5000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {notification && (
              <Alert
                onClose={handleCloseNotification}
                severity={notification.type === "success" ? "success" : "error"}
                sx={{ width: "100%" }}
              >
                {notification.message}
              </Alert>
            )}
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
};

export default FinancialsView;
