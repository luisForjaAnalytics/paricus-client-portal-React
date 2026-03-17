import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Article as ArticleIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { UniversalMobilDataTable } from "../../../common/components/ui/UniversalMobilDataTable";
import { EditButton } from "../../../common/components/ui/EditButton";
import { ViewButton } from "../../../common/components/ui/ViewButton";
import { colors } from "../../../common/styles/styles";
import { logger } from "../../../common/utils/logger";

export const TableViewMobil = ({
  articles = [],
  isLoading = false,
  handleEditClick,
  handleViewClick,
  headerActions,
  subHeader,
  topContent,
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
      logger.error(`ERROR rows: ${err}`);
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
      <EditButton
        handleClick={() => handleEditClick(row.id, row.kbPrefix)}
        title={t("knowledgeBase.edit")}
        size="small"
      />
      <ViewButton
        handleClick={() => handleViewClick(row.id, row.kbPrefix)}
        title={t("knowledgeBase.view")}
        size="small"
      />
    </>
  );

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, width: "100%", overflowX: "hidden" }}>
      {topContent && (
        <Box sx={{ display: "flex", justifyContent: "center", px: 6, mb: 1 }}>
          {topContent}
        </Box>
      )}
      <UniversalMobilDataTable
        rows={rows}
        columns={columns}
        primaryField="article_name"
        primaryIcon={<ArticleIcon fontSize="small" sx={{ color: colors.primary }} />}
        showTitle={true}
        titleField="article_name"
        headerTitle={t("knowledgeBase.articles")}
        headerActions={headerActions}
        subHeader={subHeader}
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
  headerActions: PropTypes.node,
  subHeader: PropTypes.node,
  topContent: PropTypes.node,
};

TableViewMobil.defaultProps = {
  articles: [],
  isLoading: false,
};
