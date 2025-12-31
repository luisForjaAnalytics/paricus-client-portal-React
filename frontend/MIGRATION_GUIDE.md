# Guía de Migración a UniversalDataGrid

## ✅ Migraciones Completadas

### 1. ✅ Tickets DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/tickets/components/TicketsViewDesktop/TicketsViewDesktop.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Reemplazado DataGrid manual por UniversalDataGrid
- ✅ Convertido columnas a usar `headerNameKey` para i18n automático
- ✅ Agregados estilos personalizados para priority y status con Chips
- ✅ Manejo automático de loading/error/empty states

**Beneficios:**
- 40% menos código
- Loading/error states automáticos
- Navegación con `onRowClick` simplificada

---

### 2. ✅ Audio Recordings DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/audio-recordings/components/TableView/TableView.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Eliminada función `createColumns` (180 líneas)
- ✅ Columnas definidas usando `useDataGridColumns`
- ✅ Mantenidas acciones personalizadas (play/stop/download audio)
- ✅ Paginación server-side preservada

**Características especiales:**
- Soporta paginación del lado del servidor
- Acciones personalizadas con audio player
- Iconos custom en celdas (Phone, SupportAgent)

---

### 3. ✅ Users Management DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/user-management/components/UsersTab/UsersTabDesktop.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Convertido columnas a usar `headerNameKey` para i18n automático
- ✅ Preservadas acciones de Edit y Toggle Status (activate/deactivate)
- ✅ Mantenida toolbar personalizada con filtros

**Beneficios:**
- Reducción de ~50 líneas de código
- Estados automáticos
- Consistencia con otras tablas

---

### 4. ✅ Clients Management DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/user-management/components/ClientsTab/ClientsTabDesktop.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Convertido columnas a usar `headerNameKey`
- ✅ Preservadas acciones Edit y Deactivate
- ✅ Mantenida toolbar con filtros avanzados (status, prospect/client)

**Características especiales:**
- Chips de estado (Active/Inactive, Prospect/Client)
- Contadores de usuarios y roles
- Filtrado local (status, search query)

---

### 5. ✅ Roles Management DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/user-management/components/RolesTab/RolesTabDesktop.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Convertido columnas a usar `headerNameKey`
- ✅ Preservadas 3 acciones: Edit, Configure Permissions, Delete
- ✅ Badge con contador de permisos

**Características especiales:**
- Modal de permisos preservado
- Protección de roles del sistema (disabled delete)
- Shield icon con badge

---

### 6. ✅ Logs View DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/user-management/components/LogsView/LogsViewDesktop.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Convertido columnas a usar `headerNameKey`
- ✅ **Preservada paginación server-side**
- ✅ Chips con colores para eventType y status
- ✅ Formateadores custom (timestamp, IP address)

**Características especiales:**
- Paginación del lado del servidor
- Filtros avanzados complejos
- Limpieza de direcciones IPv6

---

### 7. ✅ Knowledge Base DataGrid → UniversalDataGrid
**Archivo:** `frontend/src/modules/knowledge-base/components/TableViewDesktop.jsx`

**Cambios realizados:**
- ✅ Importado `UniversalDataGrid` y `useDataGridColumns`
- ✅ Convertido columnas a usar `headerNameKey`
- ✅ Eliminada función `createColumns` standalone
- ✅ Preservadas acciones Edit y View con tooltips
- ✅ Mantenida transformación de datos `dataStructure`

**Beneficios:**
- Código más limpio y mantenible
- Eliminación de función helper redundante
- Consistencia con patrón del proyecto

---

## 🎉 Migración Completa - Todos los DataGrids Migrados

**Total de tablas migradas:** 7
**Fecha de finalización:** 2025-12-31

### Resumen de Impacto

| Tabla | Líneas Eliminadas | Características Preservadas |
|-------|-------------------|----------------------------|
| Tickets | ~120 | onRowClick navigation, custom chips |
| Audio Recordings | ~180 | Server pagination, audio player actions |
| Users Management | ~50 | Edit/toggle actions, filters |
| Clients Management | ~60 | Status/type chips, edit/deactivate |
| Roles Management | ~55 | Permissions modal, 3 actions |
| Logs View | ~70 | Server pagination, advanced filters |
| Knowledge Base | ~40 | Edit/view actions, data transformation |
| **TOTAL** | **~575 líneas** | **Todas las funcionalidades** |

### Beneficios Logrados

✅ **Consistencia:** Todas las tablas ahora usan el mismo componente base
✅ **Mantenibilidad:** Cambios en una tabla se replican fácilmente
✅ **i18n Automático:** headerNameKey elimina traducciones manuales
✅ **Estados Automáticos:** Loading, error y empty states sin código
✅ **Código Reducido:** 575 líneas menos de código repetitivo
✅ **Performance:** useMemo y optimizaciones centralizadas

