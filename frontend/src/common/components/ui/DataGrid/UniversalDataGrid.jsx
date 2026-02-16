import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography} from "@mui/material";
import { AlertInline } from "../AlertInline";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { dataGridTable } from "../../../styles/styles";
import { LoadingProgress } from "../LoadingProgress";

/**
 * UniversalDataGrid - Componente reutilizable para tablas con DataGrid de MUI
 *
 * @param {Array} rows - Array de datos para la tabla
 * @param {Array} columns - Definición de columnas (formato MUI DataGrid)
 * @param {boolean} loading - Estado de carga
 * @param {boolean} error - Estado de error
 * @param {string} emptyMessage - Mensaje cuando no hay datos
 * @param {Function} onRowClick - Callback cuando se hace click en una fila
 * @param {Object} sx - Estilos personalizados para el DataGrid
 * @param {Object} paginationModel - Modelo de paginación { page, pageSize }
 * @param {Function} onPaginationModelChange - Callback para cambios de paginación
 * @param {Array} pageSizeOptions - Opciones de tamaño de página [5, 10, 25, 50]
 * @param {boolean} checkboxSelection - Habilitar selección con checkboxes
 * @param {Function} onSelectionChange - Callback para cambios de selección
 * @param {boolean} disableRowSelectionOnClick - Deshabilitar selección al hacer click
 * @param {boolean} autoHeight - Auto altura basada en contenido
 * @param {number} height - Altura fija del grid (px)
 * @param {string} getRowId - Función para obtener el ID de cada fila
 * @param {Object} dataGridProps - Props adicionales para DataGrid
 */
export const UniversalDataGrid = ({
  // Required props
  rows = [],
  columns = [],

  // Loading & Error states
  loading = false,
  error = null,
  emptyMessage,

  // Events
  onRowClick,
  onSelectionChange,

  // Pagination
  paginationModel: externalPaginationModel,
  onPaginationModelChange,
  pageSizeOptions = [10, 25, 50, 100],

  // Selection
  checkboxSelection = false,
  disableRowSelectionOnClick = true,

  // Sizing
  autoHeight = false,
  height = 'auto',

  // Row ID
  getRowId,

  // Styling
  sx = {},

  // Slots (for custom components like toolbar)
  slots,
  slotProps,

  // Additional DataGrid props
  ...dataGridProps
}) => {
  const { t } = useTranslation();

  // Internal pagination state (if not controlled externally)
  const [internalPaginationModel, setInternalPaginationModel] = useState({
    page: 0,
    pageSize: pageSizeOptions[0],
  });

  // Use external or internal pagination model
  const paginationModel = externalPaginationModel || internalPaginationModel;
  const handlePaginationChange = onPaginationModelChange || setInternalPaginationModel;

  // Default empty message
  const defaultEmptyMessage = t?.("common.noDataAvailable") || "No data available";

  // Memoize processed rows to prevent unnecessary re-renders
  const processedRows = useMemo(() => {
    if (!Array.isArray(rows)) {
      console.warn("UniversalDataGrid: rows prop must be an array");
      return [];
    }
    return rows;
  }, [rows]);

  // Memoize columns to prevent re-creation
  const processedColumns = useMemo(() => {
    if (!Array.isArray(columns)) {
      console.warn("UniversalDataGrid: columns prop must be an array");
      return [];
    }
    return columns;
  }, [columns]);

  // Handle row click
  const handleRowClick = (params, event) => {
    if (onRowClick) {
      onRowClick(params, event);
    }
  };

  // Handle selection change
  const handleSelectionModelChange = (selectionModel) => {
    if (onSelectionChange) {
      onSelectionChange(selectionModel);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: autoHeight ? 200 : height,
          ...sx,
        }}
      >
        <LoadingProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <AlertInline
        message={typeof error === "string" ? error : error?.message || "Error loading data"}
        severity="error"
        sx={{ mb: 2 }}
      />
    );
  }

  // Empty state
  if (!loading && processedRows.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: autoHeight ? 200 : height,
          border: `1px solid #e0e0e0`,
          borderRadius: 1,
          backgroundColor: "#fafafa",
          ...sx,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {emptyMessage || defaultEmptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: autoHeight ? "auto" : height, width: "100%", ...sx }}>
      <DataGrid
        rows={processedRows}
        columns={processedColumns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        onRowClick={handleRowClick}
        onRowSelectionModelChange={handleSelectionModelChange}
        getRowId={getRowId}
        autoHeight={autoHeight}
        sx={{
          ...dataGridTable,
          ...sx,
        }}
        {...dataGridProps}
        slots={slots}
        slotProps={slotProps}
      />
    </Box>
  );
};

UniversalDataGrid.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  paginationModel: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }),
  onPaginationModelChange: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  checkboxSelection: PropTypes.bool,
  disableRowSelectionOnClick: PropTypes.bool,
  autoHeight: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getRowId: PropTypes.func,
  sx: PropTypes.object,
  slots: PropTypes.object,
  slotProps: PropTypes.object,
};

/**
 * Hook helper para crear columnas con estilos consistentes
 */
export const useDataGridColumns = (columnDefinitions) => {
  const { t } = useTranslation();

  return useMemo(() => {
    return columnDefinitions.map((col) => ({
      // Defaults
      align: "center",
      headerAlign: "center",
      flex: 1,
      sortable: true,

      // Override with column-specific config
      ...col,

      // Translate header if i18n key provided
      headerName: col.headerNameKey ? t(col.headerNameKey) : col.headerName,
    }));
  }, [columnDefinitions, t]);
};

/**
 * Helper para crear columnas de acciones comunes
 */
export const createActionColumn = ({ onEdit, onDelete, onView, customActions = [] }) => {
  return {
    field: "actions",
    headerName: "Actions",
    headerNameKey: "common.actions",
    width: 120,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (params) => {
      const { Box, IconButton, Tooltip } = require("@mui/material");
      const {
        Edit: EditIcon,
        Delete: DeleteIcon,
        Visibility: VisibilityIcon,
      } = require("@mui/icons-material");

      return (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          {onView && (
            <Tooltip title="View">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onView(params.row);
                }}
                size="small"
                color="info"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(params.row);
                }}
                size="small"
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(params.row);
                }}
                size="small"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {customActions.map((action, index) => (
            <Tooltip key={index} title={action.tooltip}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(params.row);
                }}
                size="small"
                color={action.color || "default"}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      );
    },
  };
};
