import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useTranslation } from 'react-i18next';
import { typography } from '../../layouts/style/styles';

export const KnowledgeBaseView = () => {
  const { t } = useTranslation();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          Knowledge Base
        </Typography>
      </Box>

      {/* Coming Soon Card */}
      <Card>
        <CardContent
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4
          }}
        >
          <MenuBookIcon
            sx={{
              fontSize: 64,
              color: 'primary.main',
              mb: 3
            }}
          />
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Knowledge Base Module
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            This module will include article management, search functionality, and content creation tools.
          </Typography>
          <Chip
            label="Coming in Phase 5"
            color="warning"
            variant="outlined"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

