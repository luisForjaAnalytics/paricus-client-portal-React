import {
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { LibraryBooks } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { dashboardStyles, colors } from "../../../../common/styles/styles";
import { AppText } from "../../../../common/components/ui/AppText/AppText";
import { useGetAllArticlesQuery } from "../../../../store/api/articlesApi";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { LoadingProgress } from "../../../../common/components/ui/LoadingProgress";

export const MasterRepository = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get kbPrefix from user's auth state (null for BPO Admin = access all)
  const kbPrefix = useSelector((state) => state.auth.user?.kbPrefix);

  const handleLink = () => {
    navigate("/app/knowledge-base/articles");
  };

  // Handle click on article - navigate to article view
  const handleArticleClick = (article) => {
    const prefix = article.kbPrefix || kbPrefix;
    navigate(`/app/knowledge-base/articleView/${article.article_id}`, {
      state: { kbPrefix: prefix },
    });
  };

  // Get all articles from external API (filtered by kbPrefix)
  const { data: allArticles = [], isLoading, error } = useGetAllArticlesQuery(kbPrefix);

  // Get last 3 articles
  const articles = allArticles.slice(0, 3);

  const locale = i18n.language === "es" ? es : enUS;

  const formatTimeLabel = (date) => {
    try {
      if (!date) return "N/A";
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "N/A";
      return formatDistanceToNow(parsedDate, { locale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <Card
      sx={{
        ...dashboardStyles.dashboardStatsCard,
        border: `2px solid ${colors.success}`,
        backgroundColor:
          colors.masterRepoBackgroundColor || "rgba(46, 125, 50, 0.08)",
      }}
    >
      <CardContent sx={{ padding: "1rem" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                ...dashboardStyles.dashboardIconContainer,
                backgroundColor: colors.success,
                color: "white",
              }}
            >
              <LibraryBooks sx={{ fontSize: "1.25rem" }} />
            </Box>
            <AppText
              variant="body"
              sx={{
                ...dashboardStyles.dashboardSectionTitle,
              }}
            >
              {t("dashboard.masterRepository.title")}
            </AppText>
          </Box>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <LoadingProgress size={40} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
            <Typography variant="body2">
              {t("common.error")}: {error?.message}
            </Typography>
          </Box>
        )}

        {/* Articles List */}
        {!isLoading && !error && (
          <Box>
            {articles.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  {t("dashboard.masterRepository.noArticles")}
                </Typography>
              </Box>
            ) : (
              articles.map((article, index) => (
                <Box
                  key={article.article_id || index}
                  onClick={() => handleArticleClick(article)}
                  sx={{
                    py: 1.5,
                    borderBottom:
                      index < articles.length - 1
                        ? `1px solid ${colors.border}`
                        : "none",
                    cursor: "pointer",
                    borderRadius: 1,
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.12)",
                    },
                  }}
                >
                  {/* Article Item */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: colors.success,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {article.article_name || "N/A"}
                      </Typography>
                    </Box>
                    {/* Metadata */}
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {article.updated_at
                          ? formatTimeLabel(article.updated_at)
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            )}

            {/* Action Buttons */}
            {articles.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="caption"
                  onClick={handleLink}
                  underline="none"
                  sx={{
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    "&:hover": {
                      color: colors.primary,
                    },
                  }}
                >
                  {t("dashboard.masterRepository.browseKnowledgeBase")}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
