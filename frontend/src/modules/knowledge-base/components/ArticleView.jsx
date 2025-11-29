import parse from "html-react-parser";
import { useGetArticleByIdQuery } from "../../../store/api/articlesApi";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

export const ArticleView = () => {
  const { articleId } = useParams();
  const {
    data: articleData,
    isLoading,
    error,
  } = useGetArticleByIdQuery(articleId, {
    skip: !articleId,
  });

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
          {parse(html)}
        </Box>
      );
    } catch (err) {
      console.warn(`Error :${err}`);
    }
  }
};