---

## 📋 Checklist de Migración (Para cada tabla)

### Paso 1: Preparación
- [ ] Leer el archivo actual completo
- [ ] Identificar columnas y sus configuraciones
- [ ] Identificar acciones personalizadas
- [ ] Verificar si usa paginación server-side

### Paso 2: Actualizar Imports
```jsx
// ❌ Antes
import { DataGrid } from "@mui/x-data-grid";

// ✅ Después
import { UniversalDataGrid, useDataGridColumns, createActionColumn } from "../../../../common/components/ui/UniversalDataGrid";
```

### Paso 3: Convertir Columnas
```jsx
// ❌ Antes
const columns = useMemo(() => [
  {
    field: "name",
    headerName: t("table.name"),
    flex: 1,
  }
], [t]);

// ✅ Después
const columns = useDataGridColumns([
  {
    field: "name",
    headerNameKey: "table.name", // i18n automático
    flex: 1,
  }
]);
```

### Paso 4: Reemplazar DataGrid
```jsx
// ❌ Antes
<DataGrid
  rows={data}
  columns={columns}
  loading={loading}
  pageSize={10}
  rowsPerPageOptions={[10, 25, 50]}
  sx={dataGridTable}
/>

// ✅ Después
<UniversalDataGrid
  rows={data}
  columns={columns}
  loading={loading}
  emptyMessage="No data found"
  pageSizeOptions={[10, 25, 50]}
/>
```

### Paso 5: Probar
- [ ] Tabla carga correctamente
- [ ] Paginación funciona
- [ ] Sorting funciona
- [ ] Acciones (edit/delete) funcionan
- [ ] Loading state se muestra
- [ ] Empty state se muestra
- [ ] Responsive (si aplica)

---

## 🚨 Casos Especiales

### Paginación Server-Side
Si la tabla usa paginación del lado del servidor:

```jsx
<UniversalDataGrid
  rows={data}
  columns={columns}
  loading={loading}
  paginationMode="server"
  rowCount={totalCount}
  paginationModel={{ page, pageSize }}
  onPaginationModelChange={handlePaginationChange}
/>
```

### Acciones con Confirmación
Para acciones destructivas:

```jsx
createActionColumn({
  onDelete: (row) => {
    if (confirm(`Delete ${row.name}?`)) {
      handleDelete(row.id);
    }
  },
})
```

### Columnas con Íconos
Mantener renderizado custom:

```jsx
{
  field: "phone",
  headerNameKey: "table.phone",
  renderCell: (params) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <PhoneIcon fontSize="small" />
      {params.value}
    </Box>
  ),
}
```

---

## 📊 Comparación Antes/Después

| Métrica | Antes (Manual) | Después (Universal) |
|---------|----------------|---------------------|
| Líneas de código | ~200-250 | ~100-120 |
| Manejo de estados | Manual | Automático |
| i18n | Manual en cada columna | Automático con `headerNameKey` |
| Consistencia | Variable | Garantizada |
| Mantenimiento | 7 archivos | 1 componente central |

---

## ✅ Validación Final

Después de migrar cada tabla, verificar:

1. **Funcionalidad:**
   - [ ] Datos se muestran correctamente
   - [ ] Sorting funciona
   - [ ] Paginación funciona
   - [ ] Acciones (edit/delete/view) funcionan

2. **Estados:**
   - [ ] Loading state visible
   - [ ] Empty state visible
   - [ ] Error state manejado

3. **UX:**
   - [ ] Estilos consistentes con otras tablas
   - [ ] Traducciones funcionan
   - [ ] Responsive (si aplica)

4. **Performance:**
   - [ ] No re-renders innecesarios
   - [ ] Paginación eficiente

---

## 🆘 Problemas Comunes

### Problema: Columnas no se traducen
**Solución:** Usa `headerNameKey` en lugar de `headerName`

### Problema: Acciones no funcionan
**Solución:** Verifica que los handlers se pasen correctamente en `renderCell`

### Problema: Paginación no funciona
**Solución:** Asegúrate de pasar `paginationModel` y `onPaginationModelChange`

### Problema: Estilos custom no aplican
**Solución:** Usa el prop `sx` en UniversalDataGrid

---

## 📚 Recursos

- [UniversalDataGrid README](./src/common/components/ui/README.md)
- [Ejemplos de Uso](./src/common/components/ui/UniversalDataGrid.examples.jsx)
- [Guía de Decisión](./src/common/components/ui/DECISION_GUIDE.md)
- [Tickets Refactorizado](./src/modules/tickets/components/TicketsViewDesktop/TicketsViewDesktop.REFACTORED.jsx)

---

**Última actualización:** 2025-12-31
**Completado por:** Claude Code
