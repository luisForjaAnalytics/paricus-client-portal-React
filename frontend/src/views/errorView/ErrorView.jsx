import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const ErrorView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          textAlign: 'center',
          py: 8
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 120,
            color: 'error.main',
            mb: 3
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          gutterBottom
        >
          {t('errors.notFound.code')}
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {t('errors.notFound.title')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500 }}
        >
          {t('errors.notFound.description')}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
        >
          {t('errors.notFound.goHome')}
        </Button>
      </Container>
    </Box>
  );
};

