import { useState, useMemo } from "react";
import { Box, Tooltip, IconButton, Chip } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors } from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { CreateTickeButton } from "../CreateTicketButton";
import { useGetTicketsQuery } from "../../../../store/api/ticketsApi";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import {
  UniversalDataGrid,
  useDataGridColumns,
} from "../../../../common/components/ui/DataGrid/UniversalDataGrid";

export const TicketsViewDesktop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data = [], isLoading, isError } = useGetTicketsQuery();

  // Transform data for DataGrid if needed
  const rows = useMemo(() => {
    try {
      return data.map((ticket) => ({
        id: ticket.id,
        lastUpdate: formatDateTime(ticket.updatedAt),
        subject: ticket.subject,
        from: ticket.user
          ? `${ticket.user.firstName} ${ticket.user.lastName}`
          : "Unknown",
        assignedTo: ticket.assignedTo || "Unassigned",
        priority: ticket.priority,
        status: ticket.status,
      }));
    } catch (error) {
      console.error("Error transforming ticket data:", error);
      return [];
    }
  }, [data]);

  // Helper function for priority styles
  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { backgroundColor: "#ffebee", color: "#c62828" };
      case "medium":
        return { backgroundColor: "#fff3e0", color: "#e65100" };
      case "low":
        return { backgroundColor: "#e3f2fd", color: "#1565c0" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#757575" };
    }
  };

  // Helper function for status styles
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return { backgroundColor: "#e3f2fd", color: "#1565c0" };
      case "in progress":
        return { backgroundColor: "#fff3e0", color: "#e65100" };
      case "resolved":
        return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
      case "closed":
        return { backgroundColor: "#f5f5f5", color: "#616161" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#616161" };
    }
  };

  // DataGrid columns using helper hook
  const columns = useDataGridColumns([
    {
      field: "id",
      headerNameKey: "tickets.table.ticketId",
      flex: 1,
    },
    {
      field: "lastUpdate",
      headerNameKey: "tickets.table.lastUpdate",
      flex: 1,
    },
    {
      field: "subject",
      headerNameKey: "tickets.table.subject",
      width: 400,
      flex: 0,
    },
    {
      field: "from",
      headerNameKey: "tickets.table.from",
      flex: 1,
    },
    {
      field: "assignedTo",
      headerNameKey: "tickets.table.assignedTo",
      flex: 1,
    },
    {
      field: "priority",
      headerNameKey: "tickets.table.priority",
      flex: 1,
      renderCell: (params) => {
        const styles = getPriorityStyles(params.value);
        return (
          <Chip
            label={params.value}
            sx={{
              ...styles,
              fontWeight: "medium",
              fontSize: "0.875rem",
              width: "100%",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "status",
      headerNameKey: "tickets.table.status",
      flex: 1,
      renderCell: (params) => {
        const styles = getStatusStyles(params.value);
        return (
          <Chip
            label={params.value}
            sx={{
              ...styles,
              fontWeight: "medium",
              fontSize: "0.875rem",
            }}
            size="small"
          />
        );
      },
    },
  ]);

  // Toolbar component for logs table with filter button
  const LogsToolbar = useMemo(() => {
    return () => (
      <>
        {isOpen && (
          <Box
            sx={{
              padding: "0.2rem 0 1rem 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.subSectionBackground,
              borderBottom: `1px solid ${colors.subSectionBorder}`,
            }}
          >
            {/* <AdvancedFilters
              filters={filters}
              setFilters={setFilters}
              refetch={refetch}
              isDebouncing={false}
              loading={isLoading}
              clearFilters={clearFilters}
            /> */}
          </Box>
        )}
      </>
    );
  }); // [t, totalRows, isOpen, filters, isLoading]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Action Buttons - Create Ticket and Filter */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 1,
          marginRight: 2,
          gap: 1,
        }}
      >
        <CreateTickeButton />

        <Tooltip title={t("tickets.filters")}>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            size="small"
            sx={{
              backgroundColor: colors?.backgroundOpenSubSection,
            }}
          >
            <FilterListIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* DataGrid */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          minHeight: "auto",
          width: "100%",
        }}
      >
        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          error={isError ? "Error loading tickets" : null}
          emptyMessage={t("tickets.noTicketsFound") || "No tickets found"}
          onRowClick={(params) =>
            navigate(`/app/tickets/ticketTable/${params.id}`)
          }
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{
            cursor: "pointer",
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Box>

      {/* Mobile View */}
      {/* <TicketsViewMobil
        logs={logs}
        isLoading={isLoading}
        error={error}
        formatTimestamp={formatTimestamp}
        getEventTypeColor={getEventTypeColor}
        getStatusColor={getStatusColor}
        cleanIpAddress={cleanIpAddress}
      /> */}

      {/* Nested routes outlet */}
      <Outlet />
    </Box>
  );
};
