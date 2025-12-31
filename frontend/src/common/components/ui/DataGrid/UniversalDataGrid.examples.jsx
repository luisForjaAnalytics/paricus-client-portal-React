/**
 * EJEMPLOS DE USO - UniversalDataGrid
 *
 * Este archivo contiene ejemplos de cómo usar el componente UniversalDataGrid
 * en diferentes escenarios comunes.
 */

import { UniversalDataGrid, useDataGridColumns, createActionColumn } from "./UniversalDataGrid";
import { Chip, Typography } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

// ============================================
// EJEMPLO 1: Tabla simple de usuarios
// ============================================
export const UsersTableExample = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();

  // Definir columnas usando el hook helper
  const columns = useDataGridColumns([
    {
      field: "name",
      headerNameKey: "users.table.name",
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "email",
      headerNameKey: "users.table.email",
      flex: 2,
    },
    {
      field: "role",
      headerNameKey: "users.table.role",
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },
    {
      field: "isActive",
      headerNameKey: "users.table.status",
      flex: 0.8,
      renderCell: (params) => (
        params.value ? (
          <CheckCircle color="success" />
        ) : (
          <Cancel color="error" />
        )
      ),
    },
    // Columna de acciones usando helper
    createActionColumn({
      onView: (row) => console.log("View user:", row),
      onEdit: (row) => console.log("Edit user:", row),
      onDelete: (row) => console.log("Delete user:", row),
    }),
  ]);

  return (
    <UniversalDataGrid
      rows={users}
      columns={columns}
      loading={isLoading}
      emptyMessage="No users found"
      onRowClick={(params) => console.log("Row clicked:", params.row)}
      pageSizeOptions={[10, 25, 50]}
    />
  );
};

// ============================================
// EJEMPLO 2: Tabla con selección múltiple
// ============================================
export const TicketsTableWithSelectionExample = () => {
  const { data: tickets = [], isLoading } = useGetTicketsQuery();
  const [selectedTickets, setSelectedTickets] = useState([]);

  const columns = useDataGridColumns([
    { field: "id", headerNameKey: "tickets.table.id", width: 100 },
    { field: "subject", headerNameKey: "tickets.table.subject", flex: 2 },
    { field: "priority", headerNameKey: "tickets.table.priority", flex: 1 },
    {
      field: "status",
      headerNameKey: "tickets.table.status",
      flex: 1,
      renderCell: (params) => {
        const statusColors = {
          Open: "info",
          "In Progress": "warning",
          Resolved: "success",
          Closed: "default",
        };
        return (
          <Chip
            label={params.value}
            color={statusColors[params.value] || "default"}
            size="small"
          />
        );
      },
    },
  ]);

  return (
    <UniversalDataGrid
      rows={tickets}
      columns={columns}
      loading={isLoading}
      checkboxSelection
      onSelectionChange={(selection) => {
        console.log("Selected IDs:", selection);
        setSelectedTickets(selection);
      }}
      disableRowSelectionOnClick={false}
    />
  );
};

// ============================================
// EJEMPLO 3: Tabla con paginación controlada
// ============================================
export const ControlledPaginationExample = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data: logs = [], isLoading } = useGetLogsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  const columns = useDataGridColumns([
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
    { field: "event", headerName: "Event", flex: 1.5 },
    { field: "user", headerName: "User", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "SUCCESS" ? "success" : "error"}
          size="small"
        />
      ),
    },
  ]);

  return (
    <UniversalDataGrid
      rows={logs}
      columns={columns}
      loading={isLoading}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 25, 50, 100]}
      height={500}
    />
  );
};

// ============================================
// EJEMPLO 4: Tabla con acciones personalizadas
// ============================================
export const CustomActionsExample = () => {
  const { data: articles = [], isLoading } = useGetArticlesQuery();
  const navigate = useNavigate();

  const columns = useDataGridColumns([
    { field: "title", headerNameKey: "articles.table.title", flex: 2 },
    { field: "category", headerNameKey: "articles.table.category", flex: 1 },
    { field: "updatedAt", headerNameKey: "articles.table.updated", flex: 1 },
    createActionColumn({
      onEdit: (row) => navigate(`/articles/edit/${row.id}`),
      onView: (row) => navigate(`/articles/${row.id}`),
      customActions: [
        {
          icon: <ShareIcon />,
          tooltip: "Share Article",
          color: "info",
          onClick: (row) => console.log("Share:", row),
        },
        {
          icon: <DownloadIcon />,
          tooltip: "Download PDF",
          color: "success",
          onClick: (row) => console.log("Download:", row),
        },
      ],
    }),
  ]);

  return (
    <UniversalDataGrid
      rows={articles}
      columns={columns}
      loading={isLoading}
      autoHeight
    />
  );
};

// ============================================
// EJEMPLO 5: Migración de tabla existente
// ============================================

/**
 * ANTES (Código repetitivo):
 */
const OldTicketsTable = () => {
  const { data = [], isLoading } = useGetTicketsQuery();

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 2 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  if (isLoading) return <CircularProgress />;
  if (data.length === 0) return <Typography>No tickets found</Typography>;

  return (
    <Box sx={{ height: 600 }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        sx={dataGridTable}
      />
    </Box>
  );
};

/**
 * DESPUÉS (Usando UniversalDataGrid):
 */
const NewTicketsTable = () => {
  const { data = [], isLoading } = useGetTicketsQuery();

  const columns = useDataGridColumns([
    { field: "id", headerNameKey: "tickets.table.id", flex: 1 },
    { field: "subject", headerNameKey: "tickets.table.subject", flex: 2 },
    { field: "status", headerNameKey: "tickets.table.status", flex: 1 },
  ]);

  return (
    <UniversalDataGrid
      rows={data}
      columns={columns}
      loading={isLoading}
      emptyMessage="No tickets found"
    />
  );
};

// ============================================
// TIPS & BEST PRACTICES
// ============================================

/**
 * 1. USAR useDataGridColumns para i18n automático:
 *
 *    const columns = useDataGridColumns([
 *      { field: "name", headerNameKey: "users.table.name" } // ✅ Se traduce automáticamente
 *    ]);
 *
 * 2. MEMOIZAR transformaciones de datos:
 *
 *    const rows = useMemo(() =>
 *      rawData.map(item => ({ id: item.id, name: item.fullName })),
 *      [rawData]
 *    );
 *
 * 3. USAR createActionColumn para acciones comunes:
 *
 *    createActionColumn({
 *      onEdit: handleEdit,
 *      onDelete: handleDelete,
 *      customActions: [{ icon: <Icon />, onClick: handler }]
 *    })
 *
 * 4. EVITAR re-renders innecesarios:
 *
 *    // ❌ Mal - crea nuevo array en cada render
 *    <UniversalDataGrid columns={[{ field: "id" }]} />
 *
 *    // ✅ Bien - memoiza las columnas
 *    const columns = useDataGridColumns([{ field: "id" }]);
 *    <UniversalDataGrid columns={columns} />
 *
 * 5. PERSONALIZAR estilos cuando sea necesario:
 *
 *    <UniversalDataGrid
 *      sx={{
 *        '& .MuiDataGrid-cell': { fontSize: '14px' }
 *      }}
 *    />
 */
