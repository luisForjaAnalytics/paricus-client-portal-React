import { useState, useMemo, useCallback } from "react";
import { Box, Tooltip, IconButton, Chip } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors } from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { CreateTickeButton } from "../CreateTicketButton";
import { useGetTicketsQuery } from "../../../../store/api/ticketsApi";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";
import { getPriorityStyles, getStatusStyles } from "../../../../common/utils/getStatusProperty";
import { TicketsViewMobil } from "../TicketsViewMobil/TicketsViewMobil";

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

  // Handler para cambiar filtros desde el header
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: value,
      }));
    },
    [setFilters]
  );

  // Options for select filters
  const priorities = [
    { name: "Low", value: "low" },
    { name: "Medium", value: "medium" },
    { name: "High", value: "high" },
  ];
  const statuses = [
    { name: "Open", value: "open" },
    { name: "In Progress", value: "in progress" },
    { name: "Resolved", value: "resolved" },
    { name: "Closed", value: "closed" },
  ];

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

      const assignedToName = ticket.department
        ? ticket.department.name.toLowerCase()
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
        assignedTo: ticket.department
          ? ticket.department.name
          : "Unassigned",
        priority: ticket.priority,
        status: ticket.status,
      }));
    } catch (error) {
      console.error("Error transforming ticket data:", error);
      return [];
    }
  }, [filteredTickets]);



  // DataGrid columns with ColumnHeaderFilter
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("tickets.table.ticketId"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.ticketId")}
            filterType="text"
            filterKey="ticketId"
            filterValue={filters.ticketId}
            onFilterChange={handleFilterChange}
            placeholder={t("tickets.filters.ticketIdPlaceholder")}
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "lastUpdate",
        headerName: t("tickets.table.lastUpdate"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.lastUpdate")}
            filterType="date"
            filterKey="lastUpdate"
            filterValue={filters.lastUpdate}
            onFilterChange={handleFilterChange}
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "subject",
        headerName: t("tickets.table.subject"),
        width: 400,
        flex: 0,
        align: "left",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.subject")}
            filterType="text"
            filterKey="subject"
            filterValue={filters.subject}
            onFilterChange={handleFilterChange}
            placeholder={t("tickets.filters.subjectPlaceholder")}
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "from",
        headerName: t("tickets.table.from"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.from")}
            filterType="text"
            filterKey="from"
            filterValue={filters.from}
            onFilterChange={handleFilterChange}
            placeholder={t("tickets.filters.fromPlaceholder")}
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "assignedTo",
        headerName: t("tickets.table.assignedTo"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.assignedTo")}
            filterType="text"
            filterKey="assignedTo"
            filterValue={filters.assignedTo}
            onFilterChange={handleFilterChange}
            placeholder={t("tickets.filters.assignedToPlaceholder")}
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "priority",
        headerName: t("tickets.table.priority"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.priority")}
            filterType="select"
            filterKey="priority"
            filterValue={filters.priority}
            onFilterChange={handleFilterChange}
            options={priorities}
            labelKey="name"
            valueKey="value"
            isOpen={isOpen}
          />
        ),
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
        headerName: t("tickets.table.status"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.status")}
            filterType="select"
            filterKey="status"
            filterValue={filters.status}
            onFilterChange={handleFilterChange}
            options={statuses}
            labelKey="name"
            valueKey="value"
            isOpen={isOpen}
          />
        ),
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
      {
        field: "actions",
        headerName: t("tickets.table.actions"),
        width: 120,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("tickets.table.actions")}
            filterType="actions"
            isOpen={isOpen}
            onSearch={refetch}
            onClearFilters={clearFilters}
            loading={isLoading}
          />
        ),
        renderCell: () => null,
      },
    ],
    [t, filters, handleFilterChange, isOpen, priorities, statuses, isLoading, refetch, clearFilters]
  );

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
          autoHeight={true}
          onRowClick={(params) =>
            navigate(`/app/tickets/ticketTable/${params.id}`)
          }
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
          sx={{
            cursor: "pointer",
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Box>

      {/* Mobile View */}
      <TicketsViewMobil
        tickets={rows}
        isLoading={isLoading}
        error={isError ? t("tickets.errorLoading") : null}
        onRowClick={(row) => navigate(`/app/tickets/ticketTable/${row.id}`)}
      />

      {/* Nested routes outlet */}
      <Outlet />
    </Box>
  );
};
