import { useState, useMemo } from "react";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Outlet, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  colors,
  dataGridTable,
  typography,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { CreateTickeButton } from "../CreateTicketButton";
import { useGetTicketsQuery } from "../../../../store/api/ticketsApi";
import { formatDateTime } from "../../../../common/utils/formatDateTime";

export const TicketsViewDesktop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data = [], isLoading, isError } = useGetTicketsQuery();

  // Transform data for DataGrid if needed
  const rows = useMemo(() => {
    return data.map(ticket => ({
      id: ticket.id,
      lastUpdate: formatDateTime(ticket.updatedAt),
      subject: ticket.subject,
      from: ticket.user ? `${ticket.user.firstName} ${ticket.user.lastName}` : 'Unknown',
      assignedTo: ticket.assignedTo || 'Unassigned',
      priority: ticket.priority,
      status: ticket.status,
          }));
  }, [data]);

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: t("tickets.table.ticketId"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "lastUpdate",
        headerName: t("tickets.table.lastUpdate"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "subject",
        headerName: t("tickets.table.subject"),
        //flex: 1,
        width: 400,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "from",
        headerName: t("tickets.table.from"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "assignedTo",
        headerName: t("tickets.table.assignedTo"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "priority",
        headerName: t("tickets.table.priority"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const getPriorityStyles = (priority) => {
            switch (priority?.toLowerCase()) {
              case "high":
                return {
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                };
              case "medium":
                return {
                  backgroundColor: "#fff3e0",
                  color: "#e65100",
                };
              case "low":
                return {
                  backgroundColor: "#e3f2fd",
                  color: "#1565c0",
                };
              default:
                return {
                  backgroundColor: "#f5f5f5",
                  color: "#757575",
                };
            }
          };

          return (
            <Box
              sx={{
                ...getPriorityStyles(params.value),
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
                padding: "8px",
              }}
            >
              {params.value}
            </Box>
          );
        },
      },
      {
        field: "status",
        headerName: t("tickets.table.status"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      // {
      //   field: "actions",
      //   headerName: t("tickets.table.actions"),
      //   flex: 1,
      //   align: "center",
      //   headerAlign: "center",
      // },
    ],
    [t]
  );

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
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          onRowClick={(params) => {
            navigate(`/app/tickets/ticketTable/${params.row.id}`);
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{
            ...dataGridTable,
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
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
