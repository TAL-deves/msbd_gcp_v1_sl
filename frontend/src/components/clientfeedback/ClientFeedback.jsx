import {
 
  Container,
  Typography,
} from "@mui/material";
import React, { useContext,  useState } from "react";
import { clientData } from "../../data/clientData";
import Slider from "react-slick";
import { Box } from "@mui/system";

import { useRef } from "react";
import ClientCard from "./ClientCard/ClientCard";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const ClientFeedback = () => {
  AOS.init({duration:1000});
  const {t}= useContext(globalContext)
  const sliderRef = useRef(null);
  
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <KeyboardDoubleArrowLeftIcon sx={{color:"primary.main",border:"1px solid black",borderRadius:"50%",fontSize:"1.5rem", "&:hover":{color:"primary.main"}}} {...props}/>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <KeyboardDoubleArrowRightIcon sx={{color:"primary.main",border:"1px solid black",borderRadius:"50%",fontSize:"1.5rem", "&:hover":{color:"primary.main"}}} {...props}/>
  );

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
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,

    // centerMode: true, // enable center mode
    // centerPadding: '50px', // set center padding
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [clientState, setclientState] = useState(clientData);

  return (
    <Box
      sx={{
        mt: 5,
        mb: 5,
        
      }}
    >
      <Container >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb:2,

          }}
          
        >
          <Typography
            gutterBottom
            // gutter
            sx={{
              fontSize: "1.8rem",
              color: "primary.main",
              fontWeight: "500",
            }}
          >
            {t("why_love_mindschool")}
          </Typography>

        </Box>
        <Container >
        <Slider {...settings} ref={sliderRef}>
          {clientState.map((obj) => {
            return (
              <div key={obj.id}>
                <ClientCard 
                  name={obj.name}
                  designation={obj.designation}
                  org={obj.org}
                  img={obj.image}
                  feedback={obj.feedback}
                />
              </div>
            );
          })}
        </Slider>
        </Container>
      </Container>
    </Box>
  );
};

export default ClientFeedback;
