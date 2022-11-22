import React, { useEffect, useState, Component } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import coursesData from "../data/coursesData";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid,CardActionArea } from "@mui/material";
import InstructorCard from "../components/InstructorCard/InstructorCard";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  
  useLocation,
} from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@mui/material/Button";
import ReactPlayer from "react-player";
import api from "../api/Axios";
import { blue } from "@mui/material/colors";
import { styled, alpha } from "@mui/material/styles";

import { withRouter } from "../components/routing/withRouter";
import { Container } from "@mui/system";
import googlebtn from "../components/downloadApp/playstore.png"
import applebtn from "../components/downloadApp/applestore.png";
import {Link as Routerlink} from "react-router-dom";
import Link from '@mui/material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { instructorData } from "../data/instructorData";
import AOS from 'aos';
import 'aos/dist/aos.css';
import InstructorInCourseDetails from "../components/InstructorInCourseDetails/InstructorInCourseDetails";


const VIDEOLOG_URL = "/videologdata";

function Item(props) {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}


const textstyle = {
    textDecoration: "none",
  };

Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const CardGridStyle = styled(Card)(({ theme }) => ({
    margin: "5px",
  }));
  
  const CardMediaStyle = styled(CardMedia)(({ theme }) => ({
    width: "105%",
  }));

const VideoGridWrapper = styled(Grid)(({ theme }) => ({
  marginTop: "10%",
}));


