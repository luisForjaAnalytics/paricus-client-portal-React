# UniversalDataGrid Component

Componente reutilizable para tablas con MUI DataGrid. Reduce código repetitivo y estandariza el comportamiento de tablas en toda la aplicación.

## 📦 Archivos

- `UniversalDataGrid.jsx` - Componente principal
- `UniversalDataGrid.examples.jsx` - Ejemplos de uso
- `README.md` - Esta documentación

## 🚀 Inicio Rápido

### Ejemplo Básico

```jsx
import { UniversalDataGrid, useDataGridColumns } from "@/common/components/ui/UniversalDataGrid";

const MyTable = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();

  const columns = useDataGridColumns([
    { field: "id", headerNameKey: "users.table.id", width: 100 },
    { field: "name", headerNameKey: "users.table.name", flex: 1 },
    { field: "email", headerNameKey: "users.table.email", flex: 1.5 },
  ]);

  return (
    <UniversalDataGrid
      rows={users}
      columns={columns}
      loading={isLoading}
      emptyMessage="No users found"
    />
  );
};
```

## 📋 API Reference

### Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `rows` | `Array` | `[]` | ✅ **Requerido** - Array de datos para la tabla |
| `columns` | `Array` | `[]` | ✅ **Requerido** - Definición de columnas (formato MUI) |
| `loading` | `boolean` | `false` | Estado de carga (muestra spinner) |
| `error` | `string\|object` | `null` | Error a mostrar (Alert rojo) |
| `emptyMessage` | `string` | - | Mensaje cuando no hay datos |
| `onRowClick` | `function` | - | Callback al hacer click en fila: `(params, event) => {}` |
| `paginationModel` | `object` | - | Paginación controlada: `{ page, pageSize }` |
| `onPaginationModelChange` | `function` | - | Callback de cambio de paginación |
| `pageSizeOptions` | `Array` | `[10, 25, 50, 100]` | Opciones de tamaño de página |
| `checkboxSelection` | `boolean` | `false` | Habilitar selección con checkboxes |
| `onSelectionChange` | `function` | - | Callback de cambio de selección |
| `disableRowSelectionOnClick` | `boolean` | `true` | Deshabilitar selección al click |
| `autoHeight` | `boolean` | `false` | Altura automática basada en contenido |
| `height` | `number` | `600` | Altura fija en píxeles |
| `getRowId` | `function` | - | Función custom para obtener ID de fila |
| `sx` | `object` | `{}` | Estilos personalizados (MUI sx) |
| `...dataGridProps` | - | - | Props adicionales para DataGrid |

### Hooks Helpers

#### `useDataGridColumns(columnDefinitions)`

Crea columnas con estilos consistentes y traducciones automáticas.

```jsx
const columns = useDataGridColumns([
  {
    field: "name",
    headerNameKey: "users.table.name", // Se traduce automáticamente
    flex: 1,
    renderCell: (params) => <CustomCell value={params.value} />
  }
]);
```

#### `createActionColumn(options)`

Crea una columna de acciones con iconos comunes.

```jsx
const actionColumn = createActionColumn({
  onView: (row) => navigate(`/view/${row.id}`),
  onEdit: (row) => handleEdit(row),
  onDelete: (row) => handleDelete(row),
  customActions: [
    {
      icon: <ShareIcon />,
      tooltip: "Share",
      color: "info",
      onClick: (row) => handleShare(row)
    }
  ]
});
```

## 📚 Ejemplos de Uso

### 1. Tabla Simple

```jsx
const SimpleTable = () => {
  const { data = [], isLoading } = useGetDataQuery();

  const columns = useDataGridColumns([
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
  ]);

  return (
    <UniversalDataGrid rows={data} columns={columns} loading={isLoading} />
  );
};
```

### 2. Con Selección Múltiple

```jsx
const SelectableTable = () => {
  const [selected, setSelected] = useState([]);

  return (
    <UniversalDataGrid
      rows={data}
      columns={columns}
      checkboxSelection
      onSelectionChange={setSelected}
      disableRowSelectionOnClick={false}
    />
  );
};
```

### 3. Con Acciones Personalizadas

```jsx
const ActionsTable = () => {
  const columns = useDataGridColumns([
    { field: "name", headerName: "Name", flex: 1 },
    createActionColumn({
      onEdit: (row) => console.log("Edit", row),
      onDelete: (row) => console.log("Delete", row),
    }),
  ]);

  return <UniversalDataGrid rows={data} columns={columns} />;
};
```

### 4. Con Renderizado Custom

```jsx
const CustomRenderTable = () => {
  const columns = useDataGridColumns([
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "active" ? "success" : "default"}
        />
      ),
    },
  ]);

  return <UniversalDataGrid rows={data} columns={columns} />;
};
```

### 5. Con Click en Fila

