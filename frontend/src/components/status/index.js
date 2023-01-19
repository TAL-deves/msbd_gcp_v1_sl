import { Api } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import "./style.css";
import api from "../../api/Axios";
import swal from "sweetalert";
/**
 * Component consuming the VdocipherAPI
 */
const VIDEO_LOG_DATA_URL = "/api/videologdata";

export default function VideoStatusUsingAPI({count, setCount, statusChanged,setCourseId, setStatusChanged, totalCoveredStatus,setTotalCoveredStatus,totalVideoDurationStatus,setVideoDurationStatus,videoID, courseID, videoRef, isAPIReady, videoTitle, lessonTitle, episode }) {
  // const [status, setStatus] = useState("NA");
 
  let username = localStorage.getItem("user")
  // // console.log(username, "username")
  const [player, setPlayer] = useState(null);
  const [test, setTest] = useState("")
  const [currentTime, setCurrentTime] = useState(0);
  // const [totalVdoDuration, setTotalVdoDuration] = useState(0);
  // const [totalTimeCovered, setTotalTimeCovered]=useState(0)
  // const [totalTimePlayed, setTotalTimePlayed]=useState(0)

  let status;
  let actionTime;
  // let action;
  let totalTimeCovered = 0;
  let totalTimePlayed = 0;
  let totalVdoDuration=0;
  let actionVdoData = async (courseID, videoID, status, username) => {
     let currentProgress =actionTime
    //  console.log("episode ------",episode)
    await api
      .post(VIDEO_LOG_DATA_URL, JSON.stringify({ courseID, videoID, status, username, actionTime, totalTimeCovered, totalTimePlayed, totalVdoDuration, videoTitle, lessonTitle, episode, currentProgress }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        
      if (data.data.result.status === 401 || data.data.result.status === 400 || data.data.result.status === 404) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
  
        swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
      }
      });


  }

  // console.log(courseID, "status course")
 
  useEffect(() => {
    // console.log("initial", isAPIReady, videoRef, courseID, videoID,status)
    if (!isAPIReady) return;
    if (!videoRef) {
      // @todo detach from the API
      // // console.log("No");
      setPlayer(null);
      // window.location.refresh()
      
      return;
    }
    
    

    const player = new window.VdoPlayer(videoRef);
    window.player = player;
    setPlayer(player);
    
    player.video.addEventListener("play", () => {
      // console.log("initial", isAPIReady, videoRef, courseID, videoID,status)
      totalVdoDuration=(Math.floor(player.video.duration))
      status = "play";

      actionTime = Math.floor(player.video.currentTime);
      setTest("play")
      setCourseId(courseID)
      // setCount(!count)
      // console.log(totalVdoDuration)
      
      actionVdoData(courseID, videoID, status, username, actionTime, totalTimeCovered, totalTimePlayed)
      setCount((count)=>!count)
    });
    player.video.addEventListener("pause", () => {
      // console.log("initial", isAPIReady, videoRef, courseID, videoID,status)
      // totalVdoDuration=(Math.floor(player.video.duration))
      // console.log(totalTimeCovered, totalTimePlayed)
      status = "pause";
      actionTime = Math.floor(player.video.currentTime);
      setCount((count)=>!count)
      actionVdoData(courseID, videoID, status, username, actionTime, totalTimeCovered, totalTimePlayed)
    });
    player.video.addEventListener("ended", (e) => {
      //  e.preventDefault();
      status = "ended";
      setCount((count)=>!count)
      if(episode===""){
        // window.location.reload();
         console.log(episode)
        // <></>
      }
      else{
        actionVdoData(courseID, videoID, status, username, currentTime)
        if(totalTimeCovered===totalVdoDuration){
          setStatusChanged(true)
          setCount((count)=>!count)
          // console.log(totalTimeCovered,
          // totalVdoDuration, statusChanged)
          window.location.reload();
        }
      }
      

    });

    player.video.addEventListener("start", () => {
      // status="ended";
      // alert("ended")
      // console.log("start")
      //  actionVdoData(courseID,videoID,status, username,currentTime)
      setCount((count)=>!count)
    });
    player.video.addEventListener("canplay", () => {

      setCount((count)=>!count)
      //setCount(count++)
       // console.log("can play", Math.floor(player.video.duration)) 
      }
       
    );
    player.video.addEventListener("timeupdate", () => {
      // // console.log("time update")

      player.api.getTotalCovered().then((e) => {
        // // console.log("event total time",e)
        // alert(e)
        totalTimeCovered = e;
        // // console.log("time covers")
      })
      player.api.getTotalPlayed().then((e) => {
        // // console.log("event total played",e)
        // alert(e)
        totalTimePlayed = e
        // // console.log("total played")
      })
      setCurrentTime(player.video.currentTime);
      
    });




    window.player = player;


    // console.log(" videoRef   ----- ", videoRef);


  }, [videoRef]);

  const handleForwards = () => {
    player.video.currentTime = player.video.currentTime + 10;
  };

  const handleBackwards = () => {
    player.video.currentTime = player.video.currentTime - 10;
  };
  // // console.log({ player });
  return player && player.video ? (
    <div className="api-controls inline">
      {/* <div>Controls via API</div>
      <div className="btn" onClick={handleBackwards}>
        -10
      </div>
      <div>Status: {status}</div>
      <div>CurrentTime: {currentTime}</div>
      <div className="btn" onClick={handleForwards}>
        +10
      </div> */}
    </div>
  ) : null;
}
