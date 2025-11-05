import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Snackbar,
  Alert,
  IconButton,
  Chip,
  Stack,
  Divider
} from '@mui/material'
import {
  Folder as FolderIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  Add as AddIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon
} from '@mui/icons-material'
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
} from '../../store/api/reportsApi'
import {
  primaryButton,
  primaryIconButton,
  outlinedButton,
  outlinedIconButton,
} from '../../layouts/style/styles'

export const ReportsManagementView = () => {
  // RTK Query hooks
  const { data: clientFolders = [], isLoading: loading, refetch: refetchFolders } = useGetClientFoldersQuery()

  // State
  const [selectedFolder, setSelectedFolder] = useState('')

  // Get reports for selected folder
  const { data: reports = [], isLoading: loadingReports, refetch: refetchReports } = useGetClientReportsQuery(selectedFolder, {
    skip: !selectedFolder
  })

  // Mutations
  const [uploadReport, { isLoading: uploading }] = useUploadReportMutation()
  const [downloadReportQuery] = useLazyDownloadReportQuery()
  const [deleteReportMutation] = useDeleteReportMutation()
  const [grantAccess, { isLoading: grantingAccess }] = useGrantFolderAccessMutation()
  const [revokeAccess] = useRevokeFolderAccessMutation()

  // Folder access management
  const [showFolderAccessModal, setShowFolderAccessModal] = useState(false)
  const { data: clients = [] } = useGetClientsQuery(undefined, { skip: !showFolderAccessModal })
  const { data: folderAccess = [], isLoading: loadingAccess, refetch: refetchAccess } = useGetFolderAccessQuery(undefined, { skip: !showFolderAccessModal })

  // State
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [notification, setNotification] = useState(null)
  const [accessForm, setAccessForm] = useState({
    clientId: '',
    folderName: ''
  })

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    reportName: '',
    description: '',
    file: null
  })

  const fileInputRef = useRef(null)

  // Auto-select first folder when folders load
  useEffect(() => {
    if (clientFolders.length > 0 && !selectedFolder) {
      setSelectedFolder(clientFolders[0])
    }
  }, [clientFolders, selectedFolder])

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder)
  }

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadForm({ ...uploadForm, file: event.target.files[0] })
    }
  }

  const handleUploadReport = async () => {
    if (!uploadForm.file || !selectedFolder) return

    try {
      const formData = new FormData()
      formData.append('file', uploadForm.file)
      if (uploadForm.reportName) {
        formData.append('reportName', uploadForm.reportName)
      }
      if (uploadForm.description) {
        formData.append('description', uploadForm.description)
      }

      await uploadReport({ folder: selectedFolder, formData }).unwrap()

      showNotification('success', 'Report uploaded successfully')
      setShowUploadModal(false)
      resetUploadForm()
    } catch (error) {
      showNotification('error', error.data?.message || 'Failed to upload report')
    }
  }

  const handleDownloadReport = async (report) => {
    try {
      const fileName = report.name
      const response = await downloadReportQuery({ folder: selectedFolder, fileName }).unwrap()

      if (response.downloadUrl) {
        window.open(response.downloadUrl, '_blank')
      }
    } catch (error) {
      showNotification('error', error.data?.message || 'Failed to generate download link')
    }
  }

  const handleDeleteReport = async (report) => {
    if (!window.confirm(`Are you sure you want to delete "${report.name}"?`)) return

    try {
      const fileName = report.name
      await deleteReportMutation({ folder: selectedFolder, fileName }).unwrap()

      showNotification('success', 'Report deleted successfully')
    } catch (error) {
      showNotification('error', error.data?.message || 'Failed to delete report')
    }
  }

  const resetUploadForm = () => {
    setUploadForm({
      reportName: '',
      description: '',
      file: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
  }

  const handleCloseNotification = () => {
    setNotification(null)
  }

  // Folder access management functions
  const handleGrantFolderAccess = async () => {
    if (!accessForm.clientId || !accessForm.folderName) return

    try {
      await grantAccess({
        clientId: parseInt(accessForm.clientId),
        folderName: accessForm.folderName
      }).unwrap()

      showNotification('success', 'Folder access granted successfully')
      setAccessForm({ clientId: '', folderName: '' })
    } catch (error) {
      showNotification('error', error.data?.message || 'Failed to grant folder access')
    }
  }

  const handleRevokeFolderAccess = async (clientId, folderName) => {
    if (!window.confirm(`Are you sure you want to revoke access to "${folderName}" for this client?`)) return

    try {
      await revokeAccess({ clientId, folderName }).unwrap()
      showNotification('success', 'Folder access revoked successfully')
    } catch (error) {
      showNotification('error', error.data?.message || 'Failed to revoke folder access')
    }
  }

  const openFolderAccessModal = () => {
    setShowFolderAccessModal(true)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Reports Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage client reports and uploads
        </Typography>
      </Box>

      {/* Client Folders Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="600">
            Client Folders
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<LockIcon />}
              onClick={openFolderAccessModal}
              sx={primaryIconButton}
            >
              Manage Access
            </Button>
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={() => refetchFolders()}
              disabled={loading}
              sx={outlinedIconButton}
            >
              {loading ? 'Loading...' : 'Refresh Folders'}
            </Button>
          </Stack>
        </Box>

        {clientFolders.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <FolderOpenIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" fontWeight="500" gutterBottom>
              No client folders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create folders in your S3 bucket: client-access-reports/your-client-name/
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {clientFolders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} key={folder}>
                <Card
                  sx={{
                    border: selectedFolder === folder ? 2 : 1,
                    borderColor: selectedFolder === folder ? 'success.main' : 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <CardActionArea onClick={() => handleFolderSelect(folder)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FolderIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="500">
                            {folder}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Client folder
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Selected Folder Reports */}
      {selectedFolder && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="600">
              Reports for {selectedFolder}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={() => setShowUploadModal(true)}
                sx={primaryIconButton}
              >
                Upload Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => refetchReports()}
                disabled={loadingReports}
                sx={outlinedIconButton}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          {loadingReports ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography>Loading reports...</Typography>
            </Box>
          ) : reports.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <DescriptionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" fontWeight="500" gutterBottom>
                No reports found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload some PDF reports for this client
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Last Modified</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.key} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PdfIcon sx={{ fontSize: 32, color: 'error.main', mr: 2 }} />
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {report.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              PDF Document
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{formatFileSize(report.size)}</TableCell>
                      <TableCell>{formatDate(report.lastModified)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleDownloadReport(report)}
                          title="Download"
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteReport(report)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Upload Modal */}
      <Dialog
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Upload Report</Typography>
            <IconButton onClick={() => setShowUploadModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Client Folder"
              value={selectedFolder}
              InputProps={{ readOnly: true }}
              fullWidth
              disabled
            />

            <TextField
              label="Report Name (Optional)"
              placeholder="Leave empty to use filename"
              value={uploadForm.reportName}
              onChange={(e) => setUploadForm({ ...uploadForm, reportName: e.target.value })}
              fullWidth
            />

            <TextField
              label="Description (Optional)"
              placeholder="Brief description of the report"
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <Box>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={outlinedIconButton}
                >
                  {uploadForm.file ? uploadForm.file.name : 'Choose PDF File'}
                </Button>
              </label>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Only PDF files are allowed (max 50MB)
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadModal(false)} sx={outlinedButton}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadReport}
            disabled={uploading || !uploadForm.file}
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
            sx={primaryIconButton}
          >
            {uploading ? 'Uploading...' : 'Upload Report'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Folder Access Management Modal */}
      <Dialog
        open={showFolderAccessModal}
        onClose={() => setShowFolderAccessModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Manage Client Folder Access</Typography>
            <IconButton onClick={() => setShowFolderAccessModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Grant Access Form */}
          <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Grant Folder Access
            </Typography>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={accessForm.clientId}
                    onChange={(e) => setAccessForm({ ...accessForm, clientId: e.target.value })}
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
                    onChange={(e) => setAccessForm({ ...accessForm, folderName: e.target.value })}
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
                  disabled={!accessForm.clientId || !accessForm.folderName || grantingAccess}
                  fullWidth
                  startIcon={grantingAccess ? <CircularProgress size={20} /> : <AddIcon />}
                  sx={primaryIconButton}
                >
                  {grantingAccess ? 'Granting...' : 'Grant'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Current Access List */}
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Current Access Permissions
          </Typography>

          {loadingAccess ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading access permissions...</Typography>
            </Box>
          ) : folderAccess.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      onClick={() => handleRevokeFolderAccess(access.clientId, access.folderName)}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification?.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}


