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
  Add as AddIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";
import { useTranslation } from "react-i18next";
import { PermissionsModal } from "./PermissionsModal";
import { FilterButton } from "../FilterButton/FilterButton";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { EditButton } from "../../../../common/components/ui/EditButton/EditButton";
import { DeleteButton } from "../../../../common/components/ui/DeleteButton/DeleteButton";

export const RolesTabDesktop = ({
  roles,
  isLoading,
  isBPOAdmin,
  selectedClient,
  setSelectedClient,
  searchQuery,
  setSearchQuery,
  isOpen,
  setIsOpen,
  clients,
  openAddDialog,
  openEditDialog,
  handleDeleteRole,
  openPermissionsDialog,
  formatDate,
  isProtectedRole,
  permissions,
  selectedPermissions,
  savePermissions,
  isUpdatingPermissions,
  handlePermissionToggle,
  permissionsDialog,
  closePermissionsDialog,
  selectedRole,
}) => {
  const { t } = useTranslation();

  // Handler para cambiar filtros desde el header
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      if (filterKey === "roleName") {
        setSearchQuery(value);
      } else if (filterKey === "client") {
        setSelectedClient(value);
      }
    },
    [setSearchQuery, setSelectedClient]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedClient("");
  }, [setSearchQuery, setSelectedClient]);

  // Client options for filter
  const clientOptions = useMemo(() => {
    return clients.map((client) => ({
      name: client.name,
      value: client.id,
    }));
  }, [clients]);

  // DataGrid columns with ColumnHeaderFilter
  const columns = useMemo(
    () => [
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
            {params.value}
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
        align: "left",
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
        renderCell: (params) => (
          <Chip
            label={params.value}
            color="primary"
            variant="outlined"
            size="small"
          />
        ),
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
        renderCell: (params) => (
          <Badge badgeContent={params.value || 0} color="info">
            <ShieldIcon color="action" />
          </Badge>
        ),
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
        valueFormatter: (value) => formatDate(value),
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
            <EditButton
              handleClick={openEditDialog}
              item={params.row.original}
              title={t("roles.actions.edit")}
            />
            <Tooltip title={t("roles.actions.configurePermissions")}>
              <IconButton
                size="small"
                color="success"
                onClick={() => openPermissionsDialog(params.row.original)}
              >
                <SecurityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <DeleteButton
              handleDelete={handleDeleteRole}
              item={params.row.original}
              itemName={params.row.role_name}
              itemType="role"
              disabled={isProtectedRole(params.row.role_name)}
            />
          </Box>
        ),
      },
    ],
    [t, searchQuery, selectedClient, handleFilterChange, isOpen, isBPOAdmin, clientOptions, clearFilters, openEditDialog, openPermissionsDialog, handleDeleteRole, isProtectedRole, formatDate]
  );

  // Transform roles data for DataGrid
  const rows = useMemo(() => {
    try {
      return roles.map((role) => ({
        id: role.id,
        role_name: role.roleName || role.role_name,
        description: role.description,
        client_name: role.clientName || role.client_name,
        permissions_count:
          role.permissions?.length ||
          role.permissions_count ||
          role.userCount ||
          0,
        created_at: role.createdAt || role.created_at,
        original: role, // Keep original object for actions
      }));
    } catch (err) {
      console.error(`ERROR rows: ${err}`);
      return [];
    }
  }, [roles]);

  return (
    <Box sx={{ px: 3 }}>
      {/* Roles Table - Desktop Only */}
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
            handleClick={openAddDialog}
            icon={<AddIcon />}
            text={t("roles.addRole")}
          />

          {/* filter Button */}
          <FilterButton
            folderName="roles.filters"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          emptyMessage={t("roles.noRolesFound") || "No roles found"}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
        />
      </Box>

      {/* Permissions Dialog */}
      <PermissionsModal
        permissionsDialog={permissionsDialog}
        closePermissionsDialog={closePermissionsDialog}
        selectedRole={selectedRole}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        savePermissions={savePermissions}
        isUpdatingPermissions={isUpdatingPermissions}
        onPermissionToggle={handlePermissionToggle}
      />
    </Box>
  );
};
