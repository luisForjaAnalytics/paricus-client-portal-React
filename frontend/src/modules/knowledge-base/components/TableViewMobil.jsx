import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Article as ArticleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UniversalMobilDataTable } from "../../../common/components/ui/UniversalMobilDataTable";

export const TableViewMobil = ({
  articles = [],
  isLoading = false,
  handleEditClick,
  handleViewClick,
}) => {
  const { t } = useTranslation();

  // Transform articles data for accordion table
  const rows = useMemo(() => {
    try {
      return articles.map((article) => ({
        id: article.id || article.article_id,
        article_name: article.article_name,
        article_synopsis: article.article_synopsis,
        updated_at: article.updated_at,
        kbPrefix: article.kbPrefix,
      }));
    } catch (err) {
      console.error(`ERROR rows: ${err}`);
      return [];
    }
  }, [articles]);

  // Column definitions for expanded content
  const columns = useMemo(
    () => [
      {
        field: "article_synopsis",
        headerName: t("knowledgeBase.synopsis"),
        labelWidth: 100,
      },
      {
        field: "updated_at",
        headerName: t("knowledgeBase.updatedAt"),
        labelWidth: 100,
      },
    ],
    [t]
  );

  // Render actions for each row
  const renderActions = (row) => (
    <>
      <Tooltip title={t("knowledgeBase.edit")}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleEditClick(row.id, row.kbPrefix)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("knowledgeBase.view")}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleViewClick(row.id, row.kbPrefix)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, width: "100%", px: 2 }}>
      <UniversalMobilDataTable
        rows={rows}
        columns={columns}
        primaryField="article_name"
        primaryIcon={<ArticleIcon fontSize="small" color="primary" />}
        showTitle={true}
        titleField="article_name"
        headerTitle={t("knowledgeBase.articles")}
        loading={isLoading}
        emptyMessage={t("knowledgeBase.noArticlesFound")}
        renderActions={renderActions}
        actionsLabel={t("knowledgeBase.actions")}
        labelWidth={100}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

TableViewMobil.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      article_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      article_name: PropTypes.string.isRequired,
      article_synopsis: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
      kbPrefix: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  handleEditClick: PropTypes.func.isRequired,
  handleViewClick: PropTypes.func.isRequired,
};

TableViewMobil.defaultProps = {
  articles: [],
  isLoading: false,
};
