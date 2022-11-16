import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, alpha } from "@mui/material/styles";
import { Paper } from '@mui/material';

// import './Offer.css'

const OfferSection = {
    height: ".5rem",
    minHeight: ".5rem"
}

// const OfferSection = styled("Appbar")(({ theme }) => ({
//   backgroundColor: "var(--secondaryColor)",
//     height: "36px",
//     minHeight: "36px"
  

// }));

const ToolbarSection = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
}

const TypographySection = {
  paddingTop: "2px"
}


const Offer = () => {

  return (
    <AppBar position="static" sx={OfferSection}>
        <Paper sx={{ backgroundColor:"secondary.main", color:"primary.main" }}>
        <Toolbar sx={ToolbarSection}>
          <Typography style={TypographySection} sx={{ flexGrow: 1, textAlign:'center', fontSize:'.2rem' }}>
            {/* Mind School will be live soon! */}
          </Typography>
        </Toolbar>
      </Paper>
      </AppBar>
  )
}

export default Offer