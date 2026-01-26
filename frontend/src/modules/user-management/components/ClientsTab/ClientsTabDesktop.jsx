import { useMemo, useState, useCallback } from "react";
import {
  Box,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { colors } from "../../../../common/styles/styles";
import PropTypes from "prop-types";
import { FilterButton } from "../FilterButton/FilterButton";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { EditButton } from "../../../../common/components/ui/EditButton/EditButton";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";

export const ClientsTabDesktop = ({
  clients,
  isLoading,
  handleEdit,
  handleDeactivate,
  formatDate,
  onAddClick,
}) => {
  const { t } = useTranslation();

  // State for filters
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  });

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      name: "",
      status: "",
    });
  };

  // Status options for select filter
  const statusOptions = [
    { name: t("common.active"), value: "active" },
    { name: t("common.inactive"), value: "inactive" },
    { name: t("clients.clientsOnly"), value: "client" },
    { name: t("clients.prospectsOnly"), value: "prospect" },
  ];

  // Filter clients based on status and search query
  const filteredClients = useMemo(() => {
    try {
      let filtered = clients;

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
    } catch (err) {
      console.error(`ERROR filteredClients: ${err}`);
      return clients;
    }
  }, [clients, filters]);
  // DataGrid columns with ColumnHeaderFilter
  const columns = useMemo(
    () => [
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
            {params.value}
          </Typography>
        ),
      },
      {
        field: "type",
        headerName: t("clients.table.type"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={
              params.row.isProspect
                ? t("clients.table.prospect")
                : t("clients.table.client")
            }
            color={params.row.isProspect ? "warning" : "primary"}
            size="small"
          />
        ),
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
        renderCell: (params) => (
          <Chip
            label={params.value ? t("common.active") : t("common.inactive")}
            color={params.value ? "success" : "error"}
            size="small"
          />
        ),
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
        valueFormatter: (value) => formatDate(value),
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
            <EditButton
              handleClick={handleEdit}
              item={params.row.original}
              title={t("clients.actions.edit")}
            />
            <Tooltip title={t("clients.actions.deactivate")}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleDeactivate(params.row.original)}
                  disabled={!params.row.isActive}
                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t, filters, handleFilterChange, isOpen, statusOptions, clearFilters, handleEdit, handleDeactivate, formatDate]
  );

  // Transform clients data for DataGrid
  const rows = useMemo(() => {
    try {
      return filteredClients.map((client) => ({
        id: client.id,
        name: client.name,
        isProspect: client.isProspect,
        isActive: client.isActive,
        userCount: client.userCount || client._count?.users || 0,
        roleCount: client.roleCount || client._count?.roles || 0,
        createdAt: client.createdAt,
        original: client, // Keep original object for actions
      }));
    } catch (err) {
      console.error(`ERROR rows: ${err}`);
      return [];
    }
  }, [filteredClients]);

  return (
    <Box sx={{ px: 3 }}>
      {/* Data Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
        }}
      >
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 1,
            marginRight: 2,
            gap: 1,
          }}
        >
          <ActionButton
            handleClick={onAddClick}
            icon={<AddIcon />}
            text={t("clients.addClient")}
          />
          {/* filter Button */}
          <FilterButton
            folderName={"clients.filters"}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          emptyMessage={t("clients.noClientsFound") || "No clients found"}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
        />
      </Box>
    </Box>
  );
};

ClientsTabDesktop.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      isProspect: PropTypes.bool.isRequired,
      createdAt: PropTypes.string,
      userCount: PropTypes.number,
      roleCount: PropTypes.number,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDeactivate: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};
