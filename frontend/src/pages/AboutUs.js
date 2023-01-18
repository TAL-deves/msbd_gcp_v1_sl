import { Grid, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import React, { useContext, useEffect } from 'react';
// import vdoimage from '../components/downloadApp/Y tr.jpg';
import instructorData from '../data/instructorData';
import Modal from '@mui/material/Modal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { globalContext } from './GlobalContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
//   width: "50%",
  width:{xs:"100%",sm:"80%", md:"70%", lg:"50%", xl:"50%"}, height:"315",
  bgcolor: 'background.paper',
  border: '1px solid white',
  borderRadius:"10px",
  boxShadow: 24,
  p: 4,
};

const AboutUs = () => {
  const {  t } = useContext(globalContext);
  AOS.init({duration:2000});
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [teamMembers, setTeamMembers]=React.useState([
  {name:"Alim Al Razi", position:"Managing Director",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/alim.webp"},
  {name:"Mostafizur Rahman", position:"Chairman",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/mostafizurRahman.webp"},
  {name:"Shafayet Jefreey Al Mehdi", position:"CEO and Director",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/mehdi.webp"},
  {name:"Moin Mostakim", position:"CTO and Director",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/moin.webp"}])
  

    return (
       <Box>
        {/* <Container> */}
          <Box >
            {/* <Container >
              <Grid sx={{display:"flex",justifyContent:"flex-start",flexDirection:{xs:"column", sm:"column",md:"row", lg:"row", xl:"row"},align:"center", p:"2rem", alignItems:"center"}}>
            <Grid xs="6"
             data-aos="fade-right"
             sx={{display:"flex",justifyContent:"flex-start",width:{xs:"100%", sm:"100%", md:"100%", lg:"60%", xl:"60%"}, flexDirection:"column", alignItems:"center"}}>
                <Typography sx={{fontSize:"2rem", fontWeight:"800", color:"primary.main"}}>
                Mind <span style={{color:"#f8b100"}}>School</span>
                </Typography>
                <Box sx={{width:"70%"}}>
                <Typography sx={{fontSize:"1.3rem", fontWeight:"500", color:"primary.main"}}>
                A <span style={{color:"#f8b100", fontWeight:"800"}}>powerful </span><span style={{ fontWeight:"800"}}>platform</span> where you learn how to live a satisfying, miraculous and blissful life
                </Typography>              
            </Box>               
            </Grid>
            <Grid xs="6"
              data-aos="fade-left"
             >        
            <img onClick={handleOpen} overflow="hidden" width="100%" height="200" src="https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/thumbnail/introThumbnail.webp" alt='' />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
          
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </Box>
            </Modal>
            </Grid>
            </Grid>
            </Container> */}




<Container>
        
        <Grid sx={{p:"2rem", alignItems:"center"}} container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Box
              data-aos="fade-right"
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                // width: {
                //   xs: "100vw",
                //   sm: "100vw",
                //   md: "100vw",
                //   lg: "60vw",
                //   xl: "60vw",
                // },
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "primary.main",
                }}
              >
                {t("mind")} <span style={{ color: "#f8b100" }}>{t("school")}</span>
              </Typography>
              <Box sx={{ width: "70%" }}>
                <Typography
                  sx={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    color: "primary.main",
                  }}
                >
                  {t("a")}{" "}
                  <span style={{ color: "#f8b100", fontWeight: "800" }}>
                    {t("powerful")}{" "}
                  </span>
                  <span style={{ fontWeight: "800" }}>{t("platform")}</span> {t("about_us_intro")}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Box data-aos="fade-left">
              <img
                onClick={handleOpen}
                overflow="hidden"
                width="100%"
                
                src="https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/thumbnail/introThumbnail.webp"
                alt=""
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/XP6BvzptxR8"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </Box>
              </Modal>
            </Box>
          </Grid>
        </Grid>
        </Container>
          </Box>

          <Box>
          <Container>
            <Box sx={{ m: "3rem", textAlign:"justify" }}>
            <Typography 
            data-aos="fade-right"
             sx={{fontSize:"2rem", fontWeight:"800",textAlign:"center"}}>
            {t("about_us")}
            </Typography>
            <Typography data-aos="fade-left">
            {/* A healthy mind is the mantra of a healthy life, healthy physic, and healthy relationship. Mental Health is at top concerns in present era and improving the quality of our life experience is pre-eminent. Mind School is the platform where we aim to teach and train people how to develop your relationship, health, career, mindset and mental wellbeing by illuminating on your own inner intellectual strength and capacity. Here you can learn the prime lessons of your life that matters the most. */}
            {t("about_us1")}
            </Typography>
            <Typography data-aos="fade-right" sx={{mt:"1rem"}}>
            {/* We desire to bring joy, love and fulfilment in people’s life by sharing this unique gift brought forward by our incredibly talented mind trainers. With the ease of access to internet and technological enhancement, backed by cutting edge IT solutions, we present contents and courses through this powerful platform that can transform you radically. We welcome you to grab this life changing opportunity and surround yourself with positive affirmation. */}
            {t("about_us2")}
            </Typography>
            </Box>
            
              {/* <Box  sx={{display:"flex", flexDirection:"row",
          }}> */}
          <Grid sx={{
            display: "flex",
            flexDirection: { sm: "column-reverse", lg: "row",xl:"row",md:"row", xs: "column-reverse" }
          }}>
            <Grid 
              container
              // columns={{ xs: 10, sm: 10, md: 10, lg: 10 }}
              xs={12}
              // lg={8}
              justifyContent="center"
            >

            
            {
                    teamMembers.map(member=>
                    <Box data-aos="flip-right" key={member.name} sx={{width: {xs:"70%", sm:"30%", md:"20%", lg:"20%", xl:"20%"}, boxShadow:"5",borderRadius:"10px",display:"flex",
                    flexDirection:"column", justifyContent:"center", alignItems:"center", margin:"1rem", py:"1rem"}}>  
                        <Box>  
                        <img width={100} src={member.image} alt={member.name} />
                        </Box>                
                    <Typography>
                       {member.name}                      
                    </Typography>
                    <Typography>
                       {member.position}                      
                    </Typography>
                    <Typography>
                       Tech Analytica Limited                      
                    </Typography>
                    </Box>
                    )
                }
                </Grid>
            </Grid> 
            {/* </Box> */}
             <Box sx={{mt:"2rem",display:"flex",flexDirection:{xs:"column",sm:"row", md:"row", lg:"row", xl:"row"}, justifyContent:"space-between"}}>
              <Box>
                <Typography sx={{fontSize:"1rem", fontWeight:"800"}}>Registered Office:</Typography>
                <Typography >Progress Tower (4th Floor)</Typography>
                <Typography >House 1, Road 23, Gulshan 1,</Typography>
                <Typography >Dhaka 1212, Bangladesh.</Typography>
                <Typography >Tel: +8802 48811161, 48811162</Typography>               
              </Box>
              <Box>
                  <Typography><span style={{fontWeight:"800"}}>Trade Licence:</span> TRAD/DNCC/004240/2022</Typography>
                  <Typography><span style={{fontWeight:"800"}}>TIN:</span> 244985243524</Typography>
              </Box>
             </Box>
            
        </Container>
          </Box>
        {/* </Container> */}
       </Box>
    );
};

export default AboutUs;