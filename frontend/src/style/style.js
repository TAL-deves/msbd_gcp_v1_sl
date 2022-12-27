import {  createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// blue = #002054
// yellow = #F8B100
//pink= #FF8B8B

// Primary color = #0288d1
// secondary color = #4fc3f7


const primarytheme = createTheme({
    palette: {
    //   type: "light",
      primary: {
        // Purple and green play nicely together.
        main: '#002054',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#F8B100',
      },
      other:{
        black:"#000",
        white:"#fff",
        dark:"#fff",
        logocolor:"#F8B100",  // Primary color
        footercolor:"#002054",  // secondary color
        footertext:"#fff"
      },
      typography:{
        fontFamily:[
          'Hind Siliguri',
          'sans-serif',
        ].join(','),
      }

    }
  });

  

export default primarytheme;