import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { titlesTypography } from "../../../../common/styles/styles";

function Row({ log, formatTimestamp, getEventTypeColor, getStatusColor, cleanIpAddress }) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const toggleOpen = () => {
    try {
      setOpen(!open);
    } catch (err) {
      console.error(`ERROR toggleOpen: ${err}`);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={toggleOpen}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <ListAltIcon fontSize="small" color="primary" />
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {log.description}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                fontWeight="bold"
              >
                {t("userManagement.logs.logDetails")}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Event ID */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.eventId")}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      wordBreak: "break-all",
                    }}
                  >
                    {log.id}
                  </Typography>
                </Box>

                {/* Timestamp */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.timestamp")}:
                  </Typography>
                  <Typography variant="body2">
                    {formatTimestamp(log.timestamp)}
                  </Typography>
                </Box>

                {/* User ID */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.userId")}:
                  </Typography>
                  <Typography variant="body2">{log.userId}</Typography>
                </Box>

                {/* Event Type */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.eventType")}:
                  </Typography>
                  <Box>
                    <Chip
                      label={log.eventType}
                      color={getEventTypeColor(log.eventType)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {/* Entity */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.entity")}:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {log.entity}
                  </Typography>
                </Box>

                {/* Description */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.description")}:
                  </Typography>
                  <Typography variant="body2">{log.description}</Typography>
                </Box>

                {/* IP Address */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.ipAddress")}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {cleanIpAddress(log.ipAddress)}
                  </Typography>
                </Box>

                {/* Status */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("userManagement.logs.status")}:
                  </Typography>
                  <Box>
                    <Chip
                      label={log.status}
                      color={getStatusColor(log.status)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    eventType: PropTypes.string.isRequired,
    entity: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    ipAddress: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
  formatTimestamp: PropTypes.func.isRequired,
  getEventTypeColor: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  cleanIpAddress: PropTypes.func.isRequired,
};

export const LogsViewMobile = ({
  logs = [],
  isLoading = false,
  error = null,
  formatTimestamp,
  getEventTypeColor,
  getStatusColor,
  cleanIpAddress,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("userManagement.logs.errorLoading")}:{" "}
          {error?.data?.error || error?.error || t("userManagement.logs.unknownError")}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Table */}
      {!isLoading && (
        <TableContainer
          component={Paper}
          sx={{
            mt: 1,
            maxHeight: "70vh",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c5c5c5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#9e9e9e",
            },
          }}
        >
          <Table aria-label="logs table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#f5f5f5" }} />
                <TableCell sx={{ backgroundColor: "#f5f5f5" }}>
                  <Typography sx={titlesTypography.sectionTitle}>
                    {t("userManagement.logs.label")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <Row
                  key={log.id}
                  log={log}
                  formatTimestamp={formatTimestamp}
                  getEventTypeColor={getEventTypeColor}
                  getStatusColor={getStatusColor}
                  cleanIpAddress={cleanIpAddress}
                />
              ))}
              {logs.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <ListAltIcon
                        sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {t("userManagement.logs.noLogsFound")}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

LogsViewMobile.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired,
      eventType: PropTypes.string.isRequired,
      entity: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      ipAddress: PropTypes.string,
      status: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  formatTimestamp: PropTypes.func.isRequired,
  getEventTypeColor: PropTypes.func.isRequired,
  getStatusColor: PropTypes.func.isRequired,
  cleanIpAddress: PropTypes.func.isRequired,
};

LogsViewMobile.defaultProps = {
  logs: [],
  isLoading: false,
  error: null,
};
