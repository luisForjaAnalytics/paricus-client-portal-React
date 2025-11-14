import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { ClientFolders } from "./components/ClientFolders";
import { ClientReports } from "./components/ClientReports";
import {
  useGetClientFoldersQuery,
  useGetClientReportsQuery,
  useUploadReportMutation,
  useLazyDownloadReportQuery,
  useDeleteReportMutation,
  useGetClientsQuery,
  useGetFolderAccessQuery,
  useGrantFolderAccessMutation,
  useRevokeFolderAccessMutation,
} from "../../store/api/reportsApi";
import {
  primaryButton,
  primaryIconButton,
  outlinedButton,
  outlinedIconButton,
  typography,
  boxWrapCards,
} from "../../layouts/style/styles";

export const ReportsManagementView = () => {
  const { t } = useTranslation();

  // RTK Query hooks
  const {
    data: clientFolders = [],
    isLoading: loading,
    refetch: refetchFolders,
  } = useGetClientFoldersQuery();

  // State
  const [selectedFolder, setSelectedFolder] = useState("");

  // Get reports for selected folder
  const {
    data: reports = [],
    isLoading: loadingReports,
    refetch: refetchReports,
  } = useGetClientReportsQuery(selectedFolder, {
    skip: !selectedFolder,
  });

  // Mutations
  const [uploadReport, { isLoading: uploading }] = useUploadReportMutation();
  const [downloadReportQuery] = useLazyDownloadReportQuery();
  const [deleteReportMutation] = useDeleteReportMutation();
  const [grantAccess, { isLoading: grantingAccess }] =
    useGrantFolderAccessMutation();
  const [revokeAccess] = useRevokeFolderAccessMutation();

  // Folder access management
  const [showFolderAccessModal, setShowFolderAccessModal] = useState(false);
  const { data: clients = [] } = useGetClientsQuery(undefined, {
    skip: !showFolderAccessModal,
  });
  const {
    data: folderAccess = [],
    isLoading: loadingAccess,
    refetch: refetchAccess,
  } = useGetFolderAccessQuery(undefined, { skip: !showFolderAccessModal });

  // State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [accessForm, setAccessForm] = useState({
    clientId: "",
    folderName: "",
  });

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    reportName: "",
    description: "",
    file: null,
  });

  const fileInputRef = useRef(null);

  // Auto-select first folder when folders load
  useEffect(() => {
    if (clientFolders.length > 0 && !selectedFolder) {
      setSelectedFolder(clientFolders[0]);
    }
  }, [clientFolders, selectedFolder]);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadForm({ ...uploadForm, file: event.target.files[0] });
    }
  };

  const handleUploadReport = async () => {
    if (!uploadForm.file || !selectedFolder) return;

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      if (uploadForm.reportName) {
        formData.append("reportName", uploadForm.reportName);
      }
      if (uploadForm.description) {
        formData.append("description", uploadForm.description);
      }

      await uploadReport({ folder: selectedFolder, formData }).unwrap();

      showNotification("success", "Report uploaded successfully");
      setShowUploadModal(false);
      resetUploadForm();
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || "Failed to upload report"
      );
    }
  };

  const handleDownloadReport = async (report) => {
    try {
      const fileName = report.name;
      const response = await downloadReportQuery({
        folder: selectedFolder,
        fileName,
      }).unwrap();

      if (response.downloadUrl) {
        window.open(response.downloadUrl, "_blank");
      }
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || "Failed to generate download link"
      );
    }
  };

  const handleDeleteReport = async (report) => {
    if (!window.confirm(`Are you sure you want to delete "${report.name}"?`))
      return;

    try {
      const fileName = report.name;
      await deleteReportMutation({ folder: selectedFolder, fileName }).unwrap();

      showNotification("success", "Report deleted successfully");
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || "Failed to delete report"
      );
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      reportName: "",
      description: "",
      file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Folder access management functions
  const handleGrantFolderAccess = async () => {
    if (!accessForm.clientId || !accessForm.folderName) return;

    try {
      await grantAccess({
        clientId: parseInt(accessForm.clientId),
        folderName: accessForm.folderName,
      }).unwrap();

      showNotification("success", "Folder access granted successfully");
      setAccessForm({ clientId: "", folderName: "" });
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || "Failed to grant folder access"
      );
    }
  };

  const handleRevokeFolderAccess = async (clientId, folderName) => {
    if (
      !window.confirm(
        `Are you sure you want to revoke access to "${folderName}" for this client?`
      )
    )
      return;

    try {
      await revokeAccess({ clientId, folderName }).unwrap();
      showNotification("success", "Folder access revoked successfully");
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || "Failed to revoke folder access"
      );
    }
  };

  const openFolderAccessModal = () => {
    setShowFolderAccessModal(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          Reports Management
        </Typography>
      </Box>
      <Box
      sx={
        boxWrapCards
      }
      >
        {/* Client Folders Section */}
        <ClientFolders
          clientFolders={clientFolders}
          loading={loading}
          selectedFolder={selectedFolder}
          handleFolderSelect={handleFolderSelect}
          refetchFolders={refetchFolders}
          openFolderAccessModal={openFolderAccessModal}
        />

        {/* Client Reports Section */}
        <ClientReports
          selectedFolder={selectedFolder}
          reports={reports}
          loadingReports={loadingReports}
          refetchReports={refetchReports}
          handleDownloadReport={handleDownloadReport}
          handleDeleteReport={handleDeleteReport}
          formatFileSize={formatFileSize}
          formatDate={formatDate}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadForm={uploadForm}
          setUploadForm={setUploadForm}
          handleFileSelect={handleFileSelect}
          handleUploadReport={handleUploadReport}
          uploading={uploading}
        />
      </Box>

      {/* Folder Access Management Modal */}
      <Dialog
        open={showFolderAccessModal}
        onClose={() => setShowFolderAccessModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Manage Client Folder Access</Typography>
            <IconButton
              onClick={() => setShowFolderAccessModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Grant Access Form */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Grant Folder Access
            </Typography>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={accessForm.clientId}
                    onChange={(e) =>
                      setAccessForm({ ...accessForm, clientId: e.target.value })
                    }
                    label="Client"
                  >
                    <MenuItem value="">Select a client</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <InputLabel>Folder</InputLabel>
                  <Select
                    value={accessForm.folderName}
                    onChange={(e) =>
                      setAccessForm({
                        ...accessForm,
                        folderName: e.target.value,
                      })
                    }
                    label="Folder"
                  >
                    <MenuItem value="">Select a folder</MenuItem>
                    {clientFolders.map((folder) => (
                      <MenuItem key={folder} value={folder}>
                        {folder}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  onClick={handleGrantFolderAccess}
                  disabled={
                    !accessForm.clientId ||
                    !accessForm.folderName ||
                    grantingAccess
                  }
                  fullWidth
                  startIcon={
                    grantingAccess ? (
                      <CircularProgress size={20} />
                    ) : (
                      <AddIcon />
                    )
                  }
                  sx={primaryIconButton}
                >
                  {grantingAccess ? "Granting..." : "Grant"}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Current Access List */}
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Current Access Permissions
          </Typography>

          {loadingAccess ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>
                Loading access permissions...
              </Typography>
            </Box>
          ) : folderAccess.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No folder access permissions configured
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {folderAccess.map((access) => (
                <Paper
                  key={`${access.clientId}-${access.folderName}`}
                  variant="outlined"
                  sx={{ p: 2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600">
                        {access.client.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Access to: {access.folderName}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() =>
                        handleRevokeFolderAccess(
                          access.clientId,
                          access.folderName
                        )
                      }
                      sx={outlinedButton}
                    >
                      Revoke
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification?.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