```jsx
const ClickableTable = () => {
  const navigate = useNavigate();

  return (
    <UniversalDataGrid
      rows={data}
      columns={columns}
      onRowClick={(params) => navigate(`/details/${params.id}`)}
      sx={{
        cursor: "pointer",
        "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
      }}
    />
  );
};
```

## 🔄 Migración desde DataGrid Manual

### Antes (Manual)

```jsx
const OldTable = () => {
  const { data = [], isLoading } = useGetDataQuery();

  if (isLoading) return <CircularProgress />;
  if (data.length === 0) return <Typography>No data</Typography>;

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
```

### Después (UniversalDataGrid)

```jsx
const NewTable = () => {
  const { data = [], isLoading } = useGetDataQuery();

  return (
    <UniversalDataGrid
      rows={data}
      columns={columns}
      loading={isLoading}
      emptyMessage="No data found"
    />
  );
};
```

**Beneficios:**
- ✅ 60% menos código
- ✅ Estados manejados automáticamente
- ✅ Estilos consistentes
- ✅ Mejor UX (loading, error, empty states)

## 🎨 Personalización

### Estilos Globales

Los estilos por defecto vienen de `dataGridTable` en `styles.js`. Puedes sobrescribirlos:

```jsx
<UniversalDataGrid
  sx={{
    '& .MuiDataGrid-cell': {
      fontSize: '14px',
      padding: '8px',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#f5f5f5',
    },
  }}
/>
```

### Estilos por Columna

```jsx
const columns = useDataGridColumns([
  {
    field: "priority",
    headerName: "Priority",
    renderCell: (params) => {
      const colors = {
        high: { bg: "#ffebee", text: "#c62828" },
        medium: { bg: "#fff3e0", text: "#e65100" },
        low: { bg: "#e8f5e9", text: "#2e7d32" },
      };
      const style = colors[params.value.toLowerCase()];

      return (
        <Chip
          label={params.value}
          sx={{ backgroundColor: style.bg, color: style.text }}
        />
      );
    },
  },
]);
```

## ⚠️ Consideraciones de Rendimiento

### ✅ Hacer (Good Practices)

```jsx
// ✅ Memoizar transformación de datos
const rows = useMemo(() =>
  rawData.map(item => ({ ...item })),
  [rawData]
);

// ✅ Memoizar columnas
const columns = useDataGridColumns([...]);

// ✅ Usar paginación para grandes datasets
<UniversalDataGrid pageSizeOptions={[25, 50, 100]} />
```

### ❌ Evitar (Bad Practices)

```jsx
// ❌ No crear columnas inline (causa re-renders)
<UniversalDataGrid columns={[{ field: "id" }]} />

// ❌ No transformar datos inline
<UniversalDataGrid rows={data.map(x => ({ ...x }))} />

// ❌ No usar funciones inline en renderCell
renderCell: (params) => <Component onClick={() => handler(params)} />
```

## 🐛 Troubleshooting

### Problema: "Cannot read property 'id' of undefined"

**Solución:** Asegúrate de que cada fila tenga un campo `id` o usa `getRowId`:

```jsx
<UniversalDataGrid
  getRowId={(row) => row.customId}
/>
```

### Problema: Columnas no se traducen

**Solución:** Usa `headerNameKey` en lugar de `headerName`:

```jsx
// ❌ Mal
{ field: "name", headerName: "Name" }

// ✅ Bien
{ field: "name", headerNameKey: "users.table.name" }
```

### Problema: Tabla muy lenta con muchos datos

**Solución:** Implementa paginación del lado del servidor:

```jsx
const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

const { data } = useGetDataQuery({
  page: paginationModel.page,
  pageSize: paginationModel.pageSize,
});

<UniversalDataGrid
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
/>
```

## 📊 Casos de Uso Recomendados

| Escenario | ¿Usar UniversalDataGrid? | Alternativa |
|-----------|--------------------------|-------------|
| Tabla simple de lectura | ✅ Sí | - |
| Tabla con acciones CRUD | ✅ Sí | - |
| Tabla con selección múltiple | ✅ Sí | - |
| Tabla con 1000+ filas | ✅ Sí (con paginación server-side) | Virtual scrolling |
| Tabla con layout muy custom | ⚠️ Evaluar | Custom component |
| Tabla con drag & drop | ❌ No | react-beautiful-dnd |
| Lista simple sin columnas | ❌ No | MUI List |

## 🔮 Roadmap

- [ ] Soporte para filtros avanzados
- [ ] Export a CSV/Excel
- [ ] Agrupación de filas
- [ ] Columnas fijas (sticky)
- [ ] Modo responsive automático
- [ ] Temas predefinidos

## 🤝 Contribuir

Para agregar features o mejorar el componente:

1. Asegúrate de que el cambio beneficie a **múltiples** casos de uso
2. Mantén la API simple y consistente
3. Agrega ejemplos en `UniversalDataGrid.examples.jsx`
4. Actualiza esta documentación

---

**Mantenido por:** Equipo de Frontend
**Última actualización:** 2025-12-31
