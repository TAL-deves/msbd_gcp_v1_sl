import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";

import CourseCard from "../CourseCard/CourseCard";
import Slider from "react-slick";
import api from "../../api/Axios";
import { useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const HomeCourses = () => {
  const { language } = useContext(globalContext);
  AOS.init({duration:2000});
  const {t}= useContext(globalContext)
  const sliderRef = useRef(null);


  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    // <img src={LeftArrow} alt="prevArrow" {...props} />
    <Box >
    <KeyboardDoubleArrowLeftIcon sx={{color:"primary.main",border:"1px solid black",borderRadius:"50%",fontSize:"1.5rem", "&:hover":{color:"primary.main"}}} {...props}/>
    </Box>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    
    // <img src={RightArrow} alt="nextArrow" {...props} />
    <Box sx={{}}>
    <KeyboardDoubleArrowRightIcon sx={{color:"primary.main",border:"1px solid black",borderRadius:"50%",fontSize:"1.5rem", "&:hover":{color:"primary.main"}}} {...props}/>
    </Box>
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
    initialSlide: 0,

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
          slidesToShow: 2,
          slidesToScroll: 2,
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
  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);

  // let fetchData = async () => {
  //   await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
  //     .then((data) => {
  //       setCourses(data.data.data.coursesData)
  //       //// console.log(data)
  //       setLoad(false);
  //     });
  // }; 
  let fetchData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
      // .then((res) => res.json())
      .then((data) => {
        // //// console.log(" THis is the data -----  "+data.data.data.coursesData);
        // let listOfCourse = data.data.data.coursesData;
        // let localCourseList = JSON.parse(localStorage.getItem("courselist"));
        //// console.log(localCourseList);

        let listOfCourse;
        if(localStorage.getItem("language")==="bn"){
           listOfCourse = data.data.data.coursesData.en;
           //// console.log("coursesbn",listOfCourse)

        }
        else{
          listOfCourse = data.data.data.coursesData.bn;
          //// console.log("coursesen",listOfCourse)
        }
        let localCourseList = JSON.parse(localStorage.getItem("courselist"));
        
        listOfCourse.map((course) => {
          if (localCourseList !== null) {
            let localCourse = localCourseList.find(obj => obj.courseID === course.courseID)
            //// console.log(localCourse.courseID,course.courseID)
            course["isSelected"] = localCourse !== null ? localCourse["isSelected"] : true;
             
          } 
          else{
            course["isSelected"] =true
          }
        })
        setCourses(listOfCourse)
        setLoad(false);
        //// console.log((courses))
      });
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  let updateCourse = (course, isSelected) => {
    //// console.log(course, isSelected)
    let update = courses;
    update.map((obj) => {
      if (obj.courseID === course.courseID) {
        obj["isSelected"] = isSelected;
        course["isSelected"] = isSelected;
      }
    })
    setCourses(update)
    localStorage.setItem("courselist", JSON.stringify(update));
    //// console.log("update", update)

  }

  // //// console.log(courses);
  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            gutterBottom
            // gutter
            sx={{
              fontSize:"1.8rem",
              color: "primary.main",
              fontWeight:"500"
            }}
          >
            {t("our_courses")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to={"/courses"} style={{textDecoration:"none"}}>
              <Typography
                mr={2}
                sx={{
                  color: "primary.main",
                }}
              >
                {t("see_all")}{" "}
              </Typography>
            </Link>

            {/* <ArrowCircleLeftIcon
              color={"yellow"}
              onClick={() => {
                sliderRef.current.slickPrev();
              }}
              sx={{
                fontSize: "2.5rem",
                marginRight: "10px",
                cursor:"pointer",
                color:"secondary.main"
              }}
            /> */}
            {/* <ArrowCircleRightIcon
              fontSize={"large"}
              color={"primary"}
              onClick={() => {
                sliderRef.current.slickNext();
              }}
              sx={{
                fontSize: "2.5rem",
                cursor:"pointer",
                color:"secondary.main"
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
            <>
            <Container>
        <Slider {...settings} ref={sliderRef}>
          {courses.map((course) => {
            return (
              <Box key={course.courseID} sx={{padding:".5rem"}}>
                <CourseCard
                title={course.title}
                id={course.courseID}
                img={course.thumbnail}
                instructor={course.instructor.name}
                price={course.price}
                hour={course.courseLength}
                lecture={course.totalLecture}
                fullObject={{ ...course }}
                updateCourse={updateCourse}
                  margin={2}
                />
              </Box>
            );
          })}
        </Slider>
        </Container>
        </>)}
        {/* </Grid>
      </Grid> */}
      </Container>
    </Box>
  );
};

export default HomeCourses;
