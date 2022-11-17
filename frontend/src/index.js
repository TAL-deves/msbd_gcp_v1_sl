import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StepContext from './pages/StepContext';
import primarytheme from "./style/style";


import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './Store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

 <>
    {/* <StepContext> */}
    <ThemeProvider theme={primarytheme}>
    <CssBaseline/>
    <Provider store={store}>
    <App />
    </Provider>
    </ThemeProvider>
    {/* </StepContext> */}
 
  </>
);
