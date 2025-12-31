import React, { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import {
  primaryIconButton,
  colors,
  filterStyles,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { FilterButton } from "../FilterButton/FilterButton";
import {
  UniversalDataGrid,
  useDataGridColumns,
} from "../../../../common/components/ui/DataGrid/UniversalDataGrid";

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

  // DataGrid columns
  const columns = useDataGridColumns([
    {
      field: "name",
      headerNameKey: "users.table.name",
      flex: 1,
      align: "left",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" sx={{ margin: "1rem" }}>
          {params.value || t("common.na")}
        </Typography>
      ),
    },
    {
      field: "email",
      headerNameKey: "users.table.email",
      flex: 1,
      align: "left",
    },
    {
      field: "client_name",
      headerNameKey: "users.table.client",
      flex: 1,
      align: "left",
    },
    {
      field: "role_name",
      headerNameKey: "users.table.role",
      flex: 1,
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
      headerNameKey: "users.table.status",
      flex: 1,
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
      headerNameKey: "users.table.created",
      flex: 1,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: "actions",
      headerNameKey: "users.table.actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          <Tooltip title={t("users.actions.editUser")}>
            <IconButton
              size="small"
              onClick={() => openEditDialog(params.row.original)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
  ]);

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
      console.log(`ERROR rows: ${err}`);
      return [];
    }
  }, [users, t]);

  // Toolbar component with filters
  const UsersToolbar = useMemo(() => {
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
                label={t("users.searchLabel")}
                placeholder={t("users.searchPlaceholder")}
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

              {/* Only show client filter for BPO Admins */}
              {isBPOAdmin && (
                <FormControl sx={filterStyles?.formControlStyleCUR}>
                  <InputLabel
                    sx={filterStyles?.multiOptionFilter?.inputLabelSection}
                  >
                    {t("users.filterByClient")}
                  </InputLabel>
                  <Select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    label={t("users.filterByClient")}
                    sx={filterStyles?.multiOptionFilter?.selectSection}
                  >
                    <MenuItem value="">{t("users.allClients")}</MenuItem>
                    {clientOptions.map((client) => (
                      <MenuItem key={client.value} value={client.value}>
                        {client.title}
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
  }, [isOpen, isBPOAdmin, selectedClient, searchQuery, clientOptions, t]);

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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={primaryIconButton}
          >
            {t("users.addNewUser")}
          </Button>

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
        />
      </Box>
    </Box>
  );
};
