import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { useGetArticleByIdQuery } from '../../../store/api/articlesApi';

/**
 * Componente de ejemplo para mostrar cómo usar la API de artículos
 *
 * Uso:
 * <ArticleExample articleId="PA_US_1" />
 */
export function ArticleExample({ articleId = "PA_US_1" }) {
  const { data: article, isLoading, error } = useGetArticleByIdQuery(articleId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar el artículo: {error.status} - {error.data?.message || 'Error desconocido'}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {article?.title || 'Sin título'}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          ID: {articleId}
        </Typography>

        <Typography variant="body1">
          {article?.content || 'Sin contenido'}
        </Typography>

        {/* Muestra todos los datos del artículo en formato JSON para depuración */}
        <Box mt={3}>
          <Typography variant="caption" component="pre" sx={{
            background: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto'
          }}>
            {JSON.stringify(article, null, 2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Ejemplo con lazy query (para cargar bajo demanda)
 */
export function ArticleLazyExample() {
  const [trigger, { data, isLoading, error }] = useLazyGetArticleByIdQuery();

  const handleLoadArticle = () => {
    trigger("PA_US_1");
  };

  return (
    <Box>
      <button onClick={handleLoadArticle}>
        Cargar Artículo
      </button>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Error: {error.message}</Alert>}
      {data && (
        <Typography>{JSON.stringify(data, null, 2)}</Typography>
      )}
    </Box>
  );
}

export default ArticleExample;
