import React, { useCallback, useEffect, useRef, useState } from "react";
import useVdocipher from "../../hooks/use-vdocipher";
import { dummyAPICall } from "../../utils";
import VideoStatusUsingAPI from "../status";
import "./style.css";
import api from "../../api/Axios";
import { useLocation } from "react-router";
import { Box } from "@mui/system";

const COURSE_URL = "/api/give-a-review";
const VIDEOCIPHER_URL = "/api/playthevideo";
const COURSE_VDO_URL = "/api/course";

export default function Hello({count, setCount, setCourseId,statusChanged, setStatusChanged,totalCoveredStatus,setTotalCoveredStatus,totalVideoDurationStatus,setVideoDurationStatus, otp,videoID, playbackInfo,episode,coursesVdoList,vdotitle, videoRef, videoContainerRef }) {
  const { loadVideo, isAPIReady } = useVdocipher();
  // const videoContainerRef = useRef();
  // const [videoRef, setVideoRef] = useState(null);
  // const [playbackInfo, setPlaybackInfo] = useState("");
  // const [otp, setOtp] = useState("");
  // const [videoID, setVideoID] = useState();
  const [lessonTitle, setLessonTitle] = useState();
  // const [episode, setEpisode] = useState();
  const [videoTitle, setVideoTitle] = useState('');
  // const [coursesVdoList, setCoursesVdoList] = useState([]);

  let location = useLocation();

  let courseData = location.state.courseId;
  let courseID = courseData.courseID;

  // // console.log("coursesVdoList", coursesVdoList)

    // vdo list
    // let courseVideo = async () => {
    //   const response = await api
    //     .post(COURSE_VDO_URL, JSON.stringify({ courseID }), {
    //       headers: { "Content-Type": "application/json" },
    //       "Access-Control-Allow-Credentials": true,
    //     })
    //     .then((data) => {
    //       data.data.data.lessons.map((lesson) => { lesson["isVdoSet"] = false })
    //       setCoursesVdoList(data.data.data.lessons);
    //       setVideoID(data.data.data.lessons[0].videoID)
    //       setEpisode(data.data.data.lessons[0].episode)
    //       setLessonTitle(data.data.data.lessons[0].title)
    //       setVideoTitle(data.data.data.title)
          
    //     });
    // };

    // useEffect(() => {
    //   // fetchVdoCipher();
    //   // removeVideo()
    //   // if(videoRef){
    //   //   removeVideo()
    //   // }
    //   // else{
    //   //   addVideo()
    //   // }
    //   // addVideo()
    //   courseVideo();
    // }, []);
// console.log(episode, "episode")

  // const addVideo = (async () => {
    

  //   videoContainerRef.current.classList.add("haveVideo");
  //   // const { otp, playbackInfo } = await dummyAPICall();
  //   const video = loadVideo({
  //     otp,
  //     playbackInfo,
  //     container: videoContainerRef.current,
  //     configuration: {
  //       noClipstat: true
  //     }
  //   });
  //   setVideoRef(video);
  // });

  // const removeVideo = () => {
  //   videoRef.remove();
  //   setVideoRef(null);
  //   videoContainerRef.current.classList.remove("haveVideo");
  // };

  return (
    // <div className="hello">
    //   <div className="inline">
    //     <div className="message"> </div>
    //     <br />
    //     {/* <button onClick={() => (videoRef ? removeVideo() : addVideo())}>
    //       {videoRef ? "Remove Video" : "Add Video"}
    //     </button> */}
    //   </div>
    <Box>
      <Box  sx={{backgroundColor: "primary.main",
      height: {xs:"15rem",sm:"20rem",md:"20rem", lg:"30rem", xl:"30rem"}}}
      // sx={{
      //         // marginTop: "1rem",
      //         width: "100%",
      //         maxWidth: "800px",
      //         backgroundColor: "primary.main",
      //         height: {xs:"15rem",sm:"20rem",md:"20rem", lg:"30rem", xl:"30rem"},
      //         // padding: "1rem",
      //         // borderRadius: "8px",
      //            position: "relative",
      //         // boxSshadow: "0 2px 20px 7px rgb(0 0 0 / 5%)",
      //          display: "flex",
      //         alignItems: "center",
      //         justifyContent: "center",
      //         color: "other.dark"
      //       }} 
            className="vdo-container" ref={videoContainerRef}></Box>
      <VideoStatusUsingAPI count={count} setCount={setCount} setCourseId={setCourseId} statusChanged={statusChanged} setStatusChanged={setStatusChanged} totalCoveredStatus={totalCoveredStatus}setTotalCoveredStatus={setTotalCoveredStatus}totalVideoDurationStatus={totalVideoDurationStatus}setVideoDurationStatus={setVideoDurationStatus} videoID={videoID} videoTitle={vdotitle} lessonTitle={lessonTitle} courseID={courseID} videoRef={videoRef} isAPIReady={isAPIReady} episode={episode} />
    </Box>
  );
}
