import { useMemo, useState } from "react";
import { DataGrid, Toolbar } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  useGetAllArticlesQuery,
  useLazyGetArticleByIdQuery,
} from "../../../store/api/articlesApi";
import { colors, typography, card } from "../../../common/styles/styles";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TableViewMobil } from "./TableViewMobil";
import AdvancedFilters from "./AdvancedFilters";

const createColumns = (handleEditClick, handleViewClick) => [
  {
    field: "article_name",
    headerName: "Article Name",
    width: 300,
    flex: 1,
    align: "left",
    headerAlign: "center",
    sortable: true,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight="medium" sx={{ margin: "1rem" }}>
        {params.value || "N/A"}
      </Typography>
    ),
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

  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <IconButton
          onClick={() => handleEditClick(params.id)}
          size="small"
          aria-label="edit"
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleViewClick(params.id)}
          size="small"
          aria-label="view"
          sx={{
            color: colors.primary,
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Box>
    ),
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
  const { t } = useTranslation();
  const { data = [], isLoading, isError, refetch } = useGetAllArticlesQuery();

  const [getArticleById] = useLazyGetArticleByIdQuery();
  const [filters, setFilters] = useState({
    articleName: "",
    synopsis: "",
    updatedAt: "",
  });

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      articleName: "",
      synopsis: "",
      updatedAt: "",
    });
  };

  // Filter articles by advanced filters
  const filteredArticles = useMemo(() => {
    if (!filters.articleName && !filters.synopsis && !filters.updatedAt) {
      return data;
    }

    return data.filter((article) => {
      const matchesName = filters.articleName
        ? article.article_name?.toLowerCase().includes(filters.articleName.toLowerCase())
        : true;

      const matchesSynopsis = filters.synopsis
        ? article.article_synopsis?.toLowerCase().includes(filters.synopsis.toLowerCase())
        : true;

      const matchesDate = filters.updatedAt
        ? article.updated_at?.startsWith(filters.updatedAt)
        : true;

      return matchesName && matchesSynopsis && matchesDate;
    });
  }, [data, filters]);

  const rows = useMemo(
    () => dataStructure(filteredArticles),
    [filteredArticles]
  );

  // Función para editar (navega a editorView)
  const handleEditClick = async (articleId) => {
    try {
      await getArticleById(articleId).unwrap();
      navigate(`/app/knowledge-base/editorView/${articleId}`);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  // Función para ver (navega a articleView)
  const handleViewClick = async (articleId) => {
    try {
      await getArticleById(articleId).unwrap();
      navigate(`/app/knowledge-base/articleView/${articleId}`);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  const columns = useMemo(
    () => createColumns(handleEditClick, handleViewClick),
    []
  );

  // Toolbar component for Knowledge Base with filter button
  const KnowledgeBaseToolbar = useMemo(() => {
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
            <AdvancedFilters
              filters={filters}
              setFilters={setFilters}
              refetch={refetch}
              isDebouncing={false}
              loading={isLoading}
              clearFilters={clearFilters}
            />
          </Box>
        )}
      </>
    );
  }, [isOpen, filters, isLoading]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Articles Table */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: { md: "95%", lg: "100%" },
        }}
      >
        {/* Filter Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 1,
            marginRight: 2,
          }}
        >
          <Tooltip title={t("knowledgeBase.filtersButton")}>
            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              size="medium"
              sx={{
                backgroundColor: colors?.backgroundOpenSubSection,
              }}
            >
              <FilterListIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          slots={{ toolbar: KnowledgeBaseToolbar }}
          showToolbar
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          sortingOrder={["asc", "desc"]}
          disableRowSelectionOnClick
          sx={{
            ...card,
            padding: "0 0 0 0",
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
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            // Row hover effect
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.background,
            },
          }}
        />
      </Box>

      {/* Mobile View */}
      <TableViewMobil
        articles={rows}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        handleViewClick={handleViewClick}
      />
    </Box>
  );
};

export default TableView;
