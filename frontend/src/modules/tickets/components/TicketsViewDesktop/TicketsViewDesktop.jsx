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
import { TicketAdvancedFilters } from "../AdvancedFilters/TicketAdvancedFilters";
import { getPriorityStyles, getStatusStyles } from "../../../../common/utils/getStatusProperty";

export const TicketsViewDesktop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data = [], isLoading, isError, refetch } = useGetTicketsQuery();

  // Filters state
  const [filters, setFilters] = useState({
    ticketId: "",
    subject: "",
    from: "",
    assignedTo: "",
    priority: "",
    status: "",
    lastUpdate: "",
  });

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      ticketId: "",
      subject: "",
      from: "",
      assignedTo: "",
      priority: "",
      status: "",
      lastUpdate: "",
    });
  };

  // Filter tickets based on advanced filters
  const filteredTickets = useMemo(() => {
    if (!filters.ticketId && !filters.subject && !filters.from && !filters.assignedTo && !filters.priority && !filters.status && !filters.lastUpdate) {
      return data;
    }

    return data.filter((ticket) => {
      const matchesTicketId = filters.ticketId
        ? String(ticket.id).includes(filters.ticketId)
        : true;

      const matchesSubject = filters.subject
        ? ticket.subject?.toLowerCase().includes(filters.subject.toLowerCase())
        : true;

      const fromName = ticket.user
        ? `${ticket.user.firstName} ${ticket.user.lastName}`.toLowerCase()
        : "unknown";
      const matchesFrom = filters.from
        ? fromName.includes(filters.from.toLowerCase())
        : true;

      const assignedToName = ticket.assignedTo
        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`.toLowerCase()
        : "unassigned";
      const matchesAssignedTo = filters.assignedTo
        ? assignedToName.includes(filters.assignedTo.toLowerCase())
        : true;

      const matchesPriority = filters.priority
        ? ticket.priority?.toLowerCase() === filters.priority.toLowerCase()
        : true;

      const matchesStatus = filters.status
        ? ticket.status?.toLowerCase() === filters.status.toLowerCase()
        : true;

      const matchesLastUpdate = filters.lastUpdate
        ? formatDateTime(ticket.updatedAt)?.startsWith(filters.lastUpdate)
        : true;

      return matchesTicketId && matchesSubject && matchesFrom && matchesAssignedTo && matchesPriority && matchesStatus && matchesLastUpdate;
    });
  }, [data, filters]);

  // Transform data for DataGrid if needed
  const rows = useMemo(() => {
    try {
      return filteredTickets.map((ticket) => ({
        id: ticket.id,
        lastUpdate: formatDateTime(ticket.updatedAt),
        subject: ticket.subject,
        from: ticket.user
          ? `${ticket.user.firstName} ${ticket.user.lastName}`
          : "Unknown",
        assignedTo: ticket.assignedTo
          ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
          : "Unassigned",
        priority: ticket.priority,
        status: ticket.status,
      }));
    } catch (error) {
      console.error("Error transforming ticket data:", error);
      return [];
    }
  }, [filteredTickets]);



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

      {/* Advanced Filters - Rendered outside DataGrid */}
      {isOpen && (
        <Box
          sx={{
            padding: "0.2rem 0 1rem 0",
            display: { xs: "none", md: "flex" },
            justifyContent: "left",
            alignItems: "center",
            backgroundColor: colors.subSectionBackground,
            borderBottom: `1px solid ${colors.subSectionBorder}`,
            marginBottom: 1,
          }}
        >
          <TicketAdvancedFilters
            filters={filters}
            setFilters={setFilters}
            refetch={refetch}
            isDebouncing={false}
            loading={isLoading}
            clearFilters={clearFilters}
          />
        </Box>
      )}

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
          autoHeight={true}
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
