import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Chip, Typography } from "@mui/material";
import { ListAlt as ListAltIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UniversalMobilDataTable } from "../../../../common/components/ui/UniversalMobilDataTable";

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

  // Transform logs to rows
  const rows = useMemo(() => {
    return logs.map((log) => ({
      ...log,
      formattedTimestamp: formatTimestamp(log.timestamp),
      formattedIpAddress: cleanIpAddress(log.ipAddress),
    }));
  }, [logs, formatTimestamp, cleanIpAddress]);

  // Define columns for accordion table
  const columns = useMemo(() => [
    {
      field: "id",
      headerName: t("userManagement.logs.eventId"),
      labelWidth: 100,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.75rem",
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "formattedTimestamp",
      headerName: t("userManagement.logs.timestamp"),
      labelWidth: 100,
    },
    {
      field: "userId",
      headerName: t("userManagement.logs.userId"),
      labelWidth: 100,
    },
    {
      field: "eventType",
      headerName: t("userManagement.logs.eventType"),
      labelWidth: 100,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={getEventTypeColor(value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "entity",
      headerName: t("userManagement.logs.entity"),
      labelWidth: 100,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: t("userManagement.logs.description"),
      labelWidth: 100,
    },
    {
      field: "formattedIpAddress",
      headerName: t("userManagement.logs.ipAddress"),
      labelWidth: 100,
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: t("userManagement.logs.status"),
      labelWidth: 100,
      renderCell: ({ value }) => (
        <Chip label={value} variant="outlined" color={getStatusColor(value)} size="small" />
      ),
    },
  ], [t, getEventTypeColor, getStatusColor]);

  // Primary icon for each row
  const renderPrimaryIcon = <ListAltIcon fontSize="small" color="primary" />;

  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <UniversalMobilDataTable
        rows={rows}
        columns={columns}
        primaryField="description"
        primaryIcon={renderPrimaryIcon}
        showTitle={true}
        titleField="description"
        headerTitle={t("userManagement.logs.label")}
        loading={isLoading}
        error={error}
        emptyMessage={t("userManagement.logs.noLogsFound")}
        labelWidth={100}
        getRowId={(row) => row.id}
      />
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
