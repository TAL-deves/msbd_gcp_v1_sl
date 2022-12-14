import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Lottie from "lottie-react";
import BannerImg from "./web intro 2.json";
import { useNavigate } from "react-router-dom";
import api from "../../api/Axios"
import swal from 'sweetalert'

let CHECK_DEVICE_URL= "/api/checkdeviceanduser"

const Banner = () => {
  const videoRef = React.useRef(null);
  const navigate = useNavigate();
  AOS.init({ duration: 2000 });
  const { t } = React.useContext(globalContext)
  const [ isAndroid,setIsAndroid]= React.useState()


  let username = localStorage.getItem("user")

  let fetchDeviceData = async () => {
    await api
    .post(CHECK_DEVICE_URL, JSON.stringify({ username }), {
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Credentials": true,
    })
    .then((data) => {
    setIsAndroid(data.data.data.data.platform)
    });
};

React.useEffect(()=>{
  fetchDeviceData()
},[])

  const style = {
    height:"17rem",
    width: "100%",
    // height: {xs:320},
    // width: {xs:320},
    borderRadius: "50px",
    marginTop: "1rem",

  };

  return (
    <Container>
        {isAndroid==="Android" || isAndroid==="Linux" ? 
      <Box data-aos="fade-right" onLoad={()=>{
        swal({ title: "WELCOME!",
 text: "Download our Mind School app for better experience!",
 icon: "info",
buttons:[true, "Download"]}).then(okay => {
   if (okay) {    
    window.location.href = "https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school&pli=1";
  }
});
      }}
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
            sm={8}
            md={6}
            lg={6}
            xl={6}
            sx={{
              // height: "30vh",
              mt: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Grid sx={{
                width: "100%",backgroundColor:"primary.main",marginLeft: "1rem"
              }}>
                <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", mx:"1rem",  }}>
                  <Lottie
                    animationData={BannerImg}
                    style={style}
                  />
                
                <Button
                onClick={()=>{navigate("/registration")}}
                  sx={{
                    // top: "30%",
                    // left: "20%",
                    mb:".5rem",
                    mt:".5rem",
                    // height: "2.5rem",
                    backgroundColor: "secondary.main",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "secondary.main"
                    }
                  }}  
                  size="large" 
                  variant="contained">
                  {t("sign_up_now")}
                </Button>
                
                </Box>
            </Grid>

          </Grid>
          {/* </Grid> */}
          <Grid

            xs={12}
            sm={8}
            md={6}
            lg={6}
            xl={6}
            sx={{
              // backgroundImage: `url(${bannerimage})`,
              // height: "30vh",
              mt: "2rem", paddingLeft: "1rem",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box sx={{ backgroundColor: "primary.main", borderRadius: "10px", width: "100%", height: "80%", paddingTop: ".8rem", paddingBottom: ".5rem", overflow: "hidden" }}>
              <iframe ref={videoRef} width="100%" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8?autoplay=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </Box>
          </Grid>
        </Grid>
      </Box>:
      <Box data-aos="fade-right" 
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
          sm={8}
          md={6}
          lg={6}
          xl={6}
          sx={{
            // height: "30vh",
            mt: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Grid sx={{
              width: "100%",backgroundColor:"primary.main",marginLeft: "1rem"
            }}>
              <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", mx:"1rem",  }}>
                <Lottie
                  animationData={BannerImg}
                  style={style}
                />
              
              <Button
              onClick={()=>{navigate("/registration")}}
                sx={{
                  // top: "30%",
                  // left: "20%",
                  mb:".5rem",
                  mt:".5rem",
                  // height: "2.5rem",
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "secondary.main"
                  }
                }}  
                size="large" 
                variant="contained">
                {t("sign_up_now")}
              </Button>
              
              </Box>
          </Grid>

        </Grid>
        {/* </Grid> */}
        <Grid

          xs={12}
          sm={8}
          md={6}
          lg={6}
          xl={6}
          sx={{
            // backgroundImage: `url(${bannerimage})`,
            // height: "30vh",
            mt: "2rem", paddingLeft: "1rem",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ backgroundColor: "primary.main", borderRadius: "10px", width: "100%", height: "80%", paddingTop: ".8rem", paddingBottom: ".5rem", overflow: "hidden" }}>
            <iframe ref={videoRef} width="100%" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8?autoplay=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </Box>
        </Grid>
      </Grid>
    </Box>
      }
    </Container>
  );
};

export default Banner;
