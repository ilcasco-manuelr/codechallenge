import React from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Grid,
  Link,
  Rating,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetailsComponent = ({ data, open, closeModalClick }) => {
  const serieData = data;
  return (
    data && (
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={closeModalClick}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={closeModalClick}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {serieData.name}
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid container spacing={4}>
            <Grid item xs={6} md={4}>
              <img
                src={serieData.image.original ? serieData.image.original : "No_image"}
                alt={serieData.name}
                style={{ maxWidth: "100%" }}
              />
            </Grid>
            <Grid item xs={6} md={8}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: serieData.summary }}
              ></Typography>
              {serieData.externals.imdb ? (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2">
                    <strong>IMDb: </strong>{" "}
                    <Link
                      href={`https://www.imdb.com/title/${serieData.externals.imdb}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {serieData.externals.imdb}
                    </Link>
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={6} md={4}>
                  <Typography variant="body2">
                    No IMDb Found
                  </Typography>
                </Grid>
              )}
              <br />
              <Grid item xs={6} md={3}>
                <Typography variant="body2">
								<strong> Genres:</strong> {serieData.genres.join(", ")}
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2">
                  <br />
                  <strong>Rating:</strong> {serieData.rating.average}/10
                  <Box component="span" sx={{ marginLeft: "8px" }}>
                    <Rating
                      name="rating"
                      value={serieData.rating.average / 2}
                      precision={0.5}
                      readOnly
                    />
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    )
  );
};

export default DetailsComponent;
