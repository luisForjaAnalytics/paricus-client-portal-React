import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
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
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import {
  primaryIconButton,
  outlinedIconButton,
  table,
  colors,
  typography,
  titlesTypography,
  reportsCardSelected,
} from "../../../common/styles/styles";

export const ClientReports = ({
  selectedFolder,
  reports = [],
  loadingReports = false,
  refetchReports,
  handleDownloadReport,
  handleDeleteReport,
  formatFileSize,
  formatDate,
  showUploadModal,
  setShowUploadModal,
  uploadForm,
  setUploadForm,
  handleFileSelect,
  handleUploadReport,
  uploading,
}) => {
  const fileInputRef = useRef(null);

  if (!selectedFolder) {
    return null;
  }

  return (
    <Box
    sx={{
      ...reportsCardSelected,
    }}
    >
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              ...titlesTypography.primaryTitle,
            }}
          >
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
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography>Loading reports...</Typography>
          </Box>
        ) : reports.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <DescriptionIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" fontWeight="500" gutterBottom>
              No reports found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload some PDF reports for this client
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              backgroundColor: "transparent",
              borderRadius: "1rem",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Table>
              <TableHead sx={table.header}>
                <TableRow>
                  <TableCell sx={table.headerCell}>File Name</TableCell>
                  <TableCell sx={table.headerCell}>Size</TableCell>
                  <TableCell sx={table.headerCell}>Last Modified</TableCell>
                  <TableCell sx={{ ...table.headerCell, textAlign: "right" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={table.body}>
                {reports.map((report) => (
                  <TableRow key={report.key} sx={table.row}>
                    <TableCell sx={table.cell}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PdfIcon sx={{ color: colors.error, fontSize: 20 }} />
                        <Box>
                          <Typography
                            sx={{
                              fontSize: typography.fontSize.body,
                              fontWeight: typography.fontWeight.bold,
                              fontFamily: typography.fontFamily,
                              color: colors.textPrimary,
                            }}
                          >
                            {report.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: typography.fontSize.small,
                              color: colors.textMuted,
                              fontFamily: typography.fontFamily,
                            }}
                          >
                            PDF Document
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={table.cell}>
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontFamily: typography.fontFamily,
                          color: colors.textPrimary,
                        }}
                      >
                        {formatFileSize(report.size)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={table.cell}>
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontFamily: typography.fontFamily,
                          color: colors.textPrimary,
                        }}
                      >
                        {formatDate(report.lastModified)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...table.cell, textAlign: "right" }}>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadReport(report)}
                            sx={{
                              color: colors.primary,
                              "&:hover": {
                                backgroundColor: colors.primaryLight,
                              },
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReport(report)}
                            sx={{
                              color: colors.error,
                              "&:hover": {
                                backgroundColor: colors.errorContainer,
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Upload Modal */}
      <Dialog
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        maxWidth="sm"
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
              onChange={(e) =>
                setUploadForm({ ...uploadForm, reportName: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Description (Optional)"
              placeholder="Brief description of the report"
              value={uploadForm.description}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, description: e.target.value })
              }
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
                style={{ display: "none" }}
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
                  {uploadForm.file ? uploadForm.file.name : "Choose PDF File"}
                </Button>
              </label>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Only PDF files are allowed (max 50MB)
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowUploadModal(false)}
            sx={outlinedIconButton}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadReport}
            disabled={uploading || !uploadForm.file}
            startIcon={
              uploading ? <CircularProgress size={20} /> : <UploadIcon />
            }
            sx={primaryIconButton}
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientReports;
