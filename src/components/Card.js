import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Rating,
  CardActions,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const CardComponent = ({ image, name, rating, onFavsClick, onCardClick }) => {
  return (
    <Grid item xs={1}>
      <Card>
        <CardActionArea onClick={onCardClick}>
          <CardMedia component="img" height="140" image={image} alt={name} />
        <CardContent>
          <Typography variant="body2" height={50} gutterBottom>
            <b>{name}</b>
          </Typography>
        </CardContent>
        </CardActionArea>
        <Rating name="rating" value={rating / 2} precision={0.5} readOnly />
        <CardActions >
          <IconButton
            onClick={onFavsClick}
            aria-label="add to favorites"
            variant="outlined"
          >
            <FavoriteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CardComponent;
