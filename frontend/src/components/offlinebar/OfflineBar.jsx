import { Typography } from '@mui/material';
import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';


const OfflineBar = () => {
    return (
        <>
            <Typography variant='p' 
            sx={{display:"flex",alignItems:"center",
            justifyContent:"center",backgroundColor:"pink", color:"#D32E2E"}}>
                <CircularProgress sx={{color:"#D32E2E", padding: "10px"}}/> waiting for connection</Typography>
        </>
    );
};

export default OfflineBar;