import React, { useContext } from "react";
import "./Portfolio.css";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Container } from "@mui/system";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { Paper, Typography } from "@mui/material";

import achievement from "../../data/images/A1.png";
import achievement_dark from "../../data/images/A2.png";
import Achievement from "./Achivement/Achievement";

import acvh1 from "./Achivement/images/achv1.png"
import acvh2 from "./Achivement/images/achv2.png"
import acvh3 from "./Achivement/images/achv3.png"
import acvh4 from "./Achivement/images/achv4.png"
import a9 from "./Achivement/images/A9.png"
import a10 from "./Achivement/images/A10.png"
import a11 from "./Achivement/images/A11.png"
import a12 from "./Achivement/images/A12.png"
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';


const Portfolio = () => {
  const {t}= useContext(globalContext)
  AOS.init({duration:2000});
  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Container>
        <Box>
          <Typography
            gutterBottom
            // gutter
            sx={{
              fontSize: "1.8rem",
              color: "primary.main",
              fontWeight: "500",
            }}
          >
            {t("our_achievements")}
          </Typography>
          <Box sx={{ overflow:"hidden"}}>
            <Grid
              container
              // rowSpacing={1}
              // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{
                // display: {md:"flex",lg:"flex", sm:"flex"},
                  // flexDirection:{md:"row",lg:"row", sm:"row" },
                justifyContent:"center"
              }}
            >
              <Grid
                item
                xs={6}
                sx={{
                  display: {md:"flex",lg:"flex", sm:"flex" ,xs:"none"},
                  justifyContent: "space-around",
                 
                  }}
                 data-aos="fade-right"  
              >
                {localStorage.getItem("theme")==="theme"?
                <img
                src={achievement_dark}
                alt="acievement"
                loading="lazy"
                width="60%"
                style={{
                  objectFit:"contain"
                }}
              />:
              <img
                  src={achievement}
                  alt="acievement"
                  loading="lazy"
                  width="60%"
                  style={{
                    objectFit:"contain"
                  }}
                />
              }


                
                {/* <Typography></Typography> */}
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12} sx={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                
              }} 
               data-aos="fade-left"
              >
                <Grid >
                  {/* <Grid item > */}
                  <Achievement picture={a10} count={"120"} text={t("teachers")}/>
                  {/* </Grid> */}
                  {/* <Grid item> */}
                  <Achievement picture={a9} count={"3K"} text={t("videos")}/>
                  {/* </Grid> */}
                </Grid>
                <Grid >
                  {/* <Grid item> */}
                  <Achievement picture={a11} count={"300"} text={t("users")}/>
                  {/* </Grid> */}
                  {/* <Grid item> */}
                  <Achievement picture={a12} count={"2.5K"} text={t("subscribers")}/>
                  {/* </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Portfolio;
