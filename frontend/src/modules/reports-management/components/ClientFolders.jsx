import { useState, useMemo, Fragment } from "react";
import PropTypes from "prop-types";
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
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UploadReportModal } from "./UploadReportModal";
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
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("folder");
  const [order, setOrder] = useState("asc");

  const toggleRow = (rowId, folder) => {
    try {
      const isExpanding = !expandedRows[rowId];

      setExpandedRows((prev) => ({
        ...prev,
        [rowId]: isExpanding,
      }));

      // Reports are already loaded on mount, no need to fetch here
    } catch (err) {
      console.error(`ERROR toggleRow: ${err}`);
    }
  };

  const handleChangePage = (event, newPage) => {
    try {
      setPage(newPage);
    } catch (err) {
      console.error(`ERROR handleChangePage: ${err}`);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    try {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    } catch (err) {
      console.error(`ERROR handleChangeRowsPerPage: ${err}`);
    }
  };

  const handleRequestSort = (property) => {
    try {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    } catch (err) {
      console.error(`ERROR handleRequestSort: ${err}`);
    }
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
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
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
            {t("reportsManagement.clientFolders.title")}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<LockIcon />}
              onClick={openFolderAccessModal}
              sx={primaryIconButton}
            >
              {t("reportsManagement.clientFolders.manageAccess")}
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
              {loading
                ? t("reportsManagement.clientFolders.loading")
                : t("reportsManagement.clientFolders.refreshFolders")}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ textAlign: "center", py: 8 }}>
          <FolderIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            {t("reportsManagement.clientFolders.noFoldersFound")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("reportsManagement.clientFolders.noFoldersMessage")}
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
          {t("reportsManagement.clientFolders.title")}
        </Typography>

        {/* Acction bottons */}
        {/* <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<LockIcon />}
            onClick={openFolderAccessModal}
            sx={primaryIconButton}
          >
            {t("reportsManagement.clientFolders.manageAccess")}
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
            {loading
              ? t("reportsManagement.clientFolders.loading")
              : t("reportsManagement.clientFolders.refreshFolders")}
          </Button>
        </Stack> */}
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
                  {t("reportsManagement.clientFolders.columnFolder")}
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
                  {t("reportsManagement.clientFolders.columnReports")}
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
                          variant="body2"
                          fontWeight={500}
                          sx={{
                            fontSize: typography.fontSize.body,
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
                  <TableRow
                    key={`collapse-${index}`}
                    sx={{ backgroundColor: colors.backgroundOpenSubSection }}
                  >
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={3}
                    >
                      <Collapse
                        in={expandedRows[index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box
                          sx={{
                            py: 3,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<UploadIcon />}
                                onClick={() => setShowUploadModal(folder)}
                                sx={primaryIconButton}
                              >
                                {t("reportsManagement.reports.uploadReport")}
                              </Button>
                            </Stack>
                          </Box>

                          {loadingReports ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                              <CircularProgress size={36} sx={{ mb: 1 }} />
                              <Typography variant="body2">
                                {t("reportsManagement.reports.loadingReports")}
                              </Typography>
                            </Box>
                          ) : folderReports.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                              <DescriptionIcon
                                sx={{
                                  fontSize: 48,
                                  color: "text.disabled",
                                  mb: 1,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t(
                                  "reportsManagement.reports.noReportsForFolder"
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <TableContainer
                              sx={{
                                backgroundColor: "transparent",
                                borderRadius: "1rem",
                                overflow: "hidden",
                              }}
                            >
                              <Table size="small">
                                <TableHead sx={table.header}>
                                  <TableRow>
                                    <TableCell sx={table.headerCell}>
                                      {t("reportsManagement.reports.fileName")}
                                    </TableCell>
                                    <TableCell sx={table.headerCell}>
                                      {t("reportsManagement.reports.size")}
                                    </TableCell>
                                    <TableCell sx={table.headerCell}>
                                      {t(
                                        "reportsManagement.reports.lastModified"
                                      )}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        ...table.headerCell,
                                        textAlign: "right",
                                      }}
                                    >
                                      {t("reportsManagement.reports.actions")}
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody sx={table.body}>
                                  {folderReports.map((report) => (
                                    <TableRow key={report.key} sx={table.row}>
                                      <TableCell sx={table.cell}>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <PdfIcon
                                            sx={{
                                              color: colors.error,
                                              fontSize: 20,
                                            }}
                                          />
                                          <Box>
                                            <Typography
                                              sx={{
                                                fontSize:
                                                  typography.fontSize.small,
                                                fontWeight:
                                                  typography.fontWeight.medium,
                                                fontFamily:
                                                  typography.fontFamily,
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
                                      <TableCell
                                        sx={{
                                          ...table.cell,
                                          textAlign: "right",
                                        }}
                                      >
                                        <Stack
                                          direction="row"
                                          spacing={0.5}
                                          justifyContent="flex-end"
                                        >
                                          <Tooltip
                                            title={t(
                                              "reportsManagement.reports.download"
                                            )}
                                          >
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                handleDownloadReport(
                                                  folder,
                                                  report
                                                )
                                              }
                                              sx={{
                                                color: colors.primary,
                                                "&:hover": {
                                                  backgroundColor:
                                                    colors.primaryLight,
                                                },
                                              }}
                                            >
                                              <DownloadIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip
                                            title={t(
                                              "reportsManagement.reports.delete"
                                            )}
                                          >
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                handleDeleteReport(
                                                  folder,
                                                  report
                                                )
                                              }
                                              sx={{
                                                color: colors.error,
                                                "&:hover": {
                                                  backgroundColor:
                                                    colors.errorContainer,
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
      <UploadReportModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        uploadForm={uploadForm}
        setUploadForm={setUploadForm}
        handleFileSelect={handleFileSelect}
        handleUploadReport={handleUploadReport}
        uploading={uploading}
        fileInputRef={fileInputRef}
        selectedFolderForUpload={selectedFolderForUpload}
      />
    </Box>
  );
};

ClientFolders.propTypes = {
  clientFolders: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  refetchFolders: PropTypes.func.isRequired,
  openFolderAccessModal: PropTypes.func.isRequired,
  reports: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        lastModified: PropTypes.string.isRequired,
      })
    )
  ),
  loadingReports: PropTypes.bool,
  fetchReportsForFolder: PropTypes.func.isRequired,
  handleDownloadReport: PropTypes.func.isRequired,
  handleDeleteReport: PropTypes.func.isRequired,
  formatFileSize: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  showUploadModal: PropTypes.string,
  setShowUploadModal: PropTypes.func.isRequired,
  uploadForm: PropTypes.shape({
    reportName: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.object,
  }).isRequired,
  setUploadForm: PropTypes.func.isRequired,
  handleFileSelect: PropTypes.func.isRequired,
  handleUploadReport: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  selectedFolderForUpload: PropTypes.string,
};

ClientFolders.defaultProps = {
  clientFolders: [],
  loading: false,
  reports: {},
  loadingReports: false,
  showUploadModal: null,
  selectedFolderForUpload: null,
};

export default ClientFolders;
