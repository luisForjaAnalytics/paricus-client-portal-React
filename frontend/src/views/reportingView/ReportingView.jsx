import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

export const ReportingView = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessibleFolders, setAccessibleFolders] = useState([]);
  const [folderReports, setFolderReports] = useState({});
  const [loadingFolders, setLoadingFolders] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadClientReports();
  }, []);

  const loadAccessibleFolders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/reports/client-folders-accessible');
      const folders = response.data.folders || [];
      setAccessibleFolders(folders);

      // Initialize loading states
      const loadingState = {};
      folders.forEach(folder => {
        loadingState[folder] = false;
      });
      setLoadingFolders(loadingState);

      // Auto-load reports for each accessible folder
      for (const folder of folders) {
        await loadFolderReports(folder);
      }
    } catch (err) {
      console.error('Error loading accessible folders:', err);
      setError(err.response?.data?.message || 'Failed to load accessible folders');
      setAccessibleFolders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFolderReports = async (folder) => {
    setLoadingFolders(prev => ({ ...prev, [folder]: true }));

    try {
      const response = await axios.get(`/api/reports/client/${folder}`);
      setFolderReports(prev => ({ ...prev, [folder]: response.data.reports || [] }));
    } catch (err) {
      console.error(`Error loading reports for folder ${folder}:`, err);
      showNotification(`Failed to load reports for ${folder}`, 'error');
      setFolderReports(prev => ({ ...prev, [folder]: [] }));
    } finally {
      setLoadingFolders(prev => ({ ...prev, [folder]: false }));
    }
  };

  const loadClientReports = async () => {
    await loadAccessibleFolders();
  };

  const downloadReport = async (report, folder) => {
    try {
      const fileName = report.name;
      showNotification('Generating download link...', 'info');

      const response = await axios.get(`/api/reports/download/${folder}/${encodeURIComponent(fileName)}`);

      if (response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
        showNotification('Download started', 'success');
      } else {
        throw new Error('No download URL received');
      }
    } catch (err) {
      console.error('Error downloading report:', err);
      showNotification(err.response?.data?.message || 'Failed to download report', 'error');
    }
  };

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
              onClick={loadClientReports}
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
              <Button variant="contained" onClick={loadClientReports}>
                Try Again
              </Button>
            </Box>
          )}

          {/* Folders Section */}
          {!loading && !error && accessibleFolders.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {accessibleFolders.map((folder) => (
                <Paper key={folder} variant="outlined" sx={{ p: 2 }}>
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
                      startIcon={loadingFolders[folder] ? <CircularProgress size={16} /> : <RefreshIcon />}
                      onClick={() => loadFolderReports(folder)}
                      disabled={loadingFolders[folder]}
                    >
                      {loadingFolders[folder] ? 'Loading...' : 'Refresh Reports'}
                    </Button>
                  </Box>

                  {/* Reports Grid */}
                  {folderReports[folder] && folderReports[folder].length > 0 ? (
                    <Grid container spacing={2}>
                      {folderReports[folder].map((report) => (
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
                  ) : !loadingFolders[folder] ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No reports found in this folder
                      </Typography>
                    </Box>
                  ) : null}
                </Paper>
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

