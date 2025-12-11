import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  primaryIconButton,
  colors,
  typography,
  card,
} from "../../../../common/styles/styles";
import PropTypes from "prop-types";

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
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clients based on status and search query
  const filteredClients = useMemo(() => {
    try {
      let filtered = clients;

      // Filter by status
      if (selectedStatus === "active") {
        filtered = filtered.filter((client) => client.isActive);
      } else if (selectedStatus === "inactive") {
        filtered = filtered.filter((client) => !client.isActive);
      } else if (selectedStatus === "prospect") {
        filtered = filtered.filter((client) => client.isProspect);
      } else if (selectedStatus === "client") {
        filtered = filtered.filter((client) => !client.isProspect);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((client) =>
          client.name?.toLowerCase().includes(query)
        );
      }

      return filtered;
    } catch (err) {
      console.log(`ERROR filteredClients: ${err}`);
      return clients;
    }
  }, [clients, selectedStatus, searchQuery]);
  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: t("clients.table.clientName"),
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500} sx={{ margin: '1rem' }}>
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
            label={params.row.isProspect ? t("clients.table.prospect") : t("clients.table.client")}
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
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title={t("clients.actions.edit")}>
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
    [t, handleEdit, handleDeactivate, formatDate]
  );

  // Transform clients data for DataGrid
  const rows = useMemo(
    () => {
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
        console.log(`ERROR rows: ${err}`);
        return [];
      }
    },
    [filteredClients]
  );

  return (
    <Box sx={{ px: 3 }}>
      {/* Filter Section - Desktop Only */}
      <Card
        sx={{
          display: { xs: "none", md: "block" },
          mb: 3,
          padding: "0 2rem 0 2rem",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>{t("clients.filterByStatus")}</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label={t("clients.filterByStatus")}
                >
                  <MenuItem value="">{t("clients.allClients")}</MenuItem>
                  <MenuItem value="active">{t("common.active")}</MenuItem>
                  <MenuItem value="inactive">{t("common.inactive")}</MenuItem>
                  <MenuItem value="client">{t("clients.clientsOnly")}</MenuItem>
                  <MenuItem value="prospect">{t("clients.prospectsOnly")}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ minWidth: 300 }}
                label={t("clients.searchClients")}
                placeholder={t("clients.searchPlaceholder")}
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
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddClick}
              sx={primaryIconButton}
            >
              {t("clients.addClient")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Data Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
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
