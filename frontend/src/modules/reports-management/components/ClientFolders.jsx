import { useState, useMemo, Fragment } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  PictureAsPdf as PdfIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import {
  card,
  colors,
  typography,
  titlesTypography,
  primaryIconButton,
  outlinedIconButton,
  table,
} from "../../../common/styles/styles";

export const ClientFolders = ({
  clientFolders = [],
  loading = false,
  refetchFolders,
  openFolderAccessModal,
  reports = {},
  loadingReports = false,
  fetchReportsForFolder,
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
  fileInputRef,
  selectedFolderForUpload,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("folder");
  const [order, setOrder] = useState("asc");

  const toggleRow = (rowId, folder) => {
    const isExpanding = !expandedRows[rowId];

    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: isExpanding,
    }));

    // Reports are already loaded on mount, no need to fetch here
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sort and paginate data
  const sortedData = useMemo(() => {
    const sorted = [...clientFolders].sort((a, b) => {
      if (orderBy === "reports") {
        const aReports = (reports[a] || []).length;
        const bReports = (reports[b] || []).length;
        if (order === "asc") {
          return aReports - bReports;
        } else {
          return bReports - aReports;
        }
      } else {
        // Sort by folder name
        if (order === "asc") {
          return a.localeCompare(b);
        } else {
          return b.localeCompare(a);
        }
      }
    });
    return sorted;
  }, [clientFolders, order, orderBy, reports]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Early return if no data - after all hooks
  if (clientFolders.length === 0 && !loading) {
    return (
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
              startIcon={
                loading ? <CircularProgress size={20} /> : <RefreshIcon />
              }
              onClick={() => refetchFolders()}
              disabled={loading}
              sx={outlinedIconButton}
            >
              {loading ? "Loading..." : "Refresh Folders"}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ textAlign: "center", py: 8 }}>
          <FolderIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            No client folders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create folders in your S3 bucket: client-access-reports/your-client-name/
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
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
            startIcon={
              loading ? <CircularProgress size={20} /> : <RefreshIcon />
            }
            onClick={() => refetchFolders()}
            disabled={loading}
            sx={outlinedIconButton}
          >
            {loading ? "Loading..." : "Refresh Folders"}
          </Button>
        </Stack>
      </Box>

      <TableContainer
        sx={{
          ...card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: colors.background,
              borderBottom: `2px solid ${colors.border}`,
            }}
          >
            <TableRow>
              <TableCell sx={{ width: 60 }} />
              <TableCell>
                <TableSortLabel
                  active={orderBy === "folder"}
                  direction={orderBy === "folder" ? order : "asc"}
                  onClick={() => handleRequestSort("folder")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  CLIENT FOLDER
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "reports"}
                  direction={orderBy === "reports" ? order : "asc"}
                  onClick={() => handleRequestSort("reports")}
                  sx={{
                    fontWeight: typography.fontWeight.bold,
                    textTransform: "uppercase",
                    fontSize: typography.fontSize.tableHeader,
                    fontFamily: typography.fontFamily,
                    color: colors.textMuted,
                    letterSpacing: "0.05em",
                    "& .MuiTableSortLabel-icon": {
                      color: `${colors.primary} !important`,
                    },
                  }}
                >
                  REPORTS
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((folder, index) => {
              const folderReports = reports[folder] || [];
              return (
                <Fragment key={index}>
                  <TableRow
                    
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                      },
                    }}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(index, folder)}
                        sx={{ color: colors.primary }}
                      >
                        {expandedRows[index] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <FolderIcon
                          sx={{
                            fontSize: 32,
                            color: colors.primary,
                          }}
                        />
                        <Typography
                        variant="body2" fontWeight={500}
                          sx={{
                            fontSize: typography.fontSize.body,
                            //fontWeight: typography.fontWeight.semibold,
                            color: colors.textPrimary,
                            fontFamily: typography.fontFamily,
                          }}
                        >
                          {folder}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.body,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.textPrimary,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        {folderReports.length}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow key={`collapse-${index}`}>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={3}
                    >
                      <Collapse in={expandedRows[index]} timeout="auto" unmountOnExit>
                        <Box
                          sx={{
                            py: 3,
                            bgcolor: colors.surface,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: typography.fontWeight.semibold,
                                fontFamily: typography.fontFamily,
                              }}
                            >
                              {folder} Reports
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<UploadIcon />}
                                onClick={() => setShowUploadModal(folder)}
                                sx={primaryIconButton}
                              >
                                Upload Report
                              </Button>
                            </Stack>
                          </Box>

                          {loadingReports ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                              <CircularProgress size={36} sx={{ mb: 1 }} />
                              <Typography variant="body2">Loading reports...</Typography>
                            </Box>
                          ) : folderReports.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                              <DescriptionIcon
                                sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                No reports found for this folder
                              </Typography>
                            </Box>
                          ) : (
                            <TableContainer
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "0.5rem",
                                overflow: "hidden",
                              }}
                            >
                              <Table size="small">
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
                                  {folderReports.map((report) => (
                                    <TableRow key={report.key} sx={table.row}>
                                      <TableCell sx={table.cell}>
                                        <Box
                                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                        >
                                          <PdfIcon sx={{ color: colors.error, fontSize: 20 }} />
                                          <Box>
                                            <Typography
                                              sx={{
                                                fontSize: typography.fontSize.small,
                                                fontWeight: typography.fontWeight.medium,
                                                fontFamily: typography.fontFamily,
                                                color: colors.textPrimary,
                                              }}
                                            >
                                              {report.name}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell sx={table.cell}>
                                        <Typography
                                          sx={{
                                            fontSize: typography.fontSize.small,
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
                                            fontSize: typography.fontSize.small,
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
                                              onClick={() => handleDownloadReport(folder, report)}
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
                                              onClick={() => handleDeleteReport(folder, report)}
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
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={clientFolders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ...card,
          borderTop: `1px solid ${colors.border}`,
          mt: 0,
        }}
      />

      {/* Upload Modal */}
      <Dialog
        open={!!showUploadModal}
        onClose={() => setShowUploadModal(null)}
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
            <IconButton onClick={() => setShowUploadModal(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Client Folder"
              value={selectedFolderForUpload || ""}
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
            onClick={() => setShowUploadModal(null)}
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

export default ClientFolders;
