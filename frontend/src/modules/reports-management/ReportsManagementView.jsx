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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { ClientFolders } from "./components/ClientFolders";
import {
  useGetClientFoldersQuery,
  useGetClientReportsQuery,
  useLazyGetClientReportsQuery,
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
} from "../../common/styles/styles";

export const ReportsManagementView = () => {
  const { t } = useTranslation();

  // RTK Query hooks
  const {
    data: clientFolders = [],
    isLoading: loading,
    refetch: refetchFolders,
  } = useGetClientFoldersQuery();

  // Use lazy query for reports - will be called when folders are expanded
  const [getReports, { data: reportsData, isLoading: loadingReports }] =
    useLazyGetClientReportsQuery();

  // Store reports by folder
  const [allReports, setAllReports] = useState({});
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  // Fetch reports for all folders when component mounts
  useEffect(() => {
    const fetchAllReports = async () => {
      if (clientFolders.length === 0) return;

      setIsLoadingInitial(true);

      try {
        // Fetch reports for all folders in parallel
        const promises = clientFolders.map(async (folder) => {
          try {
            const result = await getReports(folder).unwrap();
            return { folder, reports: result };
          } catch (error) {
            console.error(`Failed to fetch reports for ${folder}:`, error);
            return { folder, reports: [] };
          }
        });

        const results = await Promise.all(promises);

        // Update state with all results
        const reportsMap = {};
        results.forEach(({ folder, reports }) => {
          reportsMap[folder] = reports;
        });

        setAllReports(reportsMap);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchAllReports();
  }, [clientFolders.length]); // Only re-run when number of folders changes

  // Function to fetch reports for a folder (for refresh after upload/delete)
  const fetchReportsForFolder = async (folder) => {
    try {
      const result = await getReports(folder).unwrap();
      setAllReports((prev) => ({ ...prev, [folder]: result }));
    } catch (error) {
      console.error(`Failed to fetch reports for ${folder}:`, error);
      setAllReports((prev) => ({ ...prev, [folder]: [] }));
    }
  };

  const isLoadingAnyReports = loadingReports || isLoadingInitial;

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
  const [showUploadModal, setShowUploadModal] = useState(null); // Changed to store folder name
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

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadForm({ ...uploadForm, file: event.target.files[0] });
    }
  };

  const handleUploadReport = async () => {
    if (!uploadForm.file || !showUploadModal) return;

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      if (uploadForm.reportName) {
        formData.append("reportName", uploadForm.reportName);
      }
      if (uploadForm.description) {
        formData.append("description", uploadForm.description);
      }

      await uploadReport({ folder: showUploadModal, formData }).unwrap();

      showNotification("success", "Report uploaded successfully");
      setShowUploadModal(null);
      resetUploadForm();

      // Refetch reports for this folder
      await fetchReportsForFolder(showUploadModal);
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || "Failed to upload report"
      );
    }
  };

  const handleDownloadReport = async (folder, report) => {
    try {
      const fileName = report.name;
      const response = await downloadReportQuery({
        folder,
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

  const handleDeleteReport = async (folder, report) => {
    if (!window.confirm(`Are you sure you want to delete "${report.name}"?`))
      return;

    try {
      const fileName = report.name;
      await deleteReportMutation({ folder, fileName }).unwrap();

      showNotification("success", "Report deleted successfully");

      // Refetch reports for this folder
      await fetchReportsForFolder(folder);
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
    <Container maxWidth="100%" sx={{ py: 4 }}>
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
      <Box>
        {/* Client Folders Section with Expandable Reports */}
        <ClientFolders
          clientFolders={clientFolders}
          loading={loading}
          refetchFolders={refetchFolders}
          openFolderAccessModal={openFolderAccessModal}
          reports={allReports}
          loadingReports={isLoadingAnyReports}
          fetchReportsForFolder={fetchReportsForFolder}
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
          fileInputRef={fileInputRef}
          selectedFolderForUpload={showUploadModal}
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

export default ReportsManagementView;
