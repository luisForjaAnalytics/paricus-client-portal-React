import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Typography,
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import {
  useGetAccessibleFoldersQuery,
  useGetClientReportsQuery,
  useLazyDownloadReportQuery,
} from '../../store/api/reportsApi';

// Component to display a single folder's reports using RTK Query
const FolderReportsSection = ({ folder, downloadReport }) => {
  const {
    data: reports = [],
    isLoading,
    refetch
  } = useGetClientReportsQuery(folder);

  const formatFolderName = (folderName) => {
    return folderName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FolderIcon color="primary" />
          <Typography variant="h6" component="h3">
            {formatFolderName(folder)}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh Reports'}
        </Button>
      </Box>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <Grid container spacing={2}>
          {reports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report.key}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 2,
                    bgcolor: 'action.hover'
                  },
                  transition: 'all 0.2s'
                }}
                onClick={() => downloadReport(report, folder)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <PdfIcon sx={{ fontSize: 32, color: 'error.main', flexShrink: 0 }} />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {report.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatFileSize(report.size)}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" display="block">
                      {formatDate(report.lastModified)}
                    </Typography>
                  </Box>
                  <IconButton size="small" color="primary">
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : !isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No reports found in this folder
          </Typography>
        </Box>
      ) : null}
    </Paper>
  );
};

export const ReportingView = () => {
  // RTK Query hooks
  const {
    data: accessibleFolders = [],
    isLoading: loading,
    error: apiError,
    refetch,
  } = useGetAccessibleFoldersQuery();

  const [getDownloadUrl] = useLazyDownloadReportQuery();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Derived error message
  const error = apiError?.data?.message || apiError?.error || '';

  const downloadReport = async (report, folder) => {
    try {
      const fileName = report.name;
      showNotification('Generating download link...', 'info');

      const result = await getDownloadUrl({ folder, fileName }).unwrap();

      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
        showNotification('Download started', 'success');
      } else {
        throw new Error('No download URL received');
      }
    } catch (err) {
      console.error('Error downloading report:', err);
      showNotification(err.data?.message || 'Failed to download report', 'error');
    }
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Power BI Dashboard */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
            Operations Dashboard
          </Typography>
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <iframe
              title="LinkLive - Operations Dashboard"
              width="100%"
              height="600"
              src="https://app.powerbi.com/reportEmbed?reportId=ba4c808d-3d64-428e-94a0-ccc0be060f40&autoAuth=true&ctid=b850aa77-85c3-4720-80ca-97ae75dca583"
              frameBorder="0"
              allowFullScreen={true}
              style={{ width: '100%' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* PDF Reports Section */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2" fontWeight={600}>
              Your Reports
            </Typography>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              onClick={() => refetch()}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Reports'}
            </Button>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography color="text.secondary">Loading your reports...</Typography>
            </Box>
          )}

          {/* Error State */}
          {!loading && error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Error loading reports
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button variant="contained" onClick={() => refetch()}>
                Try Again
              </Button>
            </Box>
          )}

          {/* Folders Section */}
          {!loading && !error && accessibleFolders.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {accessibleFolders.map((folder) => (
                <FolderReportsSection
                  key={folder}
                  folder={folder}
                  downloadReport={downloadReport}
                />
              ))}
            </Box>
          )}

          {/* No Reports State */}
          {!loading && !error && accessibleFolders.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No reports available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reports will appear here when they are uploaded by our team
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

