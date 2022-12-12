import { Api } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import "./style.css";
import api from "../../api/Axios";
/**
 * Component consuming the VdocipherAPI
 */
const VIDEO_LOG_DATA_URL = "/api/videologdata";

export default function VideoStatusUsingAPI({ videoID, courseID, videoRef, isAPIReady, videoTitle, lessonTitle, episode }) {
  // const [status, setStatus] = useState("NA");
  let username = localStorage.getItem("user")
  // console.log(username, "username")
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
    await api
      .post(VIDEO_LOG_DATA_URL, JSON.stringify({ courseID, videoID, status, username, actionTime, totalTimeCovered, totalTimePlayed, totalVdoDuration, videoTitle, lessonTitle, episode, currentProgress }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        // console.log("object")

      });
  }
  useEffect(() => {
    console.log("initial", isAPIReady, videoRef, courseID, videoID,status)
    if (!isAPIReady) return;
    if (!videoRef) {
      // @todo detach from the API
      // console.log("No");
      setPlayer(null);
      // window.location.refresh()
      return;
    }
    

    const player = new window.VdoPlayer(videoRef);
    window.player = player;
    setPlayer(player);
    player.video.addEventListener("play", () => {
      console.log("initial", isAPIReady, videoRef, courseID, videoID,status)
      totalVdoDuration=(Math.floor(player.video.duration))
      status = "play";

      actionTime = Math.floor(player.video.currentTime);
      setTest("play")
      console.log(test)
      actionVdoData(courseID, videoID, status, username, actionTime, totalTimeCovered, totalTimePlayed)

    });
    player.video.addEventListener("pause", () => {
      console.log("initial", isAPIReady, videoRef, courseID, videoID,status)
      // totalVdoDuration=(Math.floor(player.video.duration))
      console.log(totalTimeCovered, totalTimePlayed)
      status = "pause";
      actionTime = Math.floor(player.video.currentTime);
      setTest("pase")
      console.log(" pause")
      // console.log(actionTime)
      actionVdoData(courseID, videoID, status, username, actionTime, totalTimeCovered, totalTimePlayed)
    });
    player.video.addEventListener("ended", () => {
       
      status = "ended";
      // alert("ended")
      console.log("ended")
      actionVdoData(courseID, videoID, status, username, currentTime)

    });

    player.video.addEventListener("start", () => {
      // status="ended";
      // alert("ended")
      console.log("start")
      //  actionVdoData(courseID,videoID,status, username,currentTime)

    });
    player.video.addEventListener("canplay", () => {
      
       console.log("can play", Math.floor(player.video.duration)) }

    );
    player.video.addEventListener("timeupdate", () => {
      // console.log("time update")

      player.api.getTotalCovered().then((e) => {
        // console.log("event total time",e)
        // alert(e)
        totalTimeCovered = e;
        // console.log("time covers")
      })
      player.api.getTotalPlayed().then((e) => {
        // console.log("event total played",e)
        // alert(e)
        totalTimePlayed = e
        // console.log("total played")
      })
      setCurrentTime(player.video.currentTime);

    });




    window.player = player;


    console.log(" videoRef   ----- ", videoRef);


  }, [videoRef]);

  const handleForwards = () => {
    player.video.currentTime = player.video.currentTime + 10;
  };

  const handleBackwards = () => {
    player.video.currentTime = player.video.currentTime - 10;
  };
  // console.log({ player });
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
