import { useGetArticleByIdQuery } from "../../../store/api/articlesApi";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { TiptapReadOnly } from "../../../common/components/ui/TiptapReadOnly/TiptapReadOnly";

export const ArticleView = () => {
  const { articleId } = useParams();
  const location = useLocation();

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

  //   if (isLoading) return <p>Cargando artículo...</p>;
  //   if (error) return <p>Error cargando artículo.</p>;

  //if (!articleData) return null;

  const html = articleData?.document || " ";

  if (typeof html === "string") {
    try {
      return (
        <Box
          sx={{
            width: "100%",
            margin: "0 0 0 0",
            padding: { xs: "0.75rem", sm: "1rem" },
            // Scroll vertical
            maxHeight: { xs: "calc(100vh - 120px)", md: "calc(100vh - 150px)" },
            overflowY: "auto",
            overflowX: "hidden",
            // Scroll personalizado
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#555",
              },
            },
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
          <TiptapReadOnly content={html} />{" "}
        </Box>
      );
    } catch (err) {
      console.error(`ArticleView renderBlock: ${err}`);
    }
  }
};
