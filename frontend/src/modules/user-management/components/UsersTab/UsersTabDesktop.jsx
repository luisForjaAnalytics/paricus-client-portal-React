import React, { useMemo, useCallback } from "react";
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
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FilterButton } from "../FilterButton/FilterButton";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { EditButton } from "../../../../common/components/ui/EditButton/EditButton";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { ColumnHeaderFilter } from "../../../../common/components/ui/ColumnHeaderFilter";

export const UsersTabDesktop = ({
  users,
  loading,
  isBPOAdmin,
  selectedClient,
  setSelectedClient,
  searchQuery,
  setSearchQuery,
  isOpen,
  setIsOpen,
  clientOptions,
  openAddDialog,
  openEditDialog,
  toggleUserStatus,
  formatDate,
}) => {
  const { t } = useTranslation();

  // Handler para cambiar filtros desde el header
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      if (filterKey === "name") {
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

  // DataGrid columns with ColumnHeaderFilter
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: t("users.table.name"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("users.table.name")}
            filterType="text"
            filterKey="name"
            filterValue={searchQuery}
            onFilterChange={handleFilterChange}
            placeholder={t("users.searchPlaceholder")}
            isOpen={isOpen}
          />
        ),
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="medium" sx={{ margin: "1rem" }}>
            {params.value || t("common.na")}
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: t("users.table.email"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("users.table.email")}
            filterType="none"
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "client_name",
        headerName: t("users.table.client"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderHeader: () =>
          isBPOAdmin ? (
            <ColumnHeaderFilter
              headerName={t("users.table.client")}
              filterType="select"
              filterKey="client"
              filterValue={selectedClient}
              onFilterChange={handleFilterChange}
              options={clientOptions.map((c) => ({ name: c.title, value: c.value }))}
              labelKey="name"
              valueKey="value"
              isOpen={isOpen}
            />
          ) : (
            <ColumnHeaderFilter
              headerName={t("users.table.client")}
              filterType="none"
              isOpen={isOpen}
            />
          ),
      },
      {
        field: "role_name",
        headerName: t("users.table.role"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("users.table.role")}
            filterType="none"
            isOpen={isOpen}
          />
        ),
        renderCell: (params) =>
          params.value ? (
            <Chip label={params.value} color="primary" size="small" />
          ) : (
            <Chip
              label={t("users.table.noRoleAssigned")}
              color="default"
              size="small"
              variant="outlined"
            />
          ),
      },
      {
        field: "is_active",
        headerName: t("users.table.status"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("users.table.status")}
            filterType="none"
            isOpen={isOpen}
          />
        ),
        renderCell: (params) => (
          <Chip
            label={
              params.value ? t("users.table.active") : t("users.table.inactive")
            }
            color={params.value ? "success" : "error"}
            size="small"
          />
        ),
      },
      {
        field: "created_at",
        headerName: t("users.table.created"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("users.table.created")}
            filterType="none"
            isOpen={isOpen}
          />
        ),
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "actions",
        headerName: t("users.table.actions"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("users.table.actions")}
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
            <EditButton
              handleClick={openEditDialog}
              item={params.row.original}
              title={t("users.actions.editUser")}
            />
            <Tooltip
              title={
                params.row.is_active
                  ? t("users.actions.deactivateUser")
                  : t("users.actions.activateUser")
              }
            >
              <IconButton
                size="small"
                onClick={() => toggleUserStatus(params.row.original)}
              >
                {params.row.is_active ? (
                  <BlockIcon fontSize="small" />
                ) : (
                  <CheckCircleIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t, searchQuery, selectedClient, handleFilterChange, isOpen, isBPOAdmin, clientOptions, clearFilters, openEditDialog, toggleUserStatus, formatDate]
  );

  // Transform users data for DataGrid
  const rows = useMemo(() => {
    try {
      return users.map((user) => ({
        id: user.id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          t("common.na"),
        email: user.email,
        client_name: user.client?.name || t("common.na"),
        role_name: user.role?.roleName,
        is_active: user.isActive,
        created_at: user.createdAt,
        original: user, // Keep original object for actions
      }));
    } catch (err) {
      console.error(`ERROR rows: ${err}`);
      return [];
    }
  }, [users, t]);

  return (
    <Box sx={{ px: 3 }}>
      {/* Users Data Table - Desktop Only */}
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
            text={t("users.addNewUser")}
          />

          {/* filter Button */}
          <FilterButton
            folderName="users.filters"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          emptyMessage={t("users.noUsersFound") || "No users found"}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
        />
      </Box>
    </Box>
  );
};

UsersTabDesktop.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      createdAt: PropTypes.string,
      client: PropTypes.shape({
        name: PropTypes.string,
      }),
      role: PropTypes.shape({
        roleName: PropTypes.string,
      }),
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  isBPOAdmin: PropTypes.bool.isRequired,
  selectedClient: PropTypes.string.isRequired,
  setSelectedClient: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  clientOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  openAddDialog: PropTypes.func.isRequired,
  openEditDialog: PropTypes.func.isRequired,
  toggleUserStatus: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};
