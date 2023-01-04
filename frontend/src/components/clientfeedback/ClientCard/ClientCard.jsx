import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';

import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box } from '@mui/system';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ClientCard = (props) => {
  AOS.init({duration:2000,once: true});
    let name=props.name;
    let designation= props.designation
    let org= props.org
    let img=props.img;
    let feedback=props.feedback;

  return (
    
      <Box sx={{margin:"1.5rem"}}>
    <Card sx={{ maxWidth: 345,height:"19rem",
      "&:hover":{boxShadow:"5"} }} 
      // data-aos="flip-left"
      >
      <CardHeader
        avatar={
          <Avatar src={img?img:<AccountCircleIcon sx={{
            fontSize:"3rem"
        }}/>} sx={{ 
            bgcolor: "primary.main",
            width: 56, height: 56
         }} aria-label="client" >
          </Avatar>

        }
        // title={name}
        // title1={designation}
        // title2={org}
        title={<CardContent>
          <Typography sx={{fontSize:"1rem"}}>{name}</Typography>
          <Typography sx={{fontSize:".7rem"}}>{designation}</Typography>
          <Typography sx={{fontSize:".8rem"}}>{org}</Typography>
        </CardContent>}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom
          height={100}
          sx={{
            fontSize: ".7rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            fontWeight:"500"
          }}>
        {feedback}
        </Typography>
      </CardContent>
    </Card>
    </Box>
 
  )
}

export default ClientCard