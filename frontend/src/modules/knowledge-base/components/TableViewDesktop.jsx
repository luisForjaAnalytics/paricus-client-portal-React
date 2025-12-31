import { useMemo, useState } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  useGetAllArticlesQuery,
  useLazyGetArticleByIdQuery,
} from "../../../store/api/articlesApi";
import { colors } from "../../../common/styles/styles";
import { UniversalDataGrid, useDataGridColumns } from "../../../common/components/ui/DataGrid/UniversalDataGrid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TableViewMobil } from "./TableViewMobil";
import AdvancedFilters from "./AdvancedFilters";
import { formatDateTime } from "../../../common/utils/formatDateTime";

const dataStructure = (data) => {
  try {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      try {
        return {
          id: item?.article_id || "N/A",
          article_name: item?.article_name || "N/A",
          article_synopsis: item?.article_synopsis || "N/A",
          updated_at: formatDateTime(item?.updated_at) || "N/A",
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
        ? article.article_name
            ?.toLowerCase()
            .includes(filters.articleName.toLowerCase())
        : true;

      const matchesSynopsis = filters.synopsis
        ? article.article_synopsis
            ?.toLowerCase()
            .includes(filters.synopsis.toLowerCase())
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

  const columns = useDataGridColumns([
    {
      field: "article_name",
      headerNameKey: "knowledgeBase.table.articleName",
      width: 300,
      flex: 1,
      align: "left",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" sx={{ margin: "1rem" }}>
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "article_synopsis",
      headerNameKey: "knowledgeBase.table.synopsis",
      width: 400,
      flex: 2,
    },
    {
      field: "updated_at",
      headerNameKey: "knowledgeBase.table.updatedAt",
      width: 200,
      flex: 1,
    },
    {
      field: "actions",
      headerNameKey: "knowledgeBase.table.actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Tooltip title={t("knowledgeBase.actions.edit")}>
            <IconButton
              onClick={() => handleEditClick(params.id)}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("knowledgeBase.actions.view")}>
            <IconButton
              onClick={() => handleViewClick(params.id)}
              size="small"
              sx={{ color: colors.primary }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]);

  // Toolbar component for Knowledge Base with filter button
  const KnowledgeBaseToolbar = useMemo(() => {
    return () => (
      <>
        {isOpen && (
          <Box
            sx={{
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "left",
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

        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          emptyMessage={t("knowledgeBase.noArticlesFound") || "No articles found"}
          slots={{ toolbar: KnowledgeBaseToolbar }}
          pageSizeOptions={[10, 25, 50, 100]}
          height={'auto'}
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
