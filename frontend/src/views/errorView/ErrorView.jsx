import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const ErrorView = () => {
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
          404
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
        >
          Go Home
        </Button>
      </Container>
    </Box>
  );
};

