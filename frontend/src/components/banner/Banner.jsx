import * as React from "react";
// import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
// import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import msbdcloud from "../downloadApp/Mind School.png"
// import './Banner.css';
import { Container, Paper, Stack } from "@mui/material";
import bannerimage from "./bannersample.gif";
import { multiForgotContext } from "../../pages/ForgotContext";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Banner = () => {
  const videoRef = React.useRef(null);
  AOS.init({duration:2000});
   const {t}= React.useContext(globalContext)

  return (
    <Container>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Grid container spacing={2} sx={{
                
              
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
              
              }}>
          {/* <Grid xs={4}> */}
            <Grid
              xs={12}
              md={10}
              lg={7}
              xl={5}
              sx={{
                // height: "30vh",
                mt:"2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
              // data-aos="fade-right"
            >
              <Grid >
                {/* <Typography
                  variant="h6"
                  sx={{ color: "primary.main", fontSize: "2.5rem" }}
                >
                  Mind School 
                </Typography>
                <Typography
                  sx={{
                    color: "other.black",
                    fontSize: "1.3rem",
                    lineHeight: "2rem",
                  }}
                >
                 
                  A powerful platform where you learn how to live a satisfying, miraculous and blissful life
                </Typography> */}


                <Box>
                  <img width={400} src={msbdcloud} alt="" />
                </Box>
              </Grid>
              <Grid sx={{
                mt:0
              }}>
                <Button href="/registration" size="large" variant="contained">
                  {t("sign_up_now")}
                </Button>
              </Grid>
            </Grid>
          {/* </Grid> */}
          <Grid
            // xs={12}
            // md={10}
            lg={4}
            xl={6}
            sx={{
              // backgroundImage: `url(${bannerimage})`,
              // height: "30vh",
              mt:"2rem",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box sx={{backgroundColor:"primary.main", borderRadius:"10px", paddingTop:".8rem", paddingBottom:".5rem", overflow:"hidden"}}>
            <iframe ref={videoRef} width="560" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8?autoplay=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Banner;
