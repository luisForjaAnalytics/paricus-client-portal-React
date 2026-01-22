import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Tooltip,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { colors, filterStyles } from "../../../../common/styles/styles";
import {
  UniversalDataGrid,
  useDataGridColumns,
} from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
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
  confirmDelete,
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

  // DataGrid columns
  const columns = useDataGridColumns([
    {
      field: "role_name",
      headerNameKey: "roles.table.roleName",
      flex: 1,
      align: "left",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500} sx={{ margin: "1rem" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "description",
      headerNameKey: "roles.table.description",
      flex: 1,
      align: "left",
    },
    {
      field: "client_name",
      headerNameKey: "roles.table.client",
      flex: 1,
      align: "left",
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
      headerNameKey: "roles.table.permissions",
      flex: 1,
      renderCell: (params) => (
        <Badge badgeContent={params.value || 0} color="info">
          <ShieldIcon color="action" />
        </Badge>
      ),
    },
    {
      field: "created_at",
      headerNameKey: "roles.table.created",
      flex: 1,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      headerNameKey: "roles.table.actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", mt:'0.5rem' }}>
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
            handleDelete={confirmDelete}
            item={params.row.original}
            itemName={params.row.role_name}
            itemType="role"
            disabled={isProtectedRole(params.row.role_name)}
          />
        </Box>
      ),
    },
  ]);

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

  // Toolbar component with filters
  const RolesToolbar = useMemo(() => {
    return () => (
      <>
        {isOpen && (
          <Box
            sx={{
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.subSectionBackground,
              borderBottom: `1px solid ${colors.subSectionBorder}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <TextField
                sx={filterStyles?.inputFilter}
                label={t("roles.searchLabel")}
                placeholder={t("roles.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {isBPOAdmin && (
                <FormControl sx={filterStyles?.formControlStyleCUR}>
                  <InputLabel
                    sx={filterStyles?.multiOptionFilter?.inputLabelSection}
                  >
                    {t("roles.filterByClient")}
                  </InputLabel>
                  <Select
                    value={selectedClient}
                    label={t("roles.filterByClient")}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    sx={filterStyles?.multiOptionFilter?.selectSection}
                  >
                    <MenuItem value="">{t("roles.allClients")}</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        )}
      </>
    );
  }, [isOpen, isBPOAdmin, selectedClient, searchQuery, clients, t]);

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
          slots={{ toolbar: RolesToolbar }}
          pageSizeOptions={[10, 25, 50, 100]}
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
