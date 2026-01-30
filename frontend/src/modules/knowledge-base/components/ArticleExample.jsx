import React from 'react';
import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import { useGetArticleByIdQuery } from '../../../store/api/articlesApi';
import { AppText } from '../../../common/components/ui/AppText';
import { AlertInline } from '../../../common/components/ui/AlertInline';

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
      <AlertInline
        severity="error"
        message={`Error al cargar el artículo: ${error.status} - ${error.data?.message || 'Error desconocido'}`}
      />
    );
  }

  return (
    <Card>
      <CardContent>
        <AppText variant="h2" sx={{ mb: 2 }}>
          {article?.title || 'Sin título'}
        </AppText>

        <AppText variant="small" color="secondary" sx={{ mb: 2, display: 'block' }}>
          ID: {articleId}
        </AppText>

        <AppText variant="body">
          {article?.content || 'Sin contenido'}
        </AppText>

        {/* Muestra todos los datos del artículo en formato JSON para depuración */}
        <Box mt={3}>
          <AppText component="pre" variant="small" sx={{
            background: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontFamily: 'monospace',
          }}>
            {JSON.stringify(article, null, 2)}
          </AppText>
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
      {error && <AlertInline severity="error" message={`Error: ${error.message}`} />}
      {data && (
        <AppText component="pre" variant="small" sx={{ fontFamily: 'monospace' }}>
          {JSON.stringify(data, null, 2)}
        </AppText>
      )}
    </Box>
  );
}

export default ArticleExample;
