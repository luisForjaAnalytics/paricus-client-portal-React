import { useGetArticleByIdQuery } from "../../../store/api/articlesApi";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TiptapReadOnly } from "../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";
import { scrollableContainer } from "../../../common/styles/styles";

export const ArticleView = () => {
  const { articleId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();

  // Get kbPrefix from location state (passed from table) or from user's auth state
  const userKbPrefix = useSelector((state) => state.auth.user?.kbPrefix);
  const kbPrefix = location.state?.kbPrefix || userKbPrefix;

  const {
    data: articleData,
    isLoading,
    error,
  } = useGetArticleByIdQuery(
    { kbPrefix, articleId },
    { skip: !articleId || !kbPrefix }
  );

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Typography color="error">
          {t("knowledgeBase.errorLoadingArticle", "Error loading article")}
        </Typography>
      </Box>
    );
  }

  // No data state
  if (!articleData) {
    return null;
  }

  const html = articleData?.document || "";

  // Empty or invalid content
  if (!html || typeof html !== "string") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Typography color="text.secondary">
          {t("knowledgeBase.noContent", "No content available")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 0 0 0",
        padding: { xs: "0.75rem", sm: "1rem" },
        // Scroll vertical
        maxHeight: { xs: "calc(100vh - 120px)", md: "calc(100vh - 150px)" },
        ...scrollableContainer,
        // Word wrap para que el texto se acomode
        wordWrap: "break-word",
        overflowWrap: "break-word",
        // Estilos para imágenes dentro del HTML
        "& img": {
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "1rem auto",
          borderRadius: "8px",
          objectFit: "contain",
        },
        // Estilos adicionales para otros elementos HTML
        "& p": {
          marginBottom: "1rem",
          lineHeight: 1.6,
          wordWrap: "break-word",
          overflowWrap: "break-word",
        },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          marginTop: "1.5rem",
          marginBottom: "1rem",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        },
        "& ul, & ol": {
          marginBottom: "1rem",
          paddingLeft: { xs: "1.5rem", sm: "2rem" },
        },
        "& table": {
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          display: "block",
        },
        "& pre": {
          maxWidth: "100%",
          overflowX: "auto",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        },
        "& code": {
          wordWrap: "break-word",
          overflowWrap: "break-word",
        },
      }}
    >
      <TiptapReadOnly content={html} />
    </Box>
  );
};
