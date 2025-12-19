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
import { DataGrid } from "@mui/x-data-grid";
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
  typography,
  card,
  filterStyles,
} from "../../../../common/styles/styles";
import { useTranslation } from "react-i18next";
import { FilterButton } from "../FilterButton/FilterButton";

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
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: t("users.table.name"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{ margin: "1rem" }}
          >
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
      },
      {
        field: "client_name",
        headerName: t("users.table.client"),
        flex: 1,
        align: "left",
        headerAlign: "center",
      },
      {
        field: "role_name",
        headerName: t("users.table.role"),
        flex: 1,
        align: "center",
        headerAlign: "center",
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
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "actions",
        headerName: t("users.table.actions"),
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
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
    ],
    [t]
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

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: UsersToolbar }}
          showToolbar
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
          sx={{
            ...card,
            padding: "0 0 0 0",
            border: `1px solid ${colors.border}`,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `${colors.background} !important`,
              borderBottom: `2px solid ${colors.border}`,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: `${colors.background} !important`,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: typography.fontWeight.bold,
              textTransform: "uppercase",
              fontSize: typography.fontSize.tableHeader,
              fontFamily: typography.fontFamily,
              color: colors.textMuted,
              letterSpacing: "0.05em",
            },
            "& .MuiDataGrid-sortIcon": {
              color: colors.primary,
            },
            "& .MuiDataGrid-columnHeader--sorted": {
              backgroundColor: `${colors.primaryLight} !important`,
            },
            "& .MuiDataGrid-filler": {
              backgroundColor: `${colors.background} !important`,
              width: "0 !important",
              minWidth: "0 !important",
              maxWidth: "0 !important",
            },
            "& .MuiDataGrid-scrollbarFiller": {
              display: "none !important",
            },
            "& .MuiDataGrid-scrollbar--vertical": {
              position: "absolute",
              right: 0,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.border}`,
              fontSize: typography.fontSize.body,
              fontFamily: typography.fontFamily,
              color: colors.textPrimary,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.background,
            },
          }}
        />
      </Box>
    </Box>
  );
};
