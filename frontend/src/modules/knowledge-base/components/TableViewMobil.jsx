import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Article as ArticleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { titlesTypography } from "../../../common/styles/styles";

function Row({ article, handleEditClick, handleViewClick }) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ArticleIcon fontSize="small" color="primary" />
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {article.article_name}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                fontWeight="bold"
              >
                {article.article_name}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Article Synopsis */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("knowledgeBase.synopsis")}:
                  </Typography>
                  <Typography variant="body2">
                    {article.article_synopsis}
                  </Typography>
                </Box>

                {/* Updated At */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {t("knowledgeBase.updatedAt")}:
                  </Typography>
                  <Typography variant="body2">{article.updated_at}</Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                    sx={{ minWidth: 60 }}
                  >
                    {t("knowledgeBase.actions")}:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title={t("knowledgeBase.edit")}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(article.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("knowledgeBase.view")}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewClick(article.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    article_name: PropTypes.string.isRequired,
    article_synopsis: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  }).isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleViewClick: PropTypes.func.isRequired,
};

export const TableViewMobil = ({
  articles = [],
  isLoading = false,
  handleEditClick,
  handleViewClick,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
      <TableContainer
        component={Paper}
        sx={{
          mt: 1,
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c5c5c5",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#9e9e9e",
          },
        }}
      >
        <Table aria-label="articles table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#f5f5f5" }} />
              <TableCell sx={{ backgroundColor: "#f5f5f5" }}>
                <Typography sx={titlesTypography.sectionTitle}>
                  {t("knowledgeBase.articles")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && articles.map((article, index) => (
              <Row
                key={`article-${article.id}-${index}`}
                article={article}
                handleEditClick={handleEditClick}
                handleViewClick={handleViewClick}
              />
            ))}
            {!isLoading && articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <ArticleIcon
                      sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t("knowledgeBase.noArticlesFound")}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={2}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t("knowledgeBase.loadingArticles")}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

TableViewMobil.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      article_name: PropTypes.string.isRequired,
      article_synopsis: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
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
