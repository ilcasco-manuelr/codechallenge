import React, { useEffect, useState } from "react";
import CardComponent from "./Card";
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  AlertTitle
} from "@mui/material";

import DetailsComponent from './Details'

const CardList = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [addedFavName, setAddedFavName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [serieId, setSerieId] = useState(0);

  useEffect(() => {
    // Api Read
    const fetchData = async () => {
      const response = await fetch("http://api.tvmaze.com/shows");
      const data = await response.json();
      setSeriesData(data);
    };
    fetchData();
  }, []);

  const handleFavoritesClick = (id, name) => {
    setAddedFavName(name);
    setShowAlert(true);
    console.log(`${id} added to Favorites`);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFavoritesChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleOpenModal = (id) => {
    setSerieId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
         <h1>My TV Shows</h1>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <TextField
          id="outlined-search"
          label="Filter"
          onChange={handleFilterChange}
          placeholder="Type to filter"
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 3,
        }}
      >
        <FormControlLabel
          control={<Switch onChange={handleFavoritesChange} color="primary" />}
          label="View Favorites"
        />
      </Grid>

      <Grid sx={{ flexGrow: 1, marginTop: 3 }} container spacing={2}>
        {seriesData
          .filter(
            (serie) =>
              serie.name.toLowerCase().includes(filterValue.toLowerCase()) &&
              (!checked || serie.favorite)
          )
          .map((serie) => (
            <CardComponent
              key={serie.id}
              image={serie.image.medium}
              name={serie.name}
              rating={serie.rating.average}
              onFavsClick={() => handleFavoritesClick(serie.id, serie.name)}
              onCardClick={() => handleOpenModal(serie.id)}
            />
          ))}
      </Grid>
      <Snackbar
        sx={{ width: "100%" }}
        spacing={2}
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ width: 500 }}
      >
        <Alert severity="success" variant="filled">
          <AlertTitle>
            <strong>{addedFavName}</strong>
          </AlertTitle>
          Added to Favorites
        </Alert>
      </Snackbar>
      <DetailsComponent 
        id= {serieId}
        open={openModal}
        openModalClick = {() => handleOpenModal(serieId)}
        closeModalClick = {() => handleCloseModal()} />
    </Grid>
  );
};

export default CardList;
