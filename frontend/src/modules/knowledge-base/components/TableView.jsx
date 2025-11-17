import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import {
  useGetAllArticlesQuery,
  useLazyGetArticleByIdQuery,
} from "../../../store/api/articlesApi";
import { colors, typography, card } from "../../../common/styles/styles";
import { useNavigate } from "react-router-dom";

const createColumns = () => [
  {
    field: "article_name",
    headerName: "Article Name",
    width: 300,
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
  {
    field: "article_synopsis",
    headerName: "Article Synopsis",
    width: 400,
    flex: 2,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    width: 200,
    flex: 1,
    align: "center",
    headerAlign: "center",
    sortable: true,
  },
];

const dataStructure = (data) => {
  try {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      try {
        return {
          id: item?.article_id || "N/A",
          article_name: item?.article_name || "N/A",
          article_synopsis: item?.article_synopsis || "N/A",
          updated_at: item?.updated_at || "N/A",
        };
      } catch (itemError) {
        console.error(`Error processing article at index ${index}:`, itemError);
      }
    });
  } catch (error) {
    console.error("Error structuring article data:", error);
    return [];
  }
};

export const TableView = () => {
  const { data = [], isLoading, isError } = useGetAllArticlesQuery();

  const [getArticleById] = useLazyGetArticleByIdQuery();

  const navigate = useNavigate();
  const rows = useMemo(() => dataStructure(data), [data]);

  const columns = useMemo(() => createColumns(), []);
  const handleArticleClick = async (articleId) => {
    try {
      await getArticleById(articleId).unwrap();
      navigate(`/app/knowledge-base/editorView/${articleId}`);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        height: 700,
        width: { md: "95%", lg: "100%" },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50, 100]}
        onCellClick={(params, event) => {
          // Click en una celda - obtener artículo completo
          handleArticleClick(params.id);
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        sortingOrder={["asc", "desc"]}
        sx={{
          ...card,
          padding: "1rem 0 0 0",
          border: `1px solid ${colors.border}`,
          // Header styles
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
          // Sorting icons
          "& .MuiDataGrid-sortIcon": {
            color: colors.primary,
          },
          "& .MuiDataGrid-columnHeader--sorted": {
            backgroundColor: `${colors.primaryLight} !important`,
          },
          // Filler column
          "& .MuiDataGrid-filler": {
            backgroundColor: `${colors.background} !important`,
            width: "0 !important",
            minWidth: "0 !important",
            maxWidth: "0 !important",
          },
          // Scrollbar
          "& .MuiDataGrid-scrollbarFiller": {
            display: "none !important",
          },
          "& .MuiDataGrid-scrollbar--vertical": {
            position: "absolute",
            right: 0,
          },
          // Cell styles
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.border}`,
            fontSize: typography.fontSize.body,
            fontFamily: typography.fontFamily,
            color: colors.textPrimary,
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          // Row hover effect
          "& .MuiDataGrid-row:hover": {
            backgroundColor: colors.background,
          },
        }}
      />
    </Box>
  );
};

export default TableView;
