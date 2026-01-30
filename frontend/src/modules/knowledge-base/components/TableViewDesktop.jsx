import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  useGetAllArticlesQuery,
  useLazyGetArticleByIdQuery,
} from "../../../store/api/articlesApi";
import { useGetArticleSearchQuery } from "../../../store/api/articlesSearchApi";
import { colors } from "../../../common/styles/styles";
import { UniversalDataGrid } from "../../../common/components/ui/DataGrid/UniversalDataGrid";
import { ColumnHeaderFilter } from "../../../common/components/ui/ColumnHeaderFilter";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TableViewMobil } from "./TableViewMobil";
import { formatDateTime } from "../../../common/utils/formatDateTime";
import { ArticleSearch } from "./ArticleSearch";
import { SuccessErrorSnackbar } from "../../../common/components/ui/SuccessErrorSnackbar/SuccessErrorSnackbar";

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
          kbPrefix: item?.kbPrefix || null, // Include kbPrefix for article operations
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

  // Get kbPrefix from user's auth state (null for BPO Admin = access all)
  const kbPrefix = useSelector((state) => state.auth.user?.kbPrefix);

  const { data = [], isLoading, isError, refetch } = useGetAllArticlesQuery(kbPrefix);

  const [getArticleById] = useLazyGetArticleByIdQuery();
  const [filters, setFilters] = useState({
    articleName: "",
    synopsis: "",
    updatedAt: "",
  });

  // State for search term (debounced value from ArticleSearch)
  const [searchTerm, setSearchTerm] = useState("");

  // Search query - RTK Query handles loading, error, caching automatically
  const {
    data: searchResults,
    isLoading: isSearching,
    isError: isSearchError,
  } = useGetArticleSearchQuery(
    { kbPrefix, search: searchTerm },
    { skip: !searchTerm.trim() } // Skip if empty
  );

  // State for advanced filters visibility
  const [isOpen, setIsOpen] = useState(false);

  // Snackbar ref for error notifications
  const snackbarRef = useRef();

  // Show error snackbar when errors occur
  useEffect(() => {
    if (isError) {
      snackbarRef.current?.showError(t("common.errorLoadingData"));
    }
  }, [isError, t]);

  useEffect(() => {
    if (isSearchError) {
      snackbarRef.current?.showError(t("knowledgeBase.searchError"));
    }
  }, [isSearchError, t]);

  // Handler for debounced search value from ArticleSearch
  const handleSearchTermChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const navigate = useNavigate();

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      articleName: "",
      synopsis: "",
      updatedAt: "",
    });
  };

  // Handler para cambiar filtros desde el header
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: value,
      }));
    },
    [setFilters]
  );

  // Filter articles by advanced filters or search results
  const filteredArticles = useMemo(() => {
    // If searching and have results, use them; otherwise use all data
    const sourceData = searchTerm.trim() && searchResults ? searchResults : data;

    if (!filters.articleName && !filters.synopsis && !filters.updatedAt) {
      return sourceData;
    }

    return sourceData.filter((article) => {
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
  }, [data, filters, searchTerm, searchResults]);

  const rows = useMemo(
    () => dataStructure(filteredArticles),
    [filteredArticles]
  );

  // Función para editar (navega a editorView)
  const handleEditClick = async (articleId, articleKbPrefix) => {
    try {
      // Use article's kbPrefix or fall back to user's kbPrefix
      const prefix = articleKbPrefix || kbPrefix;
      await getArticleById({ kbPrefix: prefix, articleId }).unwrap();
      navigate(`/app/knowledge-base/editorView/${articleId}`, {
        state: { kbPrefix: prefix },
      });
    } catch (error) {
      console.error("Error fetching article:", error);
      snackbarRef.current?.showError(t("knowledgeBase.errorFetchingArticle"));
    }
  };

  // Función para ver (navega a articleView)
  const handleViewClick = async (articleId, articleKbPrefix) => {
    try {
      // Use article's kbPrefix or fall back to user's kbPrefix
      const prefix = articleKbPrefix || kbPrefix;
      await getArticleById({ kbPrefix: prefix, articleId }).unwrap();
      navigate(`/app/knowledge-base/articleView/${articleId}`, {
        state: { kbPrefix: prefix },
      });
    } catch (error) {
      console.error("Error fetching article:", error);
      snackbarRef.current?.showError(t("knowledgeBase.errorFetchingArticle"));
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "article_name",
        headerName: t("knowledgeBase.table.articleName"),
        width: 300,
        flex: 1,
        align: "left",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("knowledgeBase.table.articleName")}
            filterType="text"
            filterKey="articleName"
            filterValue={filters.articleName}
            onFilterChange={handleFilterChange}
            placeholder={t("knowledgeBase.filters.articleNamePlaceholder")}
            isOpen={isOpen}
          />
        ),
        renderCell: (params) => (
          <Typography variant="body2" fontWeight="medium" sx={{ margin: "1rem" }}>
            {params.value || "N/A"}
          </Typography>
        ),
      },
      {
        field: "article_synopsis",
        headerName: t("knowledgeBase.table.synopsis"),
        width: 400,
        flex: 2,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("knowledgeBase.table.synopsis")}
            filterType="text"
            filterKey="synopsis"
            filterValue={filters.synopsis}
            onFilterChange={handleFilterChange}
            placeholder={t("knowledgeBase.filters.synopsisPlaceholder")}
            isOpen={isOpen}
            centerTitle
          />
        ),
      },
      {
        field: "updated_at",
        headerName: t("knowledgeBase.table.updatedAt"),
        width: 200,
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("knowledgeBase.table.updatedAt")}
            filterType="date"
            filterKey="updatedAt"
            filterValue={filters.updatedAt}
            onFilterChange={handleFilterChange}
            isOpen={isOpen}
          />
        ),
      },
      {
        field: "actions",
        headerName: t("knowledgeBase.table.actions"),
        width: 150,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderHeader: () => (
          <ColumnHeaderFilter
            headerName={t("knowledgeBase.table.actions")}
            filterType="actions"
            isOpen={isOpen}
            onSearch={refetch}
            onClearFilters={clearFilters}
            loading={isLoading}
          />
        ),
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Tooltip title={t("knowledgeBase.actions.edit")}>
              <IconButton
                onClick={() => handleEditClick(params.id, params.row.kbPrefix)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("knowledgeBase.actions.view")}>
              <IconButton
                onClick={() => handleViewClick(params.id, params.row.kbPrefix)}
                size="small"
                sx={{ color: colors.primary }}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t, filters, handleFilterChange, isOpen, isLoading, refetch, clearFilters, kbPrefix]
  );

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
            //gap:3
          }}
        >
          <ArticleSearch
            onDebouncedValueChange={handleSearchTermChange}
            isLoading={isSearching}
          />
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
          pageSizeOptions={[10, 25, 50, 100]}
          height={'auto'}
          columnHeaderHeight={isOpen ? 90 : 56}
        />
      </Box>

      {/* Mobile View */}
      <TableViewMobil
        articles={rows}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        handleViewClick={handleViewClick}
      />

      {/* Error Snackbar */}
      <SuccessErrorSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default TableView;
