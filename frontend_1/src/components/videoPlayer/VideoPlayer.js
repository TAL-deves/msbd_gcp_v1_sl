import { Box, Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import axios from '../../api/Axios';

import videosample from "./homepagevideo.mp4"

const VIDEOLOG_URL = '/videologdata';

const VideoPlayer = () => {
  const style = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };


  const [played, setPlayed] = useState(0);


  return (
    <Box sx={{
      width:"100vw"
    }}>
    {/* <Grid container sx={style}>
      <Grid xs={12} item>
          <Grid item> */}
          <ReactPlayer
          
            url={videosample}
            controls={true}
          settings={['captions', 'quality', 'speed', 'loop']}
            playing={true}
            onProgress={(progress)=>{
              setPlayed(progress.playedSeconds);
              
            }}
            onPlay={() => {
              //console.log("play data sent");
            //   const response = axios.post(VIDEOLOG_URL,
            //     JSON.stringify({ }),
            //     {
            //         headers: { 'Content-Type': 'application/json' },
            //         'Access-Control-Allow-Credentials': true
            //     }
            // );
            }}
            onPause={() => {
              //console.log("pause data sent");
            //   const response = axios.post(VIDEOLOG_URL,
            //     JSON.stringify({ }),
            //     {
            //         headers: { 'Content-Type': 'application/json' },
            //         'Access-Control-Allow-Credentials': true
            //     }
            // );
            }}
            // onProgress={//console.log("playing")}
          />
          {/* </Grid>
        </Grid>
      </Grid> */}
    </Box>
    // <Box sx={{ flexGrow: 1}}>
    //   <Grid container>
    //     <Grid xs={12} md={12} lg={10} xl={7}  item>
    //       <ReactPlayer
    //         url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
    //         controls={true}
    //         // width={"100vw"}
    //         // height={'auto'}
    //         onPlay={() => {
    //           //console.log("played");
    //         }}
    //         onPause={() => {
    //           //console.log("paused");
    //         }}
    //         onProgress={//console.log("playing")}
    //       />
    //     </Grid>
    //   </Grid>
    // </Box>
  );
};

export default VideoPlayer;
