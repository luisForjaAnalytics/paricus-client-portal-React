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
  CircularProgress,
  Alert,
  Snackbar,
  Container,
  Avatar,
  Stack,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  AccessTime as ClockIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import {
  useGetAllClientsDataQuery,
  useGetClientInvoicesAndStatsQuery,
  useGetMyInvoicesQuery,
  useUploadInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useLazyGetDownloadUrlQuery,
} from "../../store/api/invoicesApi";
import { useSelector } from "react-redux";
import { ClientSummary } from "./components/ClientSummary";
import { ClientSummaryMovil } from "./components/ClientSummaryMovil";
import { ClientBreakdown } from "./components/ClientBreakdown";
import { ClientBreakdownMovil } from "./components/ClientBreakdownMovil";
import { InvoicesTableView } from "./components/InvoicesTableView/InvoicesTableView";
import { InvoicesTableViewMovil } from "./components/InvoicesTableView/InvoicesTableViewMovil";
import {
  primaryButton,
  primaryIconButton,
  outlinedButton,
  outlinedIconButton,
  colors,
  typography,
  titlesTypography,
  boxWrapCards,
} from "../../layouts/style/styles";

export const FinancialsView = () => {
  // Auth store
  const authUser = useSelector((state) => state.auth.user);

  // Computed values
  const isAdmin = authUser?.permissions?.includes("admin_invoices");
  const hasViewAccess = authUser?.permissions?.includes("view_invoices");

  // Local state for selected folder
  const [selectedFolder, setSelectedFolder] = useState("");

  // RTK Query hooks - Admin queries all clients data
  const {
    data: allClientsData,
    isLoading: loadingAllClients,
    error: allClientsError,
    refetch: refetchAllClients,
  } = useGetAllClientsDataQuery(undefined, {
    skip: !isAdmin,
  });

  // RTK Query hooks - Client invoices and stats for selected folder (admin)
  const {
    data: clientInvoicesData,
    isLoading: loadingInvoices,
    error: invoicesError,
  } = useGetClientInvoicesAndStatsQuery(selectedFolder, {
    skip: !isAdmin || !selectedFolder,
  });

  // RTK Query hooks - Regular user's invoices
  const {
    data: myInvoicesData,
    isLoading: loadingMyInvoices,
    error: myInvoicesError,
    refetch: refetchMyInvoices,
  } = useGetMyInvoicesQuery(undefined, {
    skip: isAdmin || !hasViewAccess,
  });

  // RTK Query mutations
  const [uploadInvoiceMutation, { isLoading: uploading }] =
    useUploadInvoiceMutation();
  const [updateInvoiceMutation, { isLoading: savingInvoiceEdit }] =
    useUpdateInvoiceMutation();
  const [deleteInvoiceMutation] = useDeleteInvoiceMutation();
  const [getDownloadUrl] = useLazyGetDownloadUrlQuery();

  // Derived state from RTK Query
  const clientBreakdowns = allClientsData?.clientBreakdowns || [];
  const overallStats = allClientsData?.overallStats || null;
  const invoices = isAdmin
    ? clientInvoicesData?.invoices || []
    : myInvoicesData?.invoices || [];
  const arStats = clientInvoicesData?.stats || null;
  const clientStats = myInvoicesData?.stats || null;
  const loading = loadingAllClients || loadingMyInvoices;

  // Error handling for permissions
  const permissionError =
    !isAdmin && !hasViewAccess
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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);

  // Form states
  const [uploadForm, setUploadForm] = useState({
    invoiceName: "",
    description: "",
    amount: 0,
    currency: "USD",
    status: "sent",
    dueDate: "",
    issuedDate: "",
    paymentMethod: "",
    paymentLink: "",
    file: null,
  });

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

  // Auto-select first folder when data loads
  React.useEffect(() => {
    if (isAdmin && clientBreakdowns.length > 0 && !selectedFolder) {
      setSelectedFolder(clientBreakdowns[0].folder);
    }
  }, [isAdmin, clientBreakdowns, selectedFolder]);

  // Methods
  const selectClient = (clientFolder) => {
    try {
      setSelectedFolder(clientFolder);
      scrollToInvoices();
    } catch (err) {
      console.warn(`ERROR: ${err}`);
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
      console.warn(`ERROR: ${err}`);
    }
  };

  const handleFileSelect = (event) => {
    try {
      const file = event.target.files?.[0] || null;
      setUploadForm((prev) => ({ ...prev, file }));
    } catch (err) {
      console.warn(`ERROR: ${err}`);
    }
  };

  const handleUploadInvoice = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !selectedFolder) return;

    if (!uploadForm.invoiceName) {
      showNotification("error", "Invoice name is required");
      return;
    }
    if (!uploadForm.amount || uploadForm.amount <= 0) {
      showNotification("error", "Amount must be greater than 0");
      return;
    }
    if (!uploadForm.dueDate) {
      showNotification("error", "Due date is required");
      return;
    }
    if (!uploadForm.issuedDate) {
      showNotification("error", "Issued date is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("invoiceName", uploadForm.invoiceName);
      formData.append("amount", uploadForm.amount.toString());
      formData.append("currency", uploadForm.currency);
      formData.append("status", uploadForm.status);
      formData.append("dueDate", uploadForm.dueDate);
      formData.append("issuedDate", uploadForm.issuedDate);

      if (uploadForm.description) {
        formData.append("description", uploadForm.description);
      }
      if (uploadForm.paymentMethod) {
        formData.append("paymentMethod", uploadForm.paymentMethod);
      }
      if (uploadForm.paymentLink) {
        formData.append("paymentLink", uploadForm.paymentLink);
      }

      await uploadInvoiceMutation({
        clientFolder: selectedFolder,
        formData,
      }).unwrap();

      showNotification("success", "Invoice uploaded successfully");
      setShowUploadModal(false);
      setUploadForm({
        invoiceName: "",
        description: "",
        amount: 0,
        currency: "USD",
        status: "sent",
        dueDate: "",
        issuedDate: "",
        paymentMethod: "",
        paymentLink: "",
        file: null,
      });
    } catch (err) {
      console.error("Error uploading invoice:", err);
      const errorMessage =
        err.data?.errors?.map((e) => e.msg).join(", ") ||
        err.data?.error ||
        "Failed to upload invoice";
      showNotification("error", errorMessage);
    }
  };

  const downloadInvoice = async (invoice) => {
    try {
      if (invoice.downloadUrl) {
        window.open(invoice.downloadUrl, "_blank");
        showNotification("success", "Download started");
      } else {
        const clientFolder = invoice.folder || selectedFolder;
        const result = await getDownloadUrl({
          clientFolder,
          fileName: invoice.fileName,
        }).unwrap();
        if (result.downloadUrl) {
          window.open(result.downloadUrl, "_blank");
          showNotification("success", "Download started");
        }
      }
    } catch (err) {
      console.error("Error downloading invoice:", err);
      showNotification(
        "error",
        err.data?.message || "Failed to download invoice"
      );
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      await deleteInvoiceMutation(invoice.id).unwrap();
      showNotification("success", "Invoice deleted successfully");
    } catch (err) {
      console.error("Error deleting invoice:", err);
      showNotification(
        "error",
        err.data?.message || "Failed to delete invoice"
      );
    }
  };

  const openPaymentLink = (paymentLink) => {
    try {
      window.open(paymentLink, "_blank");
      showNotification("success", "Opening payment page...");
    } catch (err) {
      console.warn(`ERROR: ${err}`);
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
      console.warn(`ERROR: ${err}`);
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
      console.warn(`ERROR: ${err}`);
    }
  };

  const dateToISOString = (dateString) => {
    try {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
      return adjustedDate.toISOString();
    } catch (err) {
      console.warn(`ERROR: ${err}`);
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
      console.warn(`ERROR: ${err}`);
    }
  };

  const handleCloseNotification = () => {
    try {
      setNotification(null);
    } catch (err) {
      console.warn(`ERROR: ${err}`);
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.warn(`ERROR: ${err}`);
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
      console.warn(`ERROR: ${err}`);
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
      console.warn(`ERROR: ${err}`);
      return "default";
    }
  };

  // este arreglo es temporal mientras se tiene la data real///
  // Usando colores del STYLE_GUIDE.md (status colors)
  const ClientSummaryCardInfo = overallStats
    ? [
        {
          borderCol: colors.successBorder, // border-green-500
          cardColor: colors.successBackground, // bg-green-100
          textColor: colors.successText, // text-green-800
          label: "Total Revenue",
          invoiceState: "paid invoices",
          overallStatsInfo: {
            tp1: overallStats.totalRevenue,
            tp2: overallStats.totalPaidInvoices,
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
            tp1: overallStats.outstandingBalance,
            tp2: overallStats.totalUnpaidInvoices,
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
            tp1: overallStats.overdueAmount,
            tp2: overallStats.totalOverdueInvoices,
          },
          icon: { icon: <WarningIcon color="error" />, color: "error.light" },
        },
        {
          borderCol: colors.infoBorder, // border-blue-500
          cardColor: colors.infoBackground, // bg-blue-100
          textColor: colors.infoText, // text-blue-800
          label: "Active Clients",
          invoiceState: "total invoices",
          overallStatsInfo: {
            tp1: overallStats.totalClients,
            tp2: overallStats.totalInvoices,
          },
          icon: {
            icon: <PeopleIcon color="primary" />,
            color: "primary.light",
          },
        },
      ]
    : [];

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}
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
          {isAdmin ? "Financials" : "Your Invoices"}
        </Typography>
      </Box>

      {/* CARDS CONTAINER */}

      <Box
        sx={
          boxWrapCards
        }
      >
        {/* BPO Admin: Overall Statistics - Desktop */}
        {isAdmin && overallStats && (
          <ClientSummary
            loading={loading}
            refetchAllClients={refetchAllClients}
            formatCurrency={formatCurrency}
            overallStats={overallStats}
            payload={ClientSummaryCardInfo}
          />
        )}

        {/* BPO Admin: Overall Statistics - Mobile */}
        {isAdmin && overallStats && (
          <ClientSummaryMovil
            loading={loading}
            refetchAllClients={refetchAllClients}
            formatCurrency={formatCurrency}
            payload={ClientSummaryCardInfo}
          />
        )}

        {/* BPO Admin: Client Breakdown - Desktop */}
        {isAdmin && (
          <ClientBreakdown
            clientBreakdowns={clientBreakdowns}
            selectedFolder={selectedFolder}
            formatCurrency={formatCurrency}
            selectClient={selectClient}
          />
        )}

        {/* BPO Admin: Client Breakdown - Mobile */}
        {isAdmin && (
          <ClientBreakdownMovil
            clientBreakdowns={clientBreakdowns}
            selectedFolder={selectedFolder}
            formatCurrency={formatCurrency}
            selectClient={selectClient}
            invoices={invoices}
            isAdmin={isAdmin}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            downloadInvoice={downloadInvoice}
            openEditInvoiceModal={openEditInvoiceModal}
            handleDeleteInvoice={handleDeleteInvoice}
            openPaymentLink={openPaymentLink}
            onPaymentLinkSuccess={(message) =>
              showNotification("success", message)
            }
            onPaymentLinkError={(message) => showNotification("error", message)}
          />
        )}

        {/* AR Statistics Dashboard (Client) */}
        {!isAdmin && clientStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Outstanding Balance
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="warning.main"
                        sx={{ my: 1 }}
                      >
                        {formatCurrency(clientStats.outstandingBalance)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {clientStats.unpaidCount} unpaid
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "warning.light" }}>
                      <MoneyIcon color="warning" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Paid
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="success.main"
                        sx={{ my: 1 }}
                      >
                        {formatCurrency(clientStats.totalPaid)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {clientStats.paidCount} invoices
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: "success.light" }}>
                      <CheckIcon color="success" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Next Payment Due
                      </Typography>
                      {clientStats.nextPaymentDue ? (
                        <>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary.main"
                            sx={{ my: 1 }}
                          >
                            {formatCurrency(clientStats.nextPaymentDue.amount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(clientStats.nextPaymentDue.dueDate)}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="text.disabled"
                          sx={{ my: 1 }}
                        >
                          None
                        </Typography>
                      )}
                    </Box>
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      <CalendarIcon color="primary" />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Selected Folder Invoices (Admin) or Client Invoices */}
        {(selectedFolder || !isAdmin) && (
          <Card ref={invoicesSection} sx={{ borderRadius: "1rem" }}>
            <CardContent>
              {/* Header - Desktop Only */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="semibold"
                  sx={{
                    ...titlesTypography.sectionTitle,
                  }}
                >
                  {isAdmin
                    ? `${selectedFolderDisplay} Invoices`
                    : "Your Invoices"}
                </Typography>
                {isAdmin ? (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      onClick={() => setShowUploadModal(true)}
                      sx={primaryIconButton}
                    >
                      Upload Invoice
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={() => {
                        // RTK Query refetches automatically via invalidateTags
                      }}
                      disabled={loadingInvoices}
                      sx={outlinedIconButton}
                    >
                      Refresh
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={
                      loading ? <CircularProgress size={16} /> : <RefreshIcon />
                    }
                    onClick={refetchMyInvoices}
                    disabled={loading}
                    sx={outlinedIconButton}
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                )}
              </Box>

              {/* Loading State */}
              {(loadingInvoices || (!isAdmin && loading)) && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <CircularProgress size={48} sx={{ mb: 2 }} />
                  <Typography>Loading invoices...</Typography>
                </Box>
              )}

              {/* Error State */}
              {!loadingInvoices && !loading && error && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <WarningIcon
                    sx={{ fontSize: 48, color: "error.main", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Error loading invoices
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() =>
                      isAdmin ? refetchAllClients() : refetchMyInvoices()
                    }
                    sx={primaryButton}
                  >
                    Try Again
                  </Button>
                </Box>
              )}

              {/* No Invoices State */}
              {!loadingInvoices &&
                !loading &&
                !error &&
                invoices.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <PdfIcon
                      sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                      No invoices found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isAdmin
                        ? "Upload some PDF invoices for this client"
                        : "Invoices will appear here when available"}
                    </Typography>
                  </Box>
                )}

              {/* Invoice Table (Desktop) */}
              {!loadingInvoices &&
                !loading &&
                !error &&
                invoices.length > 0 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      borderColor: "transparent",
                    }}
                  >
                    <InvoicesTableView
                      invoices={invoices}
                      isAdmin={isAdmin}
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                      getStatusColor={getStatusColor}
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
                  </Box>
                )}

              {/* Invoice Table (Mobile) - Only for non-admin users */}
              {!loadingInvoices &&
                !loading &&
                !error &&
                invoices.length > 0 &&
                !isAdmin && (
                  <InvoicesTableViewMovil
                    invoices={invoices}
                    isAdmin={isAdmin}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    getStatusColor={getStatusColor}
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
                    selectedFolderDisplay={selectedFolderDisplay}
                    onUploadClick={() => setShowUploadModal(true)}
                    onRefreshClick={() => {
                      isAdmin ? refetchAllClients() : refetchMyInvoices();
                    }}
                    loadingInvoices={loadingInvoices || loading}
                  />
                )}
            </CardContent>
          </Card>
        )}

        {/* Edit Invoice Modal */}
        <Dialog
          open={showEditInvoiceModal}
          onClose={() => setShowEditInvoiceModal(false)}
          maxWidth="md"
          fullWidth
        >
          <form onSubmit={handleSaveInvoiceEdit}>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Invoice Number"
                    value={editInvoiceForm.invoiceNumber}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={editInvoiceForm.title}
                    onChange={(e) =>
                      setEditInvoiceForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    inputProps={{ step: 0.01, min: 0 }}
                    value={editInvoiceForm.amount}
                    onChange={(e) =>
                      setEditInvoiceForm((prev) => ({
                        ...prev,
                        amount: parseFloat(e.target.value),
                      }))
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={editInvoiceForm.currency}
                      onChange={(e) =>
                        setEditInvoiceForm((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      label="Currency"
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="MXN">MXN</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editInvoiceForm.status}
                      onChange={(e) =>
                        setEditInvoiceForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      label="Status"
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                      <MenuItem value="viewed">Viewed</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="overdue">Overdue</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={editInvoiceForm.paymentMethod}
                      onChange={(e) =>
                        setEditInvoiceForm((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value,
                        }))
                      }
                      label="Payment Method"
                    >
                      <MenuItem value="">Not Set</MenuItem>
                      <MenuItem value="credit_card">Credit Card</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="check">Check</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Issued Date"
                    type="date"
                    value={editInvoiceForm.issuedDate}
                    onChange={(e) =>
                      setEditInvoiceForm((prev) => ({
                        ...prev,
                        issuedDate: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={editInvoiceForm.dueDate}
                    onChange={(e) =>
                      setEditInvoiceForm((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                {editInvoiceForm.status === "paid" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Paid Date"
                      type="date"
                      value={editInvoiceForm.paidDate}
                      onChange={(e) =>
                        setEditInvoiceForm((prev) => ({
                          ...prev,
                          paidDate: e.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                      helperText="Leave empty to auto-set to today"
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{ justifyContent: "space-between", px: 3, pb: 2 }}
            >
              {editInvoiceForm.status !== "paid" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={markAsPaid}
                  sx={primaryButton}
                >
                  Mark as Paid
                </Button>
              )}
              <Box sx={{ ml: "auto" }}>
                <Button
                  onClick={() => setShowEditInvoiceModal(false)}
                  sx={{ ...outlinedButton, mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={savingInvoiceEdit}
                  sx={primaryButton}
                >
                  {savingInvoiceEdit ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* Upload Modal */}
        <Dialog
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          maxWidth="md"
          fullWidth
        >
          <form onSubmit={handleUploadInvoice}>
            <DialogTitle>Upload New Invoice</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Invoice Name"
                    value={uploadForm.invoiceName}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        invoiceName: e.target.value,
                      }))
                    }
                    placeholder="e.g., March_2024_Services"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ ...outlinedButton, height: "56px" }}
                  >
                    {uploadForm.file
                      ? uploadForm.file.name
                      : "Choose PDF File *"}
                    <input
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={handleFileSelect}
                      required
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    inputProps={{ step: 0.01, min: 0 }}
                    value={uploadForm.amount}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        amount: parseFloat(e.target.value),
                      }))
                    }
                    placeholder="0.00"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={uploadForm.currency}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      label="Currency"
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="MXN">MXN</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Issued Date"
                    type="date"
                    value={uploadForm.issuedDate}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        issuedDate: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={uploadForm.dueDate}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={uploadForm.status}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      label="Status"
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                      <MenuItem value="viewed">Viewed</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="overdue">Overdue</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method (Optional)</InputLabel>
                    <Select
                      value={uploadForm.paymentMethod}
                      onChange={(e) =>
                        setUploadForm((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value,
                        }))
                      }
                      label="Payment Method (Optional)"
                    >
                      <MenuItem value="">Not Set</MenuItem>
                      <MenuItem value="credit_card">Credit Card</MenuItem>
                      <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                      <MenuItem value="check">Check</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add notes or description for this invoice"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Payment Link URL (Optional)"
                    type="url"
                    value={uploadForm.paymentLink}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        paymentLink: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/payment/invoice-123"
                    helperText="Enter a valid payment URL (Stripe, PayPal, etc.)"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowUploadModal(false)}
                sx={outlinedButton}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={uploading || !uploadForm.file}
                sx={primaryButton}
              >
                {uploading ? "Uploading..." : "Upload Invoice"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

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
  );
};
