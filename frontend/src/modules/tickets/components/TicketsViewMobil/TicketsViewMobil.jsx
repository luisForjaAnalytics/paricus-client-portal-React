import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Chip } from "@mui/material";
import { ConfirmationNumber as TicketIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UniversalMobilDataTable } from "../../../../common/components/ui/UniversalMobilDataTable";
import { colors } from "../../../../common/styles/styles";
import {
  getPriorityStyles,
  getStatusStyles,
} from "../../../../common/utils/getStatusProperty";

export const TicketsViewMobil = ({
  tickets = [],
  isLoading = false,
  error = null,
  onRowClick,
  headerActions,
  subHeader,
}) => {
  const { t } = useTranslation();

  // Define columns for accordion table
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("tickets.table.ticketId"),
        labelWidth: 110,
      },
      {
        field: "lastUpdate",
        headerName: t("tickets.table.lastUpdate"),
        labelWidth: 110,
      },
      {
        field: "from",
        headerName: t("tickets.table.from"),
        labelWidth: 110,
      },
      {
        field: "assignedTo",
        headerName: t("tickets.table.assignedTo"),
        labelWidth: 110,
      },
      {
        field: "priority",
        headerName: t("tickets.table.priority"),
        labelWidth: 110,
        renderCell: ({ value }) => {
          const styles = getPriorityStyles(value);
          return (
            <Chip
              label={value}
              sx={{
                ...styles,
                fontWeight: "medium",
                fontSize: "0.75rem",
              }}
              size="small"
            />
          );
        },
      },
      {
        field: "status",
        headerName: t("tickets.table.status"),
        labelWidth: 110,
        renderCell: ({ value }) => {
          const styles = getStatusStyles(value);
          return (
            <Chip
              label={value}
              sx={{
                ...styles,
                fontWeight: "medium",
                fontSize: "0.75rem",
              }}
              size="small"
            />
          );
        },
      },
    ],
    [t],
  );

  // Primary icon for each row
  const renderPrimaryIcon = <TicketIcon fontSize="small" sx={{ color: colors.primary }} />;

  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <UniversalMobilDataTable
        rows={tickets}
        columns={columns}
        primaryField="subject"
        primaryIcon={renderPrimaryIcon}
        secondaryField={(row) => `#${row.id}`}
        showTitle={true}
        titleField="subject"
        headerTitle={t("tickets.sectionTitle")}
        headerActions={headerActions}
        subHeader={subHeader}
        loading={isLoading}
        error={error}
        emptyMessage={t("tickets.noTicketsFound")}
        labelWidth={110}
        getRowId={(row) => row.id}
        onRowClick={onRowClick}
      />
    </Box>
  );
};

TicketsViewMobil.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      subject: PropTypes.string,
      from: PropTypes.string,
      assignedTo: PropTypes.string,
      priority: PropTypes.string,
      status: PropTypes.string,
      lastUpdate: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onRowClick: PropTypes.func,
  headerActions: PropTypes.node,
  subHeader: PropTypes.node,
};

TicketsViewMobil.defaultProps = {
  tickets: [],
  isLoading: false,
  error: null,
  onRowClick: null,
};
