import React, { useEffect, useState } from "react";
import CardComponent from "./Card";
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DetailsComponent from "./Details";
import axios from "axios";

const CardList = () => {
  const [user, setUser] = useState();
  const [seriesData, setSeriesData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState(false);
  const [addedFavName, setAddedFavName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [serieId, setSerieId] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const reloadFavs = async (data) => {
    const addingFavorites = data.map((item) => ({
      ...item,
      favorite: isFavorite(item.id),
    }));
    setSeriesData(addingFavorites);
  };

  const getUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/client");
      setUser(response.data.user);
      setFavoritesData(response.data.Favorites);
    } catch (error) {
      console.error("Error: %o", error);
      setUser();
    }
  };

  const updateFavorites = async (newFavs) => {
    try {
      const params = {
        Favorites: newFavs,
      };
      const response = await axios.put(
        "http://localhost:3001/api/users/" + user,
        params
      );
      setFavoritesData(newFavs);
    } catch (error) {
      console.error("Error: %o", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://api.tvmaze.com/shows");
      const data = await response.data;
      await reloadFavs(data);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    reloadFavs(seriesData);
  }, [favoritesData]);

  const isFavorite = (id) => {
    try {
      return favoritesData.includes(id);
    } catch (error) {
      return false;
    }
  };

  const handleFavoritesClick = (id, name, favorite) => {
    let newFavs = [];
    if (favorite) {
      setItemToDelete(id);
      setShowConfirmation(true);
    } else {
      newFavs = favoritesData.concat(id);
      setTypeAlert(true);
      setShowAlert(true);
      updateFavorites(newFavs);
    }
    setAddedFavName(name);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFavoritesChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleOpenModal = (id) => {
    const serieToShow = seriesData.find((item) => item.id === id);
    setSerieId(serieToShow);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmationYes = () => {
    const newFavs = favoritesData.filter((item) => item !== itemToDelete);
    setTypeAlert(false);
    setShowAlert(true);
    updateFavorites(newFavs);
    setShowConfirmation(false);
  };

  const handleConfirmationNo = () => {
    setShowConfirmation(false);
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
              favorite={serie.favorite}
              rating={serie.rating.average}
              onFavsClick={() =>
                handleFavoritesClick(serie.id, serie.name, serie.favorite)
              }
              onCardClick={() => handleOpenModal(serie.id)}
            />
          ))}
      </Grid>
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item from favorites?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationYes} color="primary">
            Yes
          </Button>
          <Button onClick={handleConfirmationNo} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
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
        {typeAlert ? (
          <Alert color="success" variant="filled">
            <AlertTitle>
              <strong>{addedFavName}</strong>
            </AlertTitle>
            Added to Favorites
          </Alert>
        ) : (
          <Alert color="error" variant="filled">
            <AlertTitle>
              <strong>{addedFavName}</strong>
            </AlertTitle>
            Delete to Favorites
          </Alert>
        )}
      </Snackbar>
      <DetailsComponent
        data={serieId}
        open={openModal}
        openModalClick={() => handleOpenModal(serieId)}
        closeModalClick={() => handleCloseModal()}
      />
    </Grid>
  );
};

export default CardList;
