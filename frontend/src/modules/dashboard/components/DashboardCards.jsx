import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import { AppText } from "../../../common/components/ui/AppText";

export const DashboardCards = () => {
  return (
    <Card
      sx={{
        maxWidth: "100%",
        //margin: "1rem 0 1rem 4rem",
        height: 500,
        borderRadius: '1.5rem',
        backgroundColor:'#1658d479'
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
        <CardContent>
          <AppText variant="h3" sx={{ mb: 1 }}>
            Lizard
          </AppText>
          <AppText variant="body" color="secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </AppText>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DashboardCards;