const VdoPlayerStyle = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
}));



Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const CoursesDetails = () => {
  AOS.init({duration:2000});
  const [played, setPlayed] = useState(0);
  const [instructorState, setInstructorState] = useState(instructorData);
  const loggedin= localStorage.getItem("access_token")
  let location = useLocation();
  

  let state = location.state.courseId;
  
  console.log("state",state)
  return (
   
    <Box >
      <Container >
      {/* <Typography variant="h3" sx={{display:"flex", justifyContent:"center"}}>Course Details</Typography> */}
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}
       sx={{marginTop:"5rem"}}>
        <Grid item xs={12} lg={6} data-aos="fade-right">
          <Typography variant="h4" sx={{color:"primary.main"}}>{state?.title}</Typography>
          <Typography variant="h6"
           sx={{marginTop:"2rem", marginBottom:"2rem"}}>
            {state?.description}</Typography>
            
         {loggedin?
          <Routerlink to="/coursedemo" state={{ courseId: state}}
          style={{textDecoration:'none'}}
          >
            <Button variant="contained" color="primary">
              <Typography variant="p" color="other.dark" 
              >
                Start now
              </Typography>
            </Button>
          </Routerlink>:
           <Routerlink to="/login" 
           style={{textDecoration:'none'}}
           >
             <Button variant="contained" color="primary">
               <Typography variant="p" color="other.dark" 
               >
                 Start now
               </Typography>
             </Button>
           </Routerlink>}
        </Grid>
        <Grid item xs={12} lg={6} data-aos="fade-left">
          <Item>
                {/* <VideoGridWrapper> */}
            {/* <Grid > */}
        {/* <VdoPlayerStyle> */}
          <Box sx={{display:"flex", padding:"5%",marginLeft:"10%"}}>
            <ReactPlayer 
            url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
            playing
             height="100%"
             width="100%"
            controls={true}
            onProgress={(progress)=>{
              setPlayed(progress.playedSeconds);             
            }}
            onPlay={() => {
              //console.log("play data sent");
              const response = api.post(VIDEOLOG_URL,
                JSON.stringify({ }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    'Access-Control-Allow-Credentials': true
                }
            );
            }}
            onPause={() => {
              //console.log("pause data sent");
              const response = api.post(VIDEOLOG_URL,
                JSON.stringify({ }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    'Access-Control-Allow-Credentials': true
                }
            );
            }}
            // onProgress={//console.log("playing")}
          /> 
           
          </Box>
          {/* </VdoPlayerStyle> */}
    {/* </Grid> */}
    {/* </VideoGridWrapper> */}
          </Item>
        </Grid>
    
      </Grid>
    </Box>
       
    </Container>

    <Container sx={{marginTop:"5rem"}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7} data-aos="fade-right">
        <Typography variant="h4" sx={{color:"primary.main"}}>Course Details:</Typography>
        {/* <Typography variant="h6" >
        <img  src={state?.thumbnail} alt=""/>
        </Typography> */}
        <Typography variant="h6">
        <Typography variant="h6" 
        sx={{color:"primary.main",
        marginTop:"2rem", display:"flex",alignItems:"center"
        }}><CheckCircleOutlineIcon/>
        Total Lecture: </Typography>{state?.introduction}
        </Typography>
        <Typography variant="h6">
        <Typography variant="h6" sx={{color:"primary.main",
      marginTop:"1rem", display:"flex",alignItems:"center"}}>
        <CheckCircleOutlineIcon/>Course Length:</Typography>
         {state?.courseLength} Hours
        </Typography>
        <Typography variant="h6">
        {/* {state?.description} */}
        </Typography>
        <Typography variant="h6">
        {/* ৳{state?.instructor} */}
        </Typography>
        <Typography variant="h6">
          <Typography variant="h6" 
          sx={{color:"primary.main", marginTop:"1rem",
           display:"flex",alignItems:"center"}}>
            <CheckCircleOutlineIcon/>Course Decription:
            </Typography>
         {state?.description}
        </Typography>
        <Typography variant="h6">
        <Typography variant="h6" 
        sx={{color:"primary.main", marginTop:"1rem",
         display:"flex",alignItems:"center"}}>
        <CheckCircleOutlineIcon/>Course Price:  </Typography>
        ৳{state?.price}
        </Typography>
        </Grid>
        <Grid item xs={12} lg={5} data-aos="fade-left">
        <Box>
          {/* instructor card */}
          <InstructorInCourseDetails
                title={state?.instructor?.name}
                instructor={state?.instructor?.designation}
                img={state?.instructor?.image}
                description= {state?.instructor?.description}
              ></InstructorInCourseDetails>
        <Box>

        </Box>
        <Box 
        sx={{margin:"2%",padding:"2%",border:"1px solid white",
        borderRadius:"5px", marginTop:"2rem",
        boxShadow: "1px 1px 14px 1px rgba(102,102,102,0.83);"}}>
        <Typography
         sx={{
          paddingBottom:"5%"}} 
          variant="h4">
            You can Download Our App From Here
        </Typography>
        {/* <Box 
        sx={{paddingTop:"5%",
         paddingBottom:"5%", 
         display:"flex", 
         justifyContent:"space-around"}}>
        <Grid sx={{}}>   
              <Box >
              <Link href='https://google.com'>               
       <Button variant="text" 
       sx={{
        p:0, mt:1
       }}>
        <CardMedia
        component="img"
        // height="300"
        image={googlebtn}
        alt="image"
        sx={{
          m:0,
          p:0,height:{md:"50px", sm:"40px"},width:{md:"150px", sm:"120px"}
        }}
      />
       </Button>
       </Link> 
              </Box>
              </Grid>
              <Grid>
              <Box>
              <Link href='https://google.com'>
       <Button variant="text" sx={{
        p:0, mt:1
       }}>
        <CardMedia
        component="img"
        // height="auto"
        image={applebtn}
        alt="image"
        sx={{
          mt:0,
          p:0, height:{md:"50px", sm:"40px"},width:{md:"150px", sm:"120px"}
        }}
      />
       </Button>
       </Link> 
              </Box>
              </Grid>       
        </Box> */}
           <Box sx={{display:"flex"}}>
          <Link href="https://techanalyticaltd.com/" target="new">
                <Box
                  sx={{
                    // backgroundColor: "other.logocolor",
                    backgroundColor: "secondary.main",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "10px",
                    margin:"2%"
                  }}
                >
                  <img src={googlebtn} alt="google" width="96%" />
                </Box>
              </Link>
              <Link href="https://techanalyticaltd.com/" target="new">
                <Box
                  sx={{
                    // backgroundColor: "other.footercolor",
                    backgroundColor: "secondary.main",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "10px",
                    margin:"2%"
                  }}
                >
                  <img src={applebtn} alt="google" width="80%" />
                </Box>
              </Link>
          </Box>
        </Box>
    </Box>
        </Grid>      
      </Grid>
    </Box>
  
    </Container>
      </Box>
    
  );
};

export default CoursesDetails;

