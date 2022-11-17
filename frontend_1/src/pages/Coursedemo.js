import React, { useCallback, useEffect, useRef, useState } from "react";
// import Course from '../components/course/Course';
import coursesData from "../data/coursesData";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { width } from "@mui/system";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import * as React from 'react';
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
// import Box from '@mui/material/Box';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Container, CssBaseline, TextField } from "@mui/material";
import { CardActionArea } from "@mui/material";
import ReactPlayer from "react-player";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api/Axios";
import { Reviews } from "@mui/icons-material";
import swal from "sweetalert";
import Swal from "sweetalert2";

const COURSE_URL = "/api/give-a-review";
const VIDEOCIPHER_URL = "/api/playthevideo";
const COURSE_VDO_URL = "/api/course";

const VideoGridWrapper = styled(Grid)(({ theme }) => ({
  marginTop: "30%",
}));

const VdoPlayerStyle = styled("div")(({ theme }) => ({
  width: { sm: "100%", md: "100%", xs: "100%", lg: "100%" },
  height: { sm: "100%", md: "100%", xs: "100%", lg: "100%" },
}));

const Coursedemo = () => {
  const [courses, setCourses] = useState([]);
  const [played, setPlayed] = useState(0);
  const [videolink, setVideolink] = useState(
    `<iframe width="560" height="315" src="https://www.youtube.com/embed/qFYcwbu-H-s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  );
  const [review, setReview] = useState("");
  const [username, setUser] = useState(localStorage.getItem('user'));
  const [videoID, setVideoID] = useState();
  const [otpplayback, setOtpPlayback] = useState("");
  const [otp, setOtp] = useState("");
  const [playbackInfo, setPlaybackInfo] = useState("");
  const [coursesVdoList, setCoursesVdoList] = useState([]);
  

  let location = useLocation();

  let courseData = location.state.courseId;
  let courseID = courseData.courseID;

  
  const textstyle = {
    textDecoration: "none",
  };
  const navigate = useNavigate();

  let handleSubmitReview = async () => {
    const response = await api
      .post(COURSE_URL, JSON.stringify({ username, courseID, review }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data)=>{
          //console.log(data.status)
          if(data.status===200){
            swal("Review Submitted","","success")
          }
      });

    //console.log("response", response);
  };

  // vdo list
  let courseVideo = async () => {
    const response = await api
      .post(COURSE_VDO_URL, JSON.stringify({ courseID }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        data.data.data.lessons.map((lesson)=>
        {lesson["isVdoSet"]=false})
        setCoursesVdoList(data.data.data.lessons);
        setVideoID(data.data.data.lessons[0].videoID)
        //console.log("vdo list");
      });
  };
  
  let fetchVdoCipher = useCallback(async () => {
    await api
      .post(VIDEOCIPHER_URL, JSON.stringify({ videoID }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        setOtp(data.data.data.otp);
        setPlaybackInfo(data.data.data.playbackInfo);
      });
  });

  useEffect(() => {
    fetchVdoCipher();
    courseVideo();
  }, []);

  // vdo cipher
  const container = useRef();
  const [isVideoAdded, setIsVideoAdded] = useState(false);
  const loadVideo = useCallback(
    ({ otp, playbackInfo, container, configuration,courseVdo }) => {
      const params = new URLSearchParams("");
      const parametersToAdd = { otp, playbackInfo, ...configuration };
      for (const item in parametersToAdd) {
        params.append(item, parametersToAdd[item]);
      }
      const iframe = document.createElement("iframe");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("allow", "autoplay; encrypted-media");
      iframe.setAttribute("frameborder", "0");
      iframe.style = "height: 100%; width: 100%;overflow: auto;";
      iframe.src = "https://player.vdocipher.com/v2.0/?" + params;
      container.append(iframe);
      courseVdo["isVdoSet"]=true;
    },
    []
  );

  const handleClick = useCallback(
    async (otp, playbackInfo, courseVdo) => {
      // let response = await fetchVdoCipher();

      // //console.log("response",  {...otpplayback})

      if (!container.current) return;
      if (courseVdo["isVdoSet"]) {
        courseVdo["isVdoSet"]=false;
        // return (container.current.innerHTML = "Click Add Video button");
      }
      container.current.innerHTML = "";

      //console.log("otp b4 load", otp);
      //console.log("playbackInfo b4 load", playbackInfo);
      loadVideo({
        // ...otpplayback,
        otp: otp,
        playbackInfo: playbackInfo,
        // otp: "",
        // playbackInfo:
        //   "",
        configuration: { noClipstate: true },
        container: container.current,
        courseVdo,
      });
    },
    [loadVideo]
  );

  return (
    <>
      
      <Container sx={{ marginTop: "5%", marginBottom: "10%" }}>
        <Box
          container
          rowSpacing={1}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: {
              sm: "columnReverse",
              xs: "column-reverse",
              md: "row",
              lg: "row",
            },
          }}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Box item xs={6} sx={{ marginRight: "2%" }}>
            {coursesVdoList.map((courseVdo) => {
              courseVdo["isVdoAdded"]=false
              return (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{courseVdo.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{cursor: "pointer"}} onClick={()=>{
                      api
                      .post(
                        VIDEOCIPHER_URL,
                        JSON.stringify({ videoID: courseVdo.videoID }),
                        {
                          headers: { "Content-Type": "application/json" },
                          "Access-Control-Allow-Credentials": true,
                        }
                      )
                      .then((data) => {
                        setOtp(data.data.data.otp);
                        setPlaybackInfo(data.data.data.playbackInfo);
                        handleClick(data.data.data.otp, data.data.data.playbackInfo, courseVdo);
                       
                      });
                    }}>
                      {/* {courseData.description[0]}<br/> */}
                      {/* {courseVdo.videoID} */}
                      Click here to play the Video
                      <br />
                     
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
              );
            })}

          </Box>
         
          <Box
            className="vdo-container"
            ref={container}
            sx={{
              marginTop: "1rem",
              width: "100%",
              maxWidth: "800px",
              backgroundColor: "primary.main",
              height: "30rem",
              padding: "1rem",
              borderRadius: "8px",
              position: "relative",
              boxSshadow: "0 2px 20px 7px rgb(0 0 0 / 5%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:"other.dark"
            }}
          >
            Click Add Video button
          </Box>
          {/* </Box> */}
        </Box>
      </Container>
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4">Write your Feedback below</Typography>
        <TextField
          sx={{ margin: "2%" }}
          id="outlined-basic"
          fullWidth
          multiline
          rows={4}
          label="My Feedback"
          variant="outlined"
          onChange={(e) => setReview(e.target.value)}
        />
        <Button
          sx={{ margin: "2%" }}
          variant="contained"
          onClick={handleSubmitReview}
        >
          Submit
        </Button>
      </Container>
    </>
  );
};

export default Coursedemo;
