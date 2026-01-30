import { useMemo, useCallback, useState } from "react";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import {
  Business as BusinessIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { EditButton } from "../../../../common/components/ui/EditButton/EditButton";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";

/**
 * Shared hook for Clients table configuration
 * Provides columns, rows transformation, and actions for both Desktop (DataGrid) and Mobile (MobilDataTable)
 * Includes comprehensive error handling with try/catch blocks
 */
export const useClientsTableConfig = ({
  clients = [],
  formatDate,
  handleEdit,
  handleDeactivate,
  // Desktop-specific filter state (managed internally if not provided)
  externalFilters,
  setExternalFilters,
  isOpen: externalIsOpen,
  setIsOpen: setExternalIsOpen,
}) => {
  const { t } = useTranslation();

  // Internal filter state (used if external not provided)
  const [internalFilters, setInternalFilters] = useState({
    name: "",
    status: "",
  });
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external or internal filter state
  const filters = externalFilters || internalFilters;
  const setFilters = setExternalFilters || setInternalFilters;
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = setExternalIsOpen || setInternalIsOpen;

  // Handler for filter changes with error handling
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      try {
        setFilters((prev) => ({
          ...prev,
          [filterKey]: value,
        }));
      } catch (error) {
        console.error("useClientsTableConfig handleFilterChange error:", error);
      }
    },
    [setFilters]
  );

  // Clear all filters with error handling
  const clearFilters = useCallback(() => {
    try {
      setFilters({
        name: "",
        status: "",
      });
    } catch (error) {
      console.error("useClientsTableConfig clearFilters error:", error);
    }
  }, [setFilters]);

  // Status options for select filter
  const statusOptions = useMemo(() => {
    try {
      return [
        { name: t("common.active"), value: "active" },
        { name: t("common.inactive"), value: "inactive" },
        { name: t("clients.clientsOnly"), value: "client" },
        { name: t("clients.prospectsOnly"), value: "prospect" },
      ];
    } catch (error) {
      console.error("useClientsTableConfig statusOptions error:", error);
      return [];
    }
  }, [t]);

  // Filter clients with error handling
  const filteredClients = useMemo(() => {
    try {
      if (!Array.isArray(clients)) {
        console.error("useClientsTableConfig: clients is not an array");
        return [];
      }

      let filtered = [...clients];

      // Filter by status
      if (filters.status === "active") {
        filtered = filtered.filter((client) => client.isActive);
      } else if (filters.status === "inactive") {
        filtered = filtered.filter((client) => !client.isActive);
      } else if (filters.status === "prospect") {
        filtered = filtered.filter((client) => client.isProspect);
      } else if (filters.status === "client") {
        filtered = filtered.filter((client) => !client.isProspect);
      }

      // Filter by name
      if (filters.name) {
        const query = filters.name.toLowerCase();
        filtered = filtered.filter((client) =>
          client.name?.toLowerCase().includes(query)
        );
      }

      return filtered;
    } catch (error) {
      console.error("useClientsTableConfig filteredClients error:", error);
      return clients || [];
    }
  }, [clients, filters]);

  // Shared rows transformation with error handling
  const rows = useMemo(() => {
    try {
      return filteredClients.map((client) => ({
        id: client.id,
        name: client.name || t("common.na"),
        isProspect: client.isProspect ?? false,
        isActive: client.isActive ?? false,
        userCount: client.userCount || client._count?.users || 0,
        roleCount: client.roleCount || client._count?.roles || 0,
        createdAt: client.createdAt || client.created_at,
        original: client,
      }));
    } catch (error) {
      console.error("useClientsTableConfig rows transformation error:", error);
      return [];
    }
  }, [filteredClients, t]);

  // Shared render functions with error handling
  const renderStatusChip = useCallback(
    (isActive) => {
      try {
        return (
          <Chip
            label={isActive ? t("common.active") : t("common.inactive")}
            color={isActive ? "success" : "error"}
            size="small"
          />
        );
      } catch (error) {
        console.error("useClientsTableConfig renderStatusChip error:", error);
        return <span>{isActive ? "Active" : "Inactive"}</span>;
      }
    },
    [t]
  );

  const renderTypeChip = useCallback(
    (isProspect) => {
      try {
        return (
          <Chip
            label={
              isProspect ? t("clients.table.prospect") : t("clients.table.client")
            }
            color={isProspect ? "warning" : "primary"}
            size="small"
          />
        );
      } catch (error) {
        console.error("useClientsTableConfig renderTypeChip error:", error);
        return <span>{isProspect ? "Prospect" : "Client"}</span>;
      }
    },
    [t]
  );

  // Shared render actions with error handling
  const renderActions = useCallback(
    (row) => {
      try {
        return (
          <>
            <EditButton
              handleClick={handleEdit}
              item={row.original}
              title={t("clients.actions.edit")}
            />
            {row.isActive && (
              <Tooltip title={t("clients.actions.deactivate")}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeactivate(row.original)}
                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      } catch (error) {
        console.error("useClientsTableConfig renderActions error:", error);
        return null;
      }
    },
    [handleEdit, handleDeactivate, t]
  );

  // Desktop columns (DataGrid format) with error handling
  const desktopColumns = useMemo(() => {
    try {
      return [
        {
          field: "name",
          headerName: t("clients.table.clientName"),
          flex: 1,
          align: "left",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("clients.table.clientName")}
              filterType="text"
              filterKey="name"
              filterValue={filters.name}
              onFilterChange={handleFilterChange}
              placeholder={t("clients.searchPlaceholder")}
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => (
            <Typography variant="body2" fontWeight={500} sx={{ margin: "1rem" }}>
              {params.value || t("common.na")}
            </Typography>
          ),
        },
        {
          field: "type",
          headerName: t("clients.table.type"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => renderTypeChip(params.row.isProspect),
        },
        {
          field: "isActive",
          headerName: t("clients.table.status"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("clients.table.status")}
              filterType="select"
              filterKey="status"
              filterValue={filters.status}
              onFilterChange={handleFilterChange}
              options={statusOptions}
              labelKey="name"
              valueKey="value"
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => renderStatusChip(params.value),
        },
        {
          field: "userCount",
          headerName: t("clients.table.users"),
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "roleCount",
          headerName: t("clients.table.roles"),
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "createdAt",
          headerName: t("clients.table.created"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          valueFormatter: (value) => {
            try {
              return formatDate ? formatDate(value) : value;
            } catch {
              return value || t("common.na");
            }
          },
        },
        {
          field: "actions",
          headerName: t("clients.table.actions"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          sortable: false,
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("clients.table.actions")}
              filterType="actions"
              isOpen={isOpen}
              onClearFilters={clearFilters}
            />
          ),
          renderCell: (params) => (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
              {renderActions(params.row)}
            </Box>
          ),
        },
      ];
    } catch (error) {
      console.error("useClientsTableConfig desktopColumns error:", error);
      return [];
    }
  }, [
    t,
    filters,
    handleFilterChange,
    isOpen,
    statusOptions,
    clearFilters,
    formatDate,
    renderTypeChip,
    renderStatusChip,
    renderActions,
  ]);

  // Mobile columns (MobilDataTable format) with error handling
  const mobileColumns = useMemo(() => {
    try {
      return [
        {
          field: "isActive",
          headerName: t("clients.table.status"),
          labelWidth: 100,
          renderCell: ({ value }) => renderStatusChip(value),
        },
        {
          field: "isProspect",
          headerName: t("clients.table.type"),
          labelWidth: 100,
          renderCell: ({ value }) => renderTypeChip(value),
        },
        {
          field: "userCount",
          headerName: t("clients.table.users"),
          labelWidth: 100,
        },
        {
          field: "roleCount",
          headerName: t("clients.table.roles"),
          labelWidth: 100,
        },
        {
          field: "createdAt",
          headerName: t("clients.table.created"),
          labelWidth: 100,
          valueGetter: (row) => {
            try {
              return formatDate ? formatDate(row.createdAt) : row.createdAt;
            } catch {
              return row.createdAt || t("common.na");
            }
          },
        },
      ];
    } catch (error) {
      console.error("useClientsTableConfig mobileColumns error:", error);
      return [];
    }
  }, [t, formatDate, renderStatusChip, renderTypeChip]);

  // Mobile primary icon
  const renderPrimaryIcon = useCallback(
    () => <BusinessIcon fontSize="small" color="primary" />,
    []
  );

  return {
    rows,
    filteredClients,
    desktopColumns,
    mobileColumns,
    renderActions,
    renderPrimaryIcon,
    filters,
    setFilters,
    isOpen,
    setIsOpen,
    handleFilterChange,
    clearFilters,
    statusOptions,
    actionsLabel: t("clients.table.actions"),
    emptyMessage: t("clients.noClientsFound"),
    headerTitle: t("userManagement.clients.title"),
  };
};
