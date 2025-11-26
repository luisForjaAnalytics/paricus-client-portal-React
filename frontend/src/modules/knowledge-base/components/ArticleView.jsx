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
            maxWidth: "1200px",
            margin: "0 0 0 0",
            padding: "1rem",
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
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: "1.5rem",
              marginBottom: "1rem",
            },
            "& ul, & ol": {
              marginBottom: "1rem",
              paddingLeft: "2rem",
            },
            "& table": {
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              display: "block",
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

  // Si html no era un string
  //return <p>Contenido inválido.</p>;
};
