import { useMemo, useCallback } from "react";
import {
  Box,
  Chip,
  Badge,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useTranslation } from "react-i18next";
import { colors } from "../../../common/styles/styles";
import { EditButton } from "../../../common/components/ui/EditButton";
import { DeleteButton } from "../../../common/components/ui/DeleteButton";
import { ColumnHeaderFilter } from "../../../common/components/ui/ColumnHeaderFilter";

/**
 * Shared hook for Roles table configuration
 * Provides columns, rows transformation, and actions for both Desktop (DataGrid) and Mobile (MobilDataTable)
 */
export const useRolesTableConfig = ({
  roles = [],
  clients = [],
  formatDate,
  openEditDialog,
  handleDeleteRole,
  openPermissionsDialog,
  onViewPermissions,
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

  // Get client name from ID
  const getClientName = useCallback(
    (clientId) => {
      if (!clientId) return t("roles.unknownClient");
      const client = clients.find((c) => c.id === clientId);
      return client?.name || t("roles.unknownClient");
    },
    [clients, t],
  );

  // Handler for filter changes (Desktop)
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      if (filterKey === "roleName" && setSearchQuery) {
        setSearchQuery(value);
      } else if (filterKey === "client" && setSelectedClient) {
        setSelectedClient(value);
      }
    },
    [setSearchQuery, setSelectedClient],
  );

  // Client options for filter
  const clientOptions = useMemo(() => {
    return clients.map((client) => ({
      name: client.name || t("common.na"),
      value: client.id,
    }));
  }, [clients, t]);

  // Shared rows transformation
  const rows = useMemo(() => {
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
  }, [roles, getClientName, t]);

  // Shared render functions
  const renderPermissionsBadge = useCallback(
    (count, row) => {
      return (
        <Tooltip title={t("roles.actions.viewPermissions")}>
          <IconButton
            size="small"
            onClick={() =>
              onViewPermissions && onViewPermissions(row?.original)
            }
          >
            <Badge
              badgeContent={count || 0}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: colors.permissionCirculeButton,
                  color: colors.textWhite,
                },
              }}
            >
              <LockOpenIcon
                sx={{ color: colors.permissionButton, fontSize: "1.6rem" }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      );
    },
    [onViewPermissions, t],
  );

  const renderClientChip = useCallback(
    (clientName) => {
      return (
        <Chip
          label={clientName || t("common.na")}
          color="primary"
          variant="outlined"
          size="small"
        />
      );
    },
    [t],
  );

  // Shared render actions
  const renderActions = useCallback(
    (row) => {
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
              onClick={() => openPermissionsDialog(row.original)}
              sx={{
                color: colors.permissionButton,
              }}
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
    },
    [
      openEditDialog,
      openPermissionsDialog,
      handleDeleteRole,
      isProtectedRole,
      t,
    ],
  );

  // Desktop columns (DataGrid format)
  const desktopColumns = useMemo(() => {
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
        renderCell: (params) =>
          renderPermissionsBadge(params.value, params.row),
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
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
              mt: "0.5rem",
            }}
          >
            {renderActions(params.row)}
          </Box>
        ),
      },
    ];
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

  // Mobile columns (MobilDataTable format)
  const mobileColumns = useMemo(() => {
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
        renderCell: ({ value, row }) => renderPermissionsBadge(value, row),
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
  }, [t, formatDate, renderClientChip, renderPermissionsBadge]);

  // Mobile primary icon
  const renderPrimaryIcon = useCallback(
    () => <ShieldIcon fontSize="small" sx={{ color: colors.primary }} />,
    [],
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
