import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Paper, Typography } from '@mui/material';
import googlebtn from "../downloadApp/playstore.png"
import applebtn from "../downloadApp/applestore.png";
import facebook_yellow from "../downloadApp/facebook_yellow.json";
import yellow_youtube from "../downloadApp/yellow_youtube.json";
import yellow_insta from "../downloadApp/yellow_insta.json";
import yellow_twitter from "../downloadApp/yellow_twitter.json";

import Ms_logo from "../navbar/Ms_logo.svg";

import Lottie from "lottie-react";
import swal from 'sweetalert';
import {Link as Routerlink} from "react-router-dom";
import SSLweb from './SSLweb.webp';
import SSLmobile from './SSLmobile.webp'
import { StayPrimaryLandscape } from '@mui/icons-material';
import "./Wavefooter.css"

export default function Wavefooter() {
  let user= localStorage.getItem('user');
  const style = {
    height: 50,
    width: 50,
    borderRadius: "50px",
    margin:"5px",
   
  };

  return (
    <Paper sx={{
      marginTop: '4rem',
      width: '100%',
      bottom: 0,
      position:"static"

    }} component="footer" >
      
      <Box
        px={{ xs: 3, sm: 10 }}
        py={{ xs: 1, sm: 1 }}
        pt={{xs:1, sm:5}}
        sx={{
          backgroundColor: "other.footercolor",
          animation: "wave",
          color: "other.white"
        }}
      >
        <Container >
          <Grid  sx={{display:"flex",flexDirection:{xs:"column",sm:"column", md:"column", lg:"row",xl:"row"}, justifyContent:"space-between"}}>
            <Grid item xs={12} sm={3} md={4} xl={3}
            >
              <Box sx={{
                display: "flex", flexDirection: "column",
                padding: "2rem", alignItems: "center"
              }}>
                <Typography variant='h5' sx={{
                  color: "other.white"
                }}>Reach Us</Typography>
                
            
                <Box sx={{ display: "flex" , alignItems:"center"}}>
                <Link href='https://twitter.com/MindSchoolBd' target="_blank">
                      <Lottie
          animationData={yellow_twitter}
          style={style}
          
        />
                </Link>
                <Link href='https://www.youtube.com/@mindschoolbd' target="_blank">
                  <Lottie
          animationData={yellow_youtube}
          style={style}          
        />
                </Link>
                <Link href='https://www.facebook.com/mindschoolbd/' target="_blank">
                  
                  <Lottie
          animationData={facebook_yellow}
          style={style}          
        />
                </Link>
                <Link href='https://www.instagram.com/mindschoolbd/' target="_blank">
                  
                  <Lottie
          animationData={yellow_insta}
          style={style}          
        />
                </Link>
              </Box>
                
              </Box>
            </Grid>
            {/* <Grid item xs={12} sm={3} md={4} xl={3} sx={{display:"flex", justifyContent:"space-between"}}> */}
            <Grid  sx={{
              color: "other.white"
            }}>
              
              <Box sx={{borderBottom:1,borderColor:"other.logocolor",color:"other.logocolor", fontWeight:"800",marginBottom:".5rem"}} >Quick Links</Box>
              <Box>
                <Routerlink to="/about" style={{ textDecoration: "none" }} color="inherit">
                <Typography sx={{color:"other.white"}} display="inline">
                  About Us</Typography>
                </Routerlink>
              </Box>
              {user?
              <>
              <Box>
                
              <Routerlink style={{textDecoration:"none"}} to="/"  >
                <Typography sx={{color:"other.white"}} display="inline">Login</Typography>
                
              </Routerlink>
            </Box>
            <Box>
              <Routerlink to="/" style={{ textDecoration: "none" }} >
              <Typography sx={{color:"other.white"}} display="inline">Signup</Typography>
              </Routerlink>
            </Box></>
            :
              <>
              <Box>
                
                <Routerlink style={{textDecoration:"none"}} to="/login"  >
                  <Typography sx={{color:"other.white"}} display="inline">Login</Typography>
                  
                </Routerlink>
              </Box>
              <Box>
                <Routerlink to="/registration" style={{ textDecoration: "none" }} >
                <Typography sx={{color:"other.white"}} display="inline">Signup</Typography>
                </Routerlink>
              </Box></>}
              <Box>
                <Routerlink to="/courses" style={{ textDecoration: "none" }} >
                <Typography sx={{color:"other.white"}} display="inline">Courses</Typography>
                </Routerlink>
              </Box>
              <Box>
                <Routerlink to="/verify-certificate" style={{ textDecoration: "none" }} >
                <Typography sx={{color:"other.white"}} display="inline">Verify Certificate</Typography>
                </Routerlink>
              </Box>
              {/* <Box>
                <Routerlink to="/store" style={{ textDecoration: "none" }} color="inherit">
                <Typography sx={{color:"other.white"}} display="inline">Store</Typography>
                </Routerlink>
              </Box> */}
            </Grid>
            <Grid sx={{ textDecoration: "none" }} >
              <Box  sx={{borderBottom:1,borderColor:"other.logocolor",color:"other.logocolor", fontWeight:"800", marginBottom:".5rem"}}>Terms</Box>
              
              <Box>
                <Routerlink to="/privacy-policy" style={{ textDecoration: "none" }} >
                <Typography sx={{color:"other.white"}} display="inline">Privacy Policy</Typography>
                </Routerlink>
              </Box>
              <Box>
                <Routerlink to="/refund-policy" style={{ textDecoration: "none" }} color="inherit">
                <Typography sx={{color:"other.white"}} display="inline">Refund Policy</Typography>
                </Routerlink>
              </Box>
              <Box>
                <Routerlink to="/terms-and-conditions" style={{ textDecoration: "none" }} color="inherit">
                <Typography sx={{color:"other.white"}} display="inline">Terms & Conditions</Typography>
                </Routerlink>
              </Box>
            </Grid>
            {/* </Grid> */}
            <Grid item xs={12} sm={3} md={4} xl={3} sx={{marginTop:{xs:"1rem",sm:"1rem", md:"1rem", lg:"0rem", xl:"0rem"},
              textDecoration: "none", display: "flex",
              flexDirection: "column", alignItems: "center"
            }} >

              <Box sx={{
                display: { xs: "flex" }
              }}>
                <img src={Ms_logo} alt="logo"
                  width="50" />
              </Box>
              <Typography
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 0,
                  display: { xs: "flex" },
                  fontSize: "2rem",
                  flexGrow: 1,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {/* //!  This is mobile view */}
                <Typography

                  variant='h5'
                >
                  Mind School
                </Typography>
              </Typography>
              <Typography>
                Download Our Mobile App
              </Typography>
              {/* app */}
              <Box sx={{ display: "flex", alignItems:"center" }}>
                <Link href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school" target="new">
                  <Box 
                  // onClick={()=>{swal("","App Coming Soon","");}}
                    sx={{
                      // backgroundColor: "other.logocolor",
                      backgroundColor: "secondary.main",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "10px",
                      margin: "2%"
                    }}
                  >
                    <img src={googlebtn} alt="google" width="98vw" />
                  </Box>
                </Link>
                {/* <Link href="https://techanalyticaltd.com/" target="new"> */}
                  <Box onClick={()=>
                  // {swal("iOS App Coming Soon","Thank You","");}
                  {swal("iOS App Coming Soon","Thank You","");}
                  
                }
                    sx={{
                      // backgroundColor: "other.footercolor",
                      backgroundColor: "secondary.main",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "10px",
                      margin: "2%"
                    }}
                  >
                    <img src={applebtn} alt="google" width="90vw" />
                  </Box>
                {/* </Link> */}
              </Box>

            </Grid>
          </Grid>
          <Box
            pt={{ xs: 1, sm: 5 }}
            pb={{ xs: 5, sm: 0 }}
            sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
            <Box>Powered By <Link sx={{ textDecoration: "none", color: "other.white",  }} href="https://techanalyticaltd.com/" target="new"><u>Tech Analytica Limited</u></Link> &reg; {new Date().getFullYear()} || Version 1.0</Box>
            {/* <img src={SSLCommerz} alt=''/> */}

          </Box>

          <Grid sx={{ textAlign: "center" }}
            >
            <Grid sx={{ display: { xs: "none", md: "none", lg: "block", xl: "block"} , marginTop:"2rem" }}>
              <img width={1000} src={SSLweb} alt='' />

            </Grid>
            <Grid sx={{ display: { xs: "block", md: "block", lg: "none", xl: "none" }, marginTop:"0rem" }}>
              <img width={140} src={SSLmobile} />

            </Grid>

          </Grid>
          {/* <Box sx={{height:"100px"}} >
        <img src={instructorImage} alt=''/>
        </Box> */}
        </Container>

      </Box>
      {/* </footer> */}
    </Paper>
  );
}