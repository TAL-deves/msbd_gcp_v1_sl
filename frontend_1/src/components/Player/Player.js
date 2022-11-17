import { Box, Container } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import videosample from "./homepagevideo.mp4";
import { Grid } from "@mui/material";

const ResponsiveStyledPlayer = () => {
  const videoRef = useRef(null);
  useEffect(() => {
    let options = {
      rootMargin: "0px",
      threshold: [0.25, 0.75],
    };

    let handlePlay = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      });
    };
    let observer = new IntersectionObserver(handlePlay, options);

    observer.observe(videoRef.current);
  });

  // const Player = ({ className }) => (
  //   <ReactPlayer
  //     url={videosample}
  //     className={className}
  //     playing={true}
  //     autoplay={true}
  //     width="100%"
  //     height="100%"
  //     controls={false}
  //     muted
  //     loop={true}
  //     ref={videoRef}
  //   />
  // );

  // const AbsolutelyPositionedPlayer = styled(Player)`
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  // `;

  // const RelativePositionWrapper = styled.div`
  //   position: relative;
  //   padding-top: 56.25%;
  // `;

  return (
    <Box>
      <Container>
        <Box 
          // xs={12}
        >
                <iframe ref={videoRef} width="100%" height="450" src="https://www.youtube.com/embed/_B6T8O15Ohk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        {/* <video ref={videoRef} src={videosample} width="100%" loop={true} controls={false} autoPlay={true}></video> */}
        </Box>
      </Container>
    </Box>
  );
};

export default ResponsiveStyledPlayer;
