import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const cards = [
  {
    id: 1,
    title: 'Plants',
    description: 'Plants are essential for all life.',
    backgroundColor:'#16d42079'
  },
  {
    id: 2,
    title: 'Animals',
    description: 'Animals are a part of nature.',
    backgroundColor:'#6f16d479'
  },
  {
    id: 3,
    title: 'Humans',
    description: 'Humans depend on plants and animals for survival.',
    backgroundColor:'#d45c1679'
  },
];

export const DashboardCards1 =()=> {
  const [selectedCard, setSelectedCard] = React.useState(0);
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
        borderRadius: '4rem'
        //margin:'2rem 0 1rem 8rem'
      }}
    >
      {cards.map((card, index) => (
        <Card
        sx={{
            borderRadius: '1.5rem'
        }}
        >
          <CardActionArea
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: card.backgroundColor,
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
            <CardContent >
              <Typography variant="h5" component="div">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

