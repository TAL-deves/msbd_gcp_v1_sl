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
import ReactPlayer from "react-player";
import Slider from "react-slick";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'; import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useState } from "react";
;



const Banner = () => {
  const videoRef = React.useRef(null);
  const navigate = useNavigate();
  AOS.init({ duration: 2000 });
  const { t } = React.useContext(globalContext)
  const sliderRef = React.useRef(null);
  const [sliderData, setSliderData] = useState([])
  let username = localStorage.getItem("user")



  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    // <img src={LeftArrow} alt="prevArrow" {...props} />
    <Box >
      <KeyboardDoubleArrowLeftIcon sx={{ color: "primary.main", border: "1px solid black", borderRadius: "50%", fontSize: "1.5rem", "&:hover": { color: "primary.main" } }} {...props} />
    </Box>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (

    // <img src={RightArrow} alt="nextArrow" {...props} />
    <Box sx={{}}>
      <KeyboardDoubleArrowRightIcon sx={{ color: "primary.main", border: "1px solid black", borderRadius: "50%", fontSize: "1.5rem", "&:hover": { color: "primary.main" } }} {...props} />
    </Box>
  );
  const style = {
    height: "17rem",
    width: "100%",
    // height: {xs:320},
    // width: {xs:320},
    borderRadius: "50px",
    marginTop: "1rem",

  };


  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    speed: 500,
    arrows: true,
    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
    // slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,

  };


  let fetchSliderData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/sliderdata`)
      .then((data) => {
        setSliderData(data.data.data)
      })
  };

  React.useEffect(() => {
    fetchSliderData()
  }, [])


  return (
    <Container>

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

            {/* uncomment for animated lottie  */}
            <Grid sx={{
              width: "100%", backgroundColor: "primary.main", marginLeft: "1rem", borderRadius:"10px"
            }}>
              <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", mx:"1rem",  }}>
                <Lottie
                  // animationData={BannerImg}
                  animationData={BannerImg}
                  style={style}
                />
              
              {username?
              <Button
              onClick={()=>{navigate("/userprofile")}}
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
                {t("dashboard")}
                
              </Button>:
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
              </Button>}
              
              </Box>
            </Grid>

            {/* for slider in banner  */}
            {/* <Grid sx={{
              borderRadius: "10px",mt:"2rem", width: "84%", height: "80%",  overflow: "hidden"
            }}>
               <Slider {...settings} >
              {sliderData.map((sliderData) => {
            return (
              <Box key={sliderData._id} sx={{padding:".5rem"}}>
                <img height="100%" width="100%" src={sliderData.imageLink} alt="" />
              </Box>
            );
          })}
              </Slider>
            </Grid> */}

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
              mt: "2rem", 
              paddingLeft: "1rem",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box sx={{ backgroundColor: "primary.main", borderRadius: "10px", width: "100%", height: "80%", paddingTop: ".8rem", paddingBottom: ".5rem", overflow: "hidden" }}>
              {/* <iframe ref={videoRef} width="100%" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8?autoplay=0&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
              <ReactPlayer width='100%'
                height='100%' controls="true" url="https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/misc/Intro%20Final.mp4" />
            </Box>
          </Grid>
        </Grid>
      </Box>
    
    </Container>
  );
};

export default Banner;


