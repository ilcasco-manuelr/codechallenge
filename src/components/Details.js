import React, { useEffect, useState } from "react";
import {
  Dialog,
  List,
  ListItemText,
  ListItem,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetailsComponent = ({ id, open, openModalClick, closeModalClick }) => {
  const [serieData, setSerieData] = useState([]);

  useEffect(() => {
    // Api Read
    const fetchData = async () => {
      const response = await fetch("http://api.tvmaze.com/shows/" + id);
      const data = await response.json();
      setSerieData(data);
    };
    fetchData();
  }, [id]);
  return (
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
      </Dialog>
    </div>
  );
};

export default DetailsComponent;
