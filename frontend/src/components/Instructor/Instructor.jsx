
import {
  
  CircularProgress,
  Container,
  
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Box } from "@mui/system";
import InstructorCard from "../InstructorCard/InstructorCard";
import api from '../../api/Axios'
import { useRef } from "react";
import { globalContext } from "../../pages/GlobalContext";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'; import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
const Instructor = () => {
  const { t, language } = useContext(globalContext)
  const sliderRef = useRef(null);

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <KeyboardDoubleArrowLeftIcon sx={{ color: "primary.main", border: "1px solid black", borderRadius: "50%", fontSize: "1.5rem", "&:hover": { color: "primary.main" } }} {...props} />
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <KeyboardDoubleArrowRightIcon sx={{ color: "primary.main", border: "1px solid black", borderRadius: "50%", fontSize: "1.5rem", "&:hover": { color: "primary.main" } }} {...props} />
  );
  var settings = {
    arrows: true,

    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 2,
    // centerMode: true, // enable center mode
    // centerPadding: '50px', // set center padding
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const [instructorState, setInstructorState] = useState([]);
  const [load, setLoad] = useState(true);

  let fetchData = async () => {
    await api.post(`${process.env.REACT_APP_API_URL}/api/allinstructors`)
      // .then((res) => res.json())
      .then((data) => {
        let listOfInstructor;
        if(localStorage.getItem("language")==="bn"){
          listOfInstructor = data.data.data.en;
        }
        else{
          listOfInstructor = data.data.data.bn;
          //// console.log("coursesen",listOfInstructor)
        }
        // let localInstructor = JSON.parse(localStorage.getItem("courselist"));
        
        setInstructorState(listOfInstructor)
        setLoad(false);
      });
  };
  //// console.log("instructor data",instructorState)
  useEffect(() => {
    fetchData();
  }, [language]);




  return (<Box
    sx={{

    }}
  >
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "2rem"

        }}
      >
        <Typography gutterBottom
          // gutter
          sx={{
            fontSize: "1.8rem",
            color: "primary.main",
            fontWeight: "500"
          }}>
          {t("meet_our_instructors")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Link to={"/instructor-details"} style={{textDecoration:"none"}}>
              <Typography
                mr={2}
                sx={{
                  color: "primary.main",
                }}
              >
                See All{" "}
              </Typography>
            </Link> */}

          {/* <ArrowBackIosNewIcon
              onClick={() => {
                sliderRef.current.slickPrev();
                //// console.log(sliderRef.current);
              }}
              sx={{
                fontSize: "2rem",
                marginRight: "10px",
                cursor:"pointer",
                bgcolor:"secondary.main",
                borderRadius:"50%",
                color:"other.white",
                padding:"5px"
              }}
            /> */}
          {/* <ArrowForwardIosIcon
              // color="#fff"
              onClick={() => {
                sliderRef.current.slickNext();
                // //// console.log(sliderRef.current);
              }}
              sx={{
                fontSize: "2rem",
                cursor:"pointer",
                bgcolor:"secondary.main",
                borderRadius:"50%",
                color:"other.white",
                padding:"5px"
              }}
            /> */}
        </Box>
      </Box>
      {load ? (
        <Container sx={{

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop:"5rem"
        }}>
          <CircularProgress sx={{
          color: "primary.main"
        }} />
        </Container>
      ) : (
        <Container>
          <Slider {...settings} ref={sliderRef}>
            {instructorState.map((obj) => {
              return (
                <Box key={obj._id} sx={{ padding: ".5rem" }}>
                  <InstructorCard
                    title={obj.name}
                    instructor={obj.designation}
                    img={obj.image}
                    fullObject={obj}
                  ></InstructorCard>
                  {/* <h1>{obj.name}</h1> */}
                </Box>
              );
            })}
          </Slider>
        </Container>)}

    </Container>
  </Box>
  );
};

export default Instructor;
