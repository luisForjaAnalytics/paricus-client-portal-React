import { useMemo, useCallback } from "react";
import { Box, Chip, Badge, Tooltip, Typography, IconButton } from "@mui/material";
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { EditButton } from "../../../../common/components/ui/EditButton";
import { DeleteButton } from "../../../../common/components/ui/DeleteButton";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";

/**
 * Shared hook for Roles table configuration
 * Provides columns, rows transformation, and actions for both Desktop (DataGrid) and Mobile (MobilDataTable)
 * Includes comprehensive error handling with try/catch blocks
 */
export const useRolesTableConfig = ({
  roles = [],
  clients = [],
  formatDate,
  openEditDialog,
  handleDeleteRole,
  openPermissionsDialog,
  isProtectedRole,
  // Desktop-specific props (optional)
  isBPOAdmin = false,
  selectedClient = "",
  setSelectedClient,
  searchQuery = "",
  setSearchQuery,
  isOpen = false,
  clearFilters,
}) => {
  const { t } = useTranslation();

  // Get client name from ID with error handling
  const getClientName = useCallback(
    (clientId) => {
      try {
        if (!clientId) return t("roles.unknownClient");
        const client = clients.find((c) => c.id === clientId);
        return client?.name || t("roles.unknownClient");
      } catch (error) {
        console.error("useRolesTableConfig getClientName error:", error);
        return t("roles.unknownClient");
      }
    },
    [clients, t]
  );

  // Handler for filter changes (Desktop)
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      try {
        if (filterKey === "roleName" && setSearchQuery) {
          setSearchQuery(value);
        } else if (filterKey === "client" && setSelectedClient) {
          setSelectedClient(value);
        }
      } catch (error) {
        console.error("useRolesTableConfig handleFilterChange error:", error);
      }
    },
    [setSearchQuery, setSelectedClient]
  );

  // Client options for filter with error handling
  const clientOptions = useMemo(() => {
    try {
      return clients.map((client) => ({
        name: client.name || t("common.na"),
        value: client.id,
      }));
    } catch (error) {
      console.error("useRolesTableConfig clientOptions error:", error);
      return [];
    }
  }, [clients, t]);

  // Shared rows transformation with error handling
  const rows = useMemo(() => {
    try {
      if (!Array.isArray(roles)) {
        console.error("useRolesTableConfig: roles is not an array");
        return [];
      }
      return roles.map((role) => ({
        id: role.id,
        role_name: role.roleName || role.role_name || t("common.na"),
        description: role.description || "",
        client_id: role.clientId || role.client_id,
        client_name:
          role.clientName ||
          role.client_name ||
          getClientName(role.clientId || role.client_id),
        permissions_count:
          role.permissions?.length ||
          role.permissions_count ||
          role.userCount ||
          0,
        created_at: role.createdAt || role.created_at,
        original: role,
      }));
    } catch (error) {
      console.error("useRolesTableConfig rows transformation error:", error);
      return [];
    }
  }, [roles, getClientName, t]);

  // Shared render functions with error handling
  const renderPermissionsBadge = useCallback((count) => {
    try {
      return (
        <Badge badgeContent={count || 0} color="info">
          <ShieldIcon color="action" fontSize="small" />
        </Badge>
      );
    } catch (error) {
      console.error("useRolesTableConfig renderPermissionsBadge error:", error);
      return <ShieldIcon color="action" fontSize="small" />;
    }
  }, []);

  const renderClientChip = useCallback((clientName) => {
    try {
      return (
        <Chip
          label={clientName || t("common.na")}
          color="primary"
          variant="outlined"
          size="small"
        />
      );
    } catch (error) {
      console.error("useRolesTableConfig renderClientChip error:", error);
      return <span>{clientName}</span>;
    }
  }, [t]);

  // Shared render actions with error handling
  const renderActions = useCallback(
    (row) => {
      try {
        return (
          <>
            <EditButton
              handleClick={openEditDialog}
              item={row.original}
              title={t("roles.actions.edit")}
            />
            <Tooltip title={t("roles.actions.configurePermissions")}>
              <IconButton
                size="small"
                color="success"
                onClick={() => openPermissionsDialog(row.original)}
              >
                <SecurityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <DeleteButton
              handleDelete={handleDeleteRole}
              item={row.original}
              itemName={row.role_name}
              itemType="role"
              disabled={isProtectedRole ? isProtectedRole(row.role_name) : false}
            />
          </>
        );
      } catch (error) {
        console.error("useRolesTableConfig renderActions error:", error);
        return null;
      }
    },
    [openEditDialog, openPermissionsDialog, handleDeleteRole, isProtectedRole, t]
  );

  // Desktop columns (DataGrid format) with error handling
  const desktopColumns = useMemo(() => {
    try {
      return [
        {
          field: "role_name",
          headerName: t("roles.table.roleName"),
          flex: 1,
          align: "left",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("roles.table.roleName")}
              filterType="text"
              filterKey="roleName"
              filterValue={searchQuery}
              onFilterChange={handleFilterChange}
              placeholder={t("roles.searchPlaceholder")}
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
          field: "description",
          headerName: t("roles.table.description"),
          flex: 1,
          align: "left",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("roles.table.description")}
              filterType="none"
              isOpen={isOpen}
            />
          ),
        },
        {
          field: "client_name",
          headerName: t("roles.table.client"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () =>
            isBPOAdmin ? (
              <ColumnHeaderFilter
                headerName={t("roles.table.client")}
                filterType="select"
                filterKey="client"
                filterValue={selectedClient}
                onFilterChange={handleFilterChange}
                options={clientOptions}
                labelKey="name"
                valueKey="value"
                isOpen={isOpen}
              />
            ) : (
              <ColumnHeaderFilter
                headerName={t("roles.table.client")}
                filterType="none"
                isOpen={isOpen}
              />
            ),
          renderCell: (params) => renderClientChip(params.value),
        },
        {
          field: "permissions_count",
          headerName: t("roles.table.permissions"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("roles.table.permissions")}
              filterType="none"
              isOpen={isOpen}
            />
          ),
          renderCell: (params) => renderPermissionsBadge(params.value),
        },
        {
          field: "created_at",
          headerName: t("roles.table.created"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("roles.table.created")}
              filterType="none"
              isOpen={isOpen}
            />
          ),
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
          headerName: t("roles.table.actions"),
          flex: 1,
          align: "center",
          headerAlign: "center",
          sortable: false,
          renderHeader: () => (
            <ColumnHeaderFilter
              headerName={t("roles.table.actions")}
              filterType="actions"
              isOpen={isOpen}
              onClearFilters={clearFilters}
            />
          ),
          renderCell: (params) => (
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", mt: "0.5rem" }}>
              {renderActions(params.row)}
            </Box>
          ),
        },
      ];
    } catch (error) {
      console.error("useRolesTableConfig desktopColumns error:", error);
      return [];
    }
  }, [
    t,
    searchQuery,
    selectedClient,
    handleFilterChange,
    isOpen,
    isBPOAdmin,
    clientOptions,
    clearFilters,
    formatDate,
    renderClientChip,
    renderPermissionsBadge,
    renderActions,
  ]);

  // Mobile columns (MobilDataTable format) with error handling
  const mobileColumns = useMemo(() => {
    try {
      return [
        {
          field: "client_name",
          headerName: t("roles.table.client"),
          labelWidth: 110,
          renderCell: ({ value }) => renderClientChip(value),
        },
        {
          field: "description",
          headerName: t("roles.table.description"),
          labelWidth: 110,
          hide: (row) => !row.description,
        },
        {
          field: "permissions_count",
          headerName: t("roles.table.permissions"),
          labelWidth: 110,
          renderCell: ({ value }) => renderPermissionsBadge(value),
        },
        {
          field: "created_at",
          headerName: t("roles.table.created"),
          labelWidth: 110,
          valueGetter: (row) => {
            try {
              return formatDate ? formatDate(row.created_at) : row.created_at;
            } catch {
              return row.created_at || t("common.na");
            }
          },
        },
      ];
    } catch (error) {
      console.error("useRolesTableConfig mobileColumns error:", error);
      return [];
    }
  }, [t, formatDate, renderClientChip, renderPermissionsBadge]);

  // Mobile primary icon
  const renderPrimaryIcon = useCallback(
    () => <ShieldIcon fontSize="small" color="primary" />,
    []
  );

  return {
    rows,
    desktopColumns,
    mobileColumns,
    renderActions,
    renderPrimaryIcon,
    clientOptions,
    actionsLabel: t("roles.table.actions"),
    emptyMessage: t("roles.noRolesFound"),
    headerTitle: t("userManagement.rolesPermissions.title"),
  };
};
