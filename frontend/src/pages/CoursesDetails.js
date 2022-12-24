import React, { useEffect, useState, Component, useContext } from "react";
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
  useNavigate,
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
import { globalContext } from "./GlobalContext";
import swal from "sweetalert";



const VIDEOLOG_URL = "/videologdata";
const COURSE_DETAILS_URL= "/api/coursedetails";
let USER_COURSES_URL = "/api/usercourses"

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
  const [startbutton, setStartButton]= useState(true)
  const videoRef = React.useRef(null);
  const navigate = useNavigate();
  const { language } = useContext(globalContext);
  AOS.init({duration:2000});
  const [played, setPlayed] = useState(0);
  const [state, setState] = useState({});
  const [instructorState, setInstructorState] = useState(instructorData);
  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);
  const loggedin= localStorage.getItem("access_token")
  let location = useLocation();
  

  let fullobject = location.state.courseId;
  let courseID= fullobject.courseID



let fetchData = async () => {
  let username = localStorage.getItem("user")
  await api
    .post(USER_COURSES_URL, JSON.stringify({ username }), {
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Credentials": true,
    })
    .then((data) => {
      //  console.log("ins dta", data);
      if (data.data.result.status === 404 || data.data.result.status === 401) {
        // swal("No Puchase Done Yet", "You will get to see only purchased courses here","info")
        setCourses([])
      }
      else {
        setCourses(data.data.data)
        // console.log("state",data.data.data)
      }
      
      setLoad(false);
    });
};



let fetchCourseDetails= async()=>{
  await api
  .post(COURSE_DETAILS_URL, JSON.stringify({ courseID, language }), {
    headers: { "Content-Type": "application/json" },
    "Access-Control-Allow-Credentials": true,
  })
  .then((data) => {
     // console.log("single course id", data);
     setState(data.data.data)
     
  });

};

useEffect(() => {
  fetchData();
  fetchCourseDetails()
  
}, [language]);


let existingCourse;
let newButton= false
// console.log(" courses----",courses)
if(courses!==null && courses.length !== 0){
  // console.log("find check-----",courses.find(c=>c.courseID===state?.courseID))
   existingCourse=courses.find(c=>c.courseID===state?.courseID)
  //  console.log("existed courses----",existingCourse)
  //  setStartButton(true)
  newButton=true
}






return (
   
    <Box >
      <Container >
      {/* <Typography variant="h3" sx={{display:"flex", justifyContent:"center"}}>Course Details</Typography> */}
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}
       sx={{marginTop:"5rem"}}>
        <Grid item xs={12} lg={6} data-aos="fade-right">
          <Typography variant="h4" sx={{color:"primary.main"}}>
          
            {state?.title}
            {/* Demo */}
            </Typography>
          <Typography variant="h6"
           sx={{marginTop:"2rem", marginBottom:"2rem"}}>
            {state?.description}
            
            {/* {(state?.description).map((description)=>
            console.log(state?.description)
            (<Typography variant="h6">{description}</Typography>
              
            )
            )} */}

           
            </Typography>

            
           <>
         {loggedin?
         <>
         
         {/* {Object.keys(existingCourse).length === 0 && existingCourse.constructor === Object ? */}
         {existingCourse===undefined?
          <Button sx={{marginLeft:"0rem"}}
          //  onClick={response}
          onClick={() => {
            
            navigate("/payment-info", { state: { total: state?.price, singleCourse: state?.courseID} }
            )
          }}
          variant="contained">Buy Now
        </Button>
        :
          <Routerlink to="/coursedemo" state={{ courseId: state}}
          style={{textDecoration:'none'}}
          >
            <Button variant="contained" color="primary">
              <Typography variant="p" color="other.dark" 
              >
                Start now
              </Typography>
            </Button>
          </Routerlink>
        
          }</>:
           <Routerlink to="/login" 
           style={{textDecoration:'none'}}
           >
             <Button variant="contained" color="primary">
               <Typography variant="p" color="other.dark" 
               >
                 Buy now
               </Typography>
             </Button>
           </Routerlink>}
           </>
           
          
           {/* <Button sx={{marginLeft:"2rem"}}
                //  onClick={response}
                onClick={() => {
                  
                  navigate("/payment-info", { state: { total: state?.price, singleCourse: state?.courseID} }
                  )
                }}
                // disabled={(courseList.length === 0) ? true : false || checkBoxStatus === false }
                // disabled
                variant="contained">Buy Now
              </Button> */}
              
        </Grid>
        <Grid item xs={12} lg={6} data-aos="fade-left">
          <Item>
                {/* <VideoGridWrapper> */}
            {/* <Grid > */}
        {/* <VdoPlayerStyle> */}
        <Box sx={{backgroundColor:"primary.main", borderRadius:"10px",width:"100%",height:"80%",  paddingTop:".8rem", paddingBottom:".5rem", overflow:"hidden"}}>
            <iframe ref={videoRef} width="100%" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8?autoplay=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
        Total Lecture: </Typography>{state?.totalLecture}
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
           <Box sx={{display:"flex", alignItems:"center"}}>
          <Link href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school" target="new">
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
              {/* <Link href="https://techanalyticaltd.com/" target="new"> */}
                <Box
                onClick={()=>{swal("IOS app is coming soon", "Thanks for your patience", "info")}}
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
              {/* </Link> */}
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