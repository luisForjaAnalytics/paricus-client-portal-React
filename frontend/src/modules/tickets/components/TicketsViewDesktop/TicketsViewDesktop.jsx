import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import { colors, dataGridTable, typography }  from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AdvancedFilters } from "../AdvancedFilters";
import { CreateTickeButton } from "../CreateTicketButton";

export const TicketsViewDesktop = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

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
                padding: "8px"
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
      {
        field: "actions",
        headerName: t("tickets.table.actions"),
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
    ],
    [t]
  );

  const rows = [{
    id: 4831,
    lastUpdate: "2025-10-12",
    subject: "Unable to access corporate email",
    from: "user1",
    assignedTo: "IT mobile admin",
    priority: "High",
    status: "Open",
  },
  {
    id: 7294,
    lastUpdate: "2025-11-03",
    subject: "VPN connection issues",
    from: "user2",
    assignedTo: "Flex admin",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 1058,
    lastUpdate: "2025-10-28",
    subject: "Laptop running extremely slow",
    from: "user3",
    assignedTo: "Admin",
    priority: "Low",
    status: "Pending",
  },
  {
    id: 6642,
    lastUpdate: "2025-11-15",
    subject: "Software installation request",
    from: "user4",
    assignedTo: "Paricus",
    priority: "Medium",
    status: "Completed",
  },
  {
    id: 3920,
    lastUpdate: "2025-10-05",
    subject: "Password reset request",
    from: "user5",
    assignedTo: "IT mobile admin",
    priority: "High",
    status: "Completed",
  },
  {
    id: 8713,
    lastUpdate: "2025-11-22",
    subject: "Printer not responding",
    from: "user6",
    assignedTo: "Admin",
    priority: "Low",
    status: "Open",
  },
  {
    id: 5409,
    lastUpdate: "2025-10-18",
    subject: "Access denied to shared folder",
    from: "user7",
    assignedTo: "Flex admin",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2167,
    lastUpdate: "2025-11-08",
    subject: "Mobile device enrollment issue",
    from: "user8",
    assignedTo: "IT mobile admin",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: 9984,
    lastUpdate: "2025-10-30",
    subject: "System update causing errors",
    from: "user9",
    assignedTo: "Paricus",
    priority: "High",
    status: "Open",
  },];

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
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2, mt: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          {t("tickets.sectionTitle")}
        </Typography>
      </Box>

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
          //loading={isLoading}
          //slots={{ toolbar: LogsToolbar }}
          showToolbar
          //rowCount={totalRows}
          // paginationMode="server"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          // onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          sx={dataGridTable}
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
    </Box>
  );
};
