import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
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
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  AccessTime as ClockIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Payment as PaymentIcon,
  PictureAsPdf as PdfIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  OpenInNew as OpenIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import {
  useGetAllClientsDataQuery,
  useGetClientInvoicesAndStatsQuery,
  useGetMyInvoicesQuery,
  useUploadInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useUpdatePaymentLinkMutation,
  useLazyGetDownloadUrlQuery,
} from "../../store/api/invoicesApi";
import { useSelector } from "react-redux";

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
  const [uploadInvoiceMutation, { isLoading: uploading }] = useUploadInvoiceMutation();
  const [updateInvoiceMutation, { isLoading: savingInvoiceEdit }] = useUpdateInvoiceMutation();
  const [deleteInvoiceMutation] = useDeleteInvoiceMutation();
  const [updatePaymentLinkMutation, { isLoading: savingPaymentLink }] = useUpdatePaymentLinkMutation();
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
  const permissionError = !isAdmin && !hasViewAccess ? "You do not have permission to view invoices" : null;
  const error = permissionError || allClientsError?.data?.message || invoicesError?.data?.message || myInvoicesError?.data?.message || null;

  // Local state
  const [notification, setNotification] = useState(null);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
    file: null,
  });

  const [paymentLinkForm, setPaymentLinkForm] = useState({
    paymentLink: "",
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
    setSelectedFolder(clientFolder);
    scrollToInvoices();
  };

  const scrollToInvoices = () => {
    setTimeout(() => {
      invoicesSection.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0] || null;
    setUploadForm((prev) => ({ ...prev, file }));
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

      await uploadInvoiceMutation({ clientFolder: selectedFolder, formData }).unwrap();

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
        const result = await getDownloadUrl({ clientFolder, fileName: invoice.fileName }).unwrap();
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

  const openPaymentLinkModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentLinkForm({ paymentLink: invoice.paymentLink || "" });
    setShowPaymentLinkModal(true);
  };

  const handleSavePaymentLink = async (e) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentLinkForm.paymentLink) return;

    try {
      await updatePaymentLinkMutation({
        id: selectedInvoice.id,
        paymentLink: paymentLinkForm.paymentLink,
      }).unwrap();

      showNotification("success", "Payment link saved successfully");
      setShowPaymentLinkModal(false);
      setSelectedInvoice(null);
      setPaymentLinkForm({ paymentLink: "" });
    } catch (err) {
      console.error("Error saving payment link:", err);
      showNotification(
        "error",
        err.data?.message || "Failed to save payment link"
      );
    }
  };

  const openPaymentLink = (paymentLink) => {
    window.open(paymentLink, "_blank");
    showNotification("success", "Opening payment page...");
  };

  const openEditInvoiceModal = (invoice) => {
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
  };

  const markAsPaid = () => {
    setEditInvoiceForm((prev) => ({
      ...prev,
      status: "paid",
      paidDate: prev.paidDate || new Date().toISOString().split("T")[0],
    }));
  };

  const dateToISOString = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString();
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
    setNotification({ type, message });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      draft: "default",
      sent: "info",
      viewed: "primary",
      paid: "success",
      overdue: "error",
      cancelled: "default",
    };
    return statusColors[status] || "default";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {isAdmin ? "Financial Overview" : "Your Invoices"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isAdmin
            ? "Manage all client invoices and track accounts receivable"
            : "View and download your invoices"}
        </Typography>
      </Box>

      {/* BPO Admin: Overall Statistics */}
      {isAdmin && overallStats && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="semibold">
              All Clients Summary
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<OpenIcon />}
                href="https://my.waveapps.com/login_external/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wave Apps
              </Button>
              <Button
                variant="outlined"
                startIcon={
                  loading ? <CircularProgress size={16} /> : <RefreshIcon />
                }
                onClick={refetchAllClients}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh All"}
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Total Revenue */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  borderLeft: 4,
                  borderColor: "success.main",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Avatar sx={{ bgcolor: "success.light" }}>
                      <MoneyIcon color="success" />
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatCurrency(overallStats.totalRevenue)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {overallStats.totalPaidInvoices} paid invoices
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Outstanding Balance */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  borderLeft: 4,
                  borderColor: "warning.main",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Outstanding Balance
                    </Typography>
                    <Avatar sx={{ bgcolor: "warning.light" }}>
                      <ClockIcon color="warning" />
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {formatCurrency(overallStats.outstandingBalance)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {overallStats.totalUnpaidInvoices} unpaid invoices
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Overdue Amount */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  borderLeft: 4,
                  borderColor: "error.main",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Overdue Amount
                    </Typography>
                    <Avatar sx={{ bgcolor: "error.light" }}>
                      <WarningIcon color="error" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {formatCurrency(overallStats.overdueAmount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {overallStats.totalOverdueInvoices} overdue invoices
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Clients */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  borderLeft: 4,
                  borderColor: "primary.main",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Active Clients
                    </Typography>
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      <PeopleIcon color="primary" />
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {overallStats.totalClients}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {overallStats.totalInvoices} total invoices
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* BPO Admin: Client Breakdown */}
      {isAdmin && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
            Client Breakdown
          </Typography>

          <Grid container spacing={2}>
            {clientBreakdowns.map((client) => (
              <Grid item xs={12} md={6} lg={4} key={client.folder}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s",
                    border: selectedFolder === client.folder ? 2 : 0,
                    borderColor: "primary.main",
                    bgcolor:
                      selectedFolder === client.folder
                        ? "action.selected"
                        : "background.paper",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => selectClient(client.folder)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <BusinessIcon color="primary" />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="semibold">
                            {client.folderDisplay}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {client.totalInvoices} invoices
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" color="primary">
                        <OpenIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="success.main"
                        >
                          {formatCurrency(client.totalRevenue)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Outstanding
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="warning.main"
                        >
                          {formatCurrency(client.outstandingBalance)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Overdue
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="error.main"
                        >
                          {formatCurrency(client.overdueAmount)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {clientBreakdowns.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <BusinessIcon
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    No clients found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload invoices to see client data
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
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
        <Card ref={invoicesSection}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="semibold">
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
                    isAdmin
                      ? refetchAllClients()
                      : refetchMyInvoices()
                  }
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

            {/* Invoice Table */}
            {!loadingInvoices && !loading && !error && invoices.length > 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Payment Date</TableCell>
                      {isAdmin && <TableCell>Payment Link</TableCell>}
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {invoice.invoiceNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(invoice.issuedDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PdfIcon color="error" fontSize="small" />
                            <Typography variant="body2">
                              {invoice.title}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status.toUpperCase()}
                            color={getStatusColor(invoice.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(invoice.dueDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {invoice.paidDate && invoice.status === "paid" ? (
                            <Typography variant="body2" color="success.main">
                              {formatDate(invoice.paidDate)}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            {!invoice.paymentLink ? (
                              <Chip
                                label="PENDING LINK"
                                color="warning"
                                size="small"
                                icon={<WarningIcon />}
                                onClick={() => openPaymentLinkModal(invoice)}
                              />
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label="✓ Link Set"
                                  color="success"
                                  size="small"
                                />
                                <Tooltip title="Update link">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      openPaymentLinkModal(invoice)
                                    }
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                          </TableCell>
                        )}
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            {!isAdmin && invoice.paymentLink && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<PaymentIcon />}
                                onClick={() =>
                                  openPaymentLink(invoice.paymentLink)
                                }
                              >
                                Pay Now
                              </Button>
                            )}
                            {isAdmin && (
                              <Tooltip title="Edit Invoice">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => openEditInvoiceModal(invoice)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Download">
                              <IconButton
                                color="info"
                                size="small"
                                onClick={() => downloadInvoice(invoice)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {isAdmin && (
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleDeleteInvoice(invoice)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Link Modal */}
      <Dialog
        open={showPaymentLinkModal}
        onClose={() => setShowPaymentLinkModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSavePaymentLink}>
          <DialogTitle>Set Payment Link</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Invoice: {selectedInvoice?.fileName}
            </Typography>
            <TextField
              fullWidth
              label="Payment Link URL"
              type="url"
              value={paymentLinkForm.paymentLink}
              onChange={(e) =>
                setPaymentLinkForm({ paymentLink: e.target.value })
              }
              placeholder="https://example.com/payment/invoice-123"
              helperText="Enter a valid payment URL (Stripe, PayPal, etc.)"
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPaymentLinkModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingPaymentLink}
            >
              {savingPaymentLink ? "Saving..." : "Save Link"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
          <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
            {editInvoiceForm.status !== "paid" && (
              <Button variant="contained" color="success" onClick={markAsPaid}>
                Mark as Paid
              </Button>
            )}
            <Box sx={{ ml: "auto" }}>
              <Button
                onClick={() => setShowEditInvoiceModal(false)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={savingInvoiceEdit}
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
                  sx={{ height: "56px" }}
                >
                  {uploadForm.file ? uploadForm.file.name : "Choose PDF File *"}
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
                  value={paymentLinkForm.paymentLink}
                  onChange={(e) =>
                    setPaymentLinkForm({ paymentLink: e.target.value })
                  }
                  placeholder="https://example.com/payment/invoice-123"
                  helperText="Enter a valid payment URL (Stripe, PayPal, etc.)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={uploading || !uploadForm.file}
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
    </Container>
  );
};

