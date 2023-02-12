import { Box, Typography } from '@mui/material'
import Lottie from "lottie-react";
import React from 'react'
import failed_lottie from "../components/downloadApp/failed_lottie.json"
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import AlarmOnRoundedIcon from '@mui/icons-material/AlarmOnRounded';

export default function PaymentStatus() {
   
    return (
        <Box sx={{display:"flex", alignItems:"center",justifyContent:"center", 
        top: "50%", height:"60vh"}}>
            <Lottie
                animationData={failed_lottie}
                
            />
            <Box>
            <Typography sx={{fontSize:"2rem"}}>
                Are you facing trouble making payment online?
            </Typography>
            <Typography sx={{fontSize:"1.5rem"}}>
                Please contact us
            </Typography>
            <Typography sx={{fontSize:"1rem", display:"flex", mt:"1rem"}}>
            <LocalPhoneIcon sx={{mx:"1rem"}}/>
            +880248811161
            </Typography>
            <Typography sx={{fontSize:"1rem", display:"flex", mt:".5rem"}}>
            <LocalPhoneIcon sx={{mx:"1rem"}}/>
            +880248811162
            </Typography>
            <Typography sx={{fontSize:"1rem", mt:".5rem", display:"flex"}}><AlarmOnRoundedIcon sx={{mx:"1rem"}}/>SAT - THU 10.00-17.00</Typography>
            <Typography sx={{fontSize:"1rem",mt:".5rem", mx:"1.3rem"}}>or</Typography>
            <Typography sx={{fontSize:"1rem", display:"flex", mt:".5rem"}}><EmailIcon sx={{color:"color.main", mx:"1rem"}}/> 
            
            support@mindschoolbd.com
              </Typography>

            </Box>
        </Box>
    )
}
