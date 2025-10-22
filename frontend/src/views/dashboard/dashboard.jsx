import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const KpiCard = ({ title, value, trend, trendValue }) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const TrendIcon = trend === 'up' ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" component="div" fontWeight={600} sx={{ mt: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          {trend && (
            <>
              <TrendIcon sx={{ fontSize: 16, mr: 0.5, color: getTrendColor() }} />
              <Typography variant="body2" sx={{ color: getTrendColor() }}>
                {trendValue}
              </Typography>
            </>
          )}
          {!trend && (
            <Typography variant="body2" color="text.secondary">
              {trendValue}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const kpiData = [
    {
      title: 'Service Level',
      value: '98.5%',
      trend: 'up',
      trendValue: '1.2%'
    },
    {
      title: 'Avg. Handle Time',
      value: '4m 32s',
      trend: 'down',
      trendValue: '3.5%'
    },
    {
      title: 'First Call Resolution',
      value: '89.1%',
      trend: 'up',
      trendValue: '0.8%'
    },
    {
      title: 'Agent Adherence',
      value: '94.2%',
      trend: null,
      trendValue: '-0.2%'
    }
  ];

  return (
    <Box>
      {/* KPI Cards Grid */}
      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
            />
          </Grid>
        ))}
      </Grid>

      {/* Power BI Report Area */}
      <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
          Operational Overview (Power BI)
        </Typography>
        <Box
          sx={{
            mt: 2,
            height: 384,
            backgroundColor: theme.palette.grey[200],
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Embedded Power BI Report Area
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

