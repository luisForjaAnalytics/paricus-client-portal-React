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
import { useCreateLogMutation } from "../../store/api/logsApi";
import { useSelector } from "react-redux";
import {
  primaryButton,
  primaryIconButton,
  outlinedButton,
  outlinedIconButton,
  typography,
} from "../../common/styles/styles";

export const ReportsManagementView = () => {
  const { t } = useTranslation();
  const authUser = useSelector((state) => state.auth.user);
  const [createLog] = useCreateLogMutation();

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
    try {
      if (event.target.files && event.target.files[0]) {
        setUploadForm({ ...uploadForm, file: event.target.files[0] });
      }
    } catch (err) {
      console.log(`ERROR handleFileSelect: ${err}`);
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

      showNotification("success", t("reportsManagement.upload.uploadSuccess"));
      setShowUploadModal(null);
      resetUploadForm();

      // Refetch reports for this folder
      await fetchReportsForFolder(showUploadModal);
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || t("reportsManagement.upload.uploadError")
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

        // Log successful download
        try {
          await createLog({
            userId: authUser.id.toString(),
            eventType: 'DOWNLOAD',
            entity: 'Report',
            description: `Downloaded report ${fileName} from folder ${folder}`,
            status: 'SUCCESS',
          }).unwrap();
        } catch (logErr) {
          console.error("Error logging report download:", logErr);
        }
      }
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || t("reportsManagement.upload.downloadError")
      );

      // Log failed download
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: 'DOWNLOAD',
          entity: 'Report',
          description: `Failed to download report ${report.name} from folder ${folder}`,
          status: 'FAILURE',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging report download failure:", logErr);
      }
    }
  };

  const handleDeleteReport = async (folder, report) => {
    if (!window.confirm(t("reportsManagement.upload.confirmDelete", { reportName: report.name })))
      return;

    try {
      const fileName = report.name;
      await deleteReportMutation({ folder, fileName }).unwrap();

      showNotification("success", t("reportsManagement.upload.deleteSuccess"));

      // Log successful delete
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: 'DELETE',
          entity: 'Report',
          description: `Deleted report ${fileName} from folder ${folder}`,
          status: 'SUCCESS',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging report deletion:", logErr);
      }

      // Refetch reports for this folder
      await fetchReportsForFolder(folder);
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || t("reportsManagement.upload.deleteError")
      );

      // Log failed delete
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: 'DELETE',
          entity: 'Report',
          description: `Failed to delete report ${report.name} from folder ${folder}`,
          status: 'FAILURE',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging report deletion failure:", logErr);
      }
    }
  };

  const resetUploadForm = () => {
    try {
      setUploadForm({
        reportName: "",
        description: "",
        file: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log(`ERROR resetUploadForm: ${err}`);
    }
  };

  const formatFileSize = (bytes) => {
    try {
      if (bytes === 0) return `0 ${t("reportsManagement.fileSize.bytes")}`;
      const k = 1024;
      const sizes = [
        t("reportsManagement.fileSize.bytes"),
        t("reportsManagement.fileSize.kb"),
        t("reportsManagement.fileSize.mb"),
        t("reportsManagement.fileSize.gb"),
      ];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    } catch (err) {
      console.log(`ERROR formatFileSize: ${err}`);
      return `0 ${t("reportsManagement.fileSize.bytes")}`;
    }
  };

  const formatDate = (dateString) => {
    try {
      const locale = t("common.locale") || "en-US";
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.log(`ERROR formatDate: ${err}`);
      return t("reportsManagement.invalidDate");
    }
  };

  const showNotification = (type, message) => {
    try {
      setNotification({ type, message });
    } catch (err) {
      console.log(`ERROR showNotification: ${err}`);
    }
  };

  const handleCloseNotification = () => {
    try {
      setNotification(null);
    } catch (err) {
      console.log(`ERROR handleCloseNotification: ${err}`);
    }
  };

  // Folder access management functions
  const handleGrantFolderAccess = async () => {
    if (!accessForm.clientId || !accessForm.folderName) return;

    try {
      await grantAccess({
        clientId: parseInt(accessForm.clientId),
        folderName: accessForm.folderName,
      }).unwrap();

      showNotification("success", t("reportsManagement.folderAccess.grantSuccess"));
      setAccessForm({ clientId: "", folderName: "" });
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || t("reportsManagement.folderAccess.grantError")
      );
    }
  };

  const handleRevokeFolderAccess = async (clientId, folderName) => {
    if (
      !window.confirm(
        t("reportsManagement.folderAccess.confirmRevoke", { folderName })
      )
    )
      return;

    try {
      await revokeAccess({ clientId, folderName }).unwrap();
      showNotification("success", t("reportsManagement.folderAccess.revokeSuccess"));
    } catch (error) {
      showNotification(
        "error",
        error.data?.message || t("reportsManagement.folderAccess.revokeError")
      );
    }
  };

  const openFolderAccessModal = () => {
    try {
      setShowFolderAccessModal(true);
    } catch (err) {
      console.log(`ERROR openFolderAccessModal: ${err}`);
    }
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
          {t("reportsManagement.title")}
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
            <Typography variant="h6">{t("reportsManagement.folderAccess.title")}</Typography>
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
              {t("reportsManagement.folderAccess.grantTitle")}
            </Typography>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <InputLabel>{t("reportsManagement.folderAccess.client")}</InputLabel>
                  <Select
                    value={accessForm.clientId}
                    onChange={(e) =>
                      setAccessForm({ ...accessForm, clientId: e.target.value })
                    }
                    label={t("reportsManagement.folderAccess.client")}
                  >
                    <MenuItem value="">{t("reportsManagement.folderAccess.selectClient")}</MenuItem>
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
                  <InputLabel>{t("reportsManagement.folderAccess.folder")}</InputLabel>
                  <Select
                    value={accessForm.folderName}
                    onChange={(e) =>
                      setAccessForm({
                        ...accessForm,
                        folderName: e.target.value,
                      })
                    }
                    label={t("reportsManagement.folderAccess.folder")}
                  >
                    <MenuItem value="">{t("reportsManagement.folderAccess.selectFolder")}</MenuItem>
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
                  {grantingAccess ? t("reportsManagement.folderAccess.granting") : t("reportsManagement.folderAccess.grantButton")}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Current Access List */}
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            {t("reportsManagement.folderAccess.currentTitle")}
          </Typography>

          {loadingAccess ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>
                {t("reportsManagement.folderAccess.loadingPermissions")}
              </Typography>
            </Box>
          ) : folderAccess.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                {t("reportsManagement.folderAccess.noPermissions")}
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
                        {t("reportsManagement.folderAccess.accessTo")} {access.folderName}
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
                      {t("reportsManagement.folderAccess.revokeButton")}
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
