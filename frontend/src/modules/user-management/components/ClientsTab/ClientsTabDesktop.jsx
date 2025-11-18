import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import {
  primaryIconButton,
  colors,
  typography,
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

  // DataGrid columns
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Client Name",
        flex: 1,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "type",
        headerName: "Type",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.row.isProspect ? "Prospect" : "Client"}
            color={params.row.isProspect ? "warning" : "primary"}
            size="small"
          />
        ),
      },
      {
        field: "isActive",
        headerName: "Status",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value ? "Active" : "Inactive"}
            color={params.value ? "success" : "error"}
            size="small"
          />
        ),
      },
      {
        field: "userCount",
        headerName: "Users",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "roleCount",
        headerName: "Roles",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "createdAt",
        headerName: "Created",
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="Edit client">
              <IconButton
                size="small"
                onClick={() => handleEdit(params.row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Deactivate client">
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
    []
  );

  // Transform clients data for DataGrid
  const rows = useMemo(
    () =>
      clients.map((client) => ({
        id: client.id,
        name: client.name,
        isProspect: client.isProspect,
        isActive: client.isActive,
        userCount: client.userCount || 0,
        roleCount: client.roleCount || 0,
        createdAt: client.createdAt,
        original: client, // Keep original object for actions
      })),
    [clients]
  );

  return (
    <Box>
      {/* Header - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          alignItems: "center",
          padding:'0 5rem 0 1.5rem',
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{ ...primaryIconButton, mt: 1 }}
        >
          Add New Client
        </Button>
      </Box>

      {/* Data Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
          padding:'0 1.5rem 0 1.5rem'
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnResize
          sx={{
            borderRadius: "0.7rem",
            padding: "1rem 0 0 0",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5 !important",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f5f5f5 !important",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-sortIcon": {
              color: colors.primary,
            },
            "& .MuiDataGrid-columnHeader--sorted": {
              backgroundColor: "#e8f5e9 !important",
            },
            "& .MuiDataGrid-filler": {
              display: "none",
            },
            "& .MuiDataGrid-scrollbarFiller": {
              display: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "action.hover",
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
