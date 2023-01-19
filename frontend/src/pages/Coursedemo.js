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
import { set, useForm } from "react-hook-form";
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

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api/Axios";
import { Reviews } from "@mui/icons-material";
import swal from "sweetalert";
import Player from "../components/player";
import useVdocipher from "../hooks/use-vdocipher";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
  // 
  const [courses, setCourses] = useState([]);
  const [played, setPlayed] = useState(0);
  const [videolink, setVideolink] = useState(
    `<iframe width="560" height="315" src="https://www.youtube.com/embed/qFYcwbu-H-s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  );
  const [review, setReview] = useState("");
  const [username, setUser] = useState(localStorage.getItem('user'));
  const [videoID, setVideoID] = useState();
  const [courseId, setCourseId] = useState()
  // const [existingCourseID, setExistingCourseID] = useState()
  // const [otpplayback, setOtpPlayback] = useState("");
  const [otp, setOtp] = useState("");
  const [episode, setEpisode] = useState("");
  const [playbackInfo, setPlaybackInfo] = useState("");
  const [coursesVdoList, setCoursesVdoList] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [vdotitle, setVdotitle] = React.useState();
  const [count, setCount] = React.useState(true);
  const [completedEpisode, setCompletedEpisode] = React.useState([]);
  const [load, setLoad] = useState(true);
  // let n=0;

  let location = useLocation();

  let courseData = location.state.courseId;
  let courseID = courseData.courseID;
  // let completedEpisodeCount = 0;

  const textstyle = {
    textDecoration: "none",
  };
  const navigate = useNavigate();

  // for accordion 
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  //  review submit 
  let handleSubmitReview = async (e) => {
    const response = await api
      .post(COURSE_URL, JSON.stringify({ username, courseID, review }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        //// console.log(data.status)
        if (data.status === 200) {
          swal("Review Submitted", "", "success")
          // e.preventDefault();
        }
      });
     

    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
      // navigate("/login")
      // console.log("removed sesssion")
    }
    // e.preventDefault();
    //// console.log("response", response);
  };

  // vdo list
  let courseVideo = async () => {
    // setCount(n++)
    // // console.log("um called", count)
    // window.location.refresh();
    const response = await api
      .post(COURSE_VDO_URL, JSON.stringify({ courseID, username }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        // // console.log(data.data.data.lessonsCompleted)
        // data.data.data.lessons.map((lesson) => { lesson["isVdoSet"] = false })
        setCoursesVdoList(data.data.data.lessons);
        // setVideoID(data.data.data.lessons[0].videoID)
        setCompletedEpisode(data.data.data.lessonsCompleted)
        // console.log("data.data.data.lessons[0].videoID", (data.data.data.courseID))
        // setExistingCourseID(data.data.data.courseID)
        // completedEpisodeCount = (data.data.data.lessonsCompleted).length
        setStatusChanged(false)
        setLoad(false)

        if (data.data.result.status === 401 || data.data.result.status === 400 || data.data.result.status === 404) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
          // navigate("/login")
          // console.log("removed sesssion")
        }
      });
  };

  // let fetchVdoCipher = useCallback(async () => {
  //   await api
  //     .post(VIDEOCIPHER_URL, JSON.stringify({ videoID }), {
  //       headers: { "Content-Type": "application/json" },
  //       "Access-Control-Allow-Credentials": true,
  //     })
  //     .then((data) => {
  //       setOtp(data.data.data.otp);
  //       setPlaybackInfo(data.data.data.playbackInfo);
  //       // console.log("vdo list", data);
  //     });
  // });



  // vdo cipher
  const container = useRef();
  const [isVideoAdded, setIsVideoAdded] = useState(false);
  const { loadVideo, isAPIReady } = useVdocipher();
  const videoContainerRef = useRef();
  const [videoRef, setVideoRef] = useState(null);
  const [totalCoveredStatus, setTotalCoveredStatus] = useState(false)
  const [totalVideoDurationStatus, setVideoDurationStatus] = useState(false)
  const [statusChanged, setStatusChanged] = useState(false)


  // const loadVideo = useCallback(
  //   ({ otp, playbackInfo, container, configuration, courseVdo }) => {
  //     const params = new URLSearchParams("");
  //     const parametersToAdd = { otp, playbackInfo, ...configuration };
  //     for (const item in parametersToAdd) {
  //       params.append(item, parametersToAdd[item]);
  //     }
  //     const iframe = document.createElement("iframe");
  //     iframe.setAttribute("allowfullscreen", "true");
  //     iframe.setAttribute("allow", "autoplay; encrypted-media");
  //     iframe.setAttribute("frameborder", "0");
  //     iframe.style = "height: 100%; width: 100%;overflow: auto;";
  //     iframe.src = "https://player.vdocipher.com/v2.0/?" + params;
  //     container.append(iframe);
  //     courseVdo["isVdoSet"] = true;
  //   },
  //   []
  // ); 


  // function changecount(count){
  //   setCount(!count)
  // }



  useEffect(() => {
    courseVideo();

     setInterval(() => {
      setCount(!count)

    }, 300000)

  }, [count]);

  // console.log("hellooooo", coursesVdoList.length)

  const handleClick = useCallback(
    async (otp, playbackInfo, courseVdo) => {
      // let response = await fetchVdoCipher();

      // //// console.log("response",  {...otpplayback})

      if (!container.current) return;
      if (courseVdo["isVdoSet"]) {
        courseVdo["isVdoSet"] = false;
        // return (container.current.innerHTML = "Click Add Video button");
      }
      container.current.innerHTML = "";

      loadVideo({
        otp: otp,
        playbackInfo: playbackInfo,
        configuration: { noClipstate: true },
        container: container.current,
        courseVdo,
      });
    },
    [loadVideo]
  );
  //  console.log("status changed", statusChanged)
  return (
    <>
     {load ? (
        <Box sx={{width:"100%"}}>
        <Container sx={{

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem",
          marginLeft:"12vw"
          
        }}> 
          <CircularProgress sx={{
            color: "primary.main"
          }} />
        </Container>
        </Box>
      ) : (
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

            {/* {count? "true":"false"} */}
            {coursesVdoList.map((courseVdo, index) => {
              courseVdo["isVdoAdded"] = false
              // console.log("completedEpisode", completedEpisode.length, " index", index);
              return (
                <Accordion

                  disabled={completedEpisode.length >= index ? false : true}
                  sx={{ width: "22rem" }} expanded={expanded === `${courseVdo.episode}`} onChange={handleChange(`${courseVdo.episode}`)
                  }>

                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    onClick={(e) => {
                      // // console.log(e, "e")
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
                          // console.log(data.data.result.status, "data---------")
                          if (data.data.result.status === 401 || data.data.result.status === 400 || data.data.result.status === 404) {
                            localStorage.removeItem("access_token");
                            localStorage.removeItem("refresh_token");
                            localStorage.removeItem("user");

                            swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
                            // navigate("/login")
                            // console.log("removed sesssion")
                          }

                          setOtp(data.data.data.otp);
                          setPlaybackInfo(data.data.data.playbackInfo);
                          handleClick(data.data.data.otp, data.data.data.playbackInfo, courseVdo);
                          setVdotitle(`${courseVdo.title}`)
                          setEpisode(`${courseVdo.episode}`)
                          setVideoID(`${courseVdo.videoID}`)
                          // // console.log("vdo id -----------",`${courseVdo.videoID}`)
                          // setCount(count++)
                          // changecount()


                        });

                      videoRef.remove();
                      setVideoRef(null);
                      videoContainerRef.current.classList.remove("haveVideo");
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      {completedEpisode.find(c => c == courseVdo.episode) ?
                        // && existingCourseID==courseId
                        <Box sx={{ color: "green" }}>
                          <CheckCircleIcon />
                        </Box> :
                        <CheckCircleOutlineIcon />
                      }
                      <Typography>{courseVdo.title}  </Typography>

                    </Box>
                  </AccordionSummary>
                  {videoRef === null ?
                    <AccordionDetails>
                      <Typography sx={{ cursor: "pointer" }} onClick={async () => {
                        videoContainerRef.current.classList.add("haveVideo");
                        // const { otp, playbackInfo } = await dummyAPICall();
                        const video = loadVideo({
                          otp,
                          playbackInfo,
                          container: videoContainerRef.current,
                          configuration: {
                            noClipstat: true
                          }
                        });
                        setVideoRef(video);
                        // console.log("new course ID", courseVdo)
                      }}>
                        {/* {courseData.description[0]}<br/> */}
                        {/* {courseVdo.videoID} */}
                        {/* Click here to play the Video */}
                        <Box sx={{ display: "flex" }}>
                          <AccessTimeIcon />
                          <Typography>Duration: {courseVdo.length}</Typography>
                        </Box>
                        <Button variant="contained"> Play</Button>
                        <br />

                      </Typography>
                    </AccordionDetails> :
                    <AccordionDetails>
                      <Box sx={{ display: "flex" }}>
                          <AccessTimeIcon />
                          <Typography>Duration: {courseVdo.length}</Typography>
                        </Box>
                      <Button variant="contained" disabled> Play</Button>
                    </AccordionDetails>}
                </Accordion>

              );
            })}

          </Box>
          {/* <Box sx={{display:"flex", flexDirection:"column"}}> */}
          {/* uncommmmmmmm */}
          <Box
            // className="vdo-container"
            // ref={container}
            sx={{
              // marginTop: "1rem",
              width: "100%",
              maxWidth: "800px",
              //  backgroundColor: "primary.main",
              // height: "30rem",
              // padding: "1rem",
              // borderRadius: "8px",
              //   position: "relative",
              // boxSshadow: "0 2px 20px 7px rgb(0 0 0 / 5%)",
              // display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "other.dark",
              marginBottom: "1rem"
            }}
          >
            {/* <Typography>{vdotitle}</Typography>*/}
            {/* Click Add Video button  */}
            <Player count={count} setCount={setCount} setCourseId={setCourseId} statusChanged={statusChanged} setStatusChanged={setStatusChanged} totalCoveredStatus={totalCoveredStatus} setTotalCoveredStatus={setTotalCoveredStatus} totalVideoDurationStatus={totalVideoDurationStatus} setVideoDurationStatus={setVideoDurationStatus} otp={otp} videoID={videoID} vdotitle={vdotitle} episode={episode} coursesVdoList={coursesVdoList} playbackInfo={playbackInfo} videoRef={videoRef} videoContainerRef={videoContainerRef} />
          </Box>



          {/* <Box sx={{ backgroundColor: "primary.main", borderRadius: "10px", width: "80%", height: "80%", paddingTop: ".8rem", paddingBottom: ".5rem", overflow: "hidden" }}>
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8?autoplay=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </Box> */}
        </Box>
        {/* </Box> */}
      </Container>
      {coursesVdoList.length <= completedEpisode.length?
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
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Button
          sx={{ margin: "2%" }}
          variant="contained"
          onClick={()=>{handleSubmitReview();
          setReview("")}}
          disabled={review?false:true}
        >
          Submit
        </Button>
      </Container>:
      <></>}
      </>
      )}
    </>
  );
};

export default Coursedemo;
