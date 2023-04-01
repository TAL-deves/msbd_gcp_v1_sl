

import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Container, Grid } from "@mui/material";

import CourseCard from "../CourseCard/CourseCard";
import Slider from "react-slick";
import api from "../../api/Axios";
import { useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const BundleinCourse = (props) => {
  const { language } = useContext(globalContext);
  AOS.init({duration:2000});
  const {t}= useContext(globalContext)
  

  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);

  let fetchData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
      // .then((res) => res.json())
      .then((data) => {
        // //// console.log(" THis is the data -----  "+data.data.data.coursesData);
        // let listOfCourse = data.data.data.coursesData;
        // let localCourseList = JSON.parse(localStorage.getItem("courselist"));
        //// console.log(localCourseList);
       console.log("data bundle", data)
        let listOfCourse;
        if(localStorage.getItem("language")==="bn"){
           listOfCourse = data.data.data.bundleCourses.en;
           //// console.log("coursesbn",listOfCourse)

        }
        else{
          listOfCourse = data.data.data.bundleCourses.bn;
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
      });
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  let updateCourse = (course, isSelected) => {
    let update = courses;
    update.map((obj) => {
      if (obj.courseID === course.courseID) {
        obj["isSelected"] = isSelected;
        course["isSelected"] = isSelected;
      }
    })
    setCourses(update)
    // let courselist= localStorage.getItem("courselist") || []
    // courselist.push(update)
    localStorage.setItem("courselist", JSON.stringify(update));
  }


  return (
    <>
      
        {/* <Box
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
            {t("bundle_courses")}
          </Typography>
          
        </Box> */}
        
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
          {courses.map((course) => {
            return (
              
                <Box key={course.courseID}
                      sx={{ width: { xs: "100%", sm: "47%", md: "45%", lg: "40%", xl: "40%" }, mb: "1rem", mr: { xs: "0rem", sm: "1rem", md: "1rem", lg: "1rem", xl: "1rem" } }}
                    >
                <CourseCard
                title={course.title}
                id={course.courseID}
                img={course.thumbnail}
                instructor={course.instructor.name}
                price={course.price}
                hour={course.courseLength}
                lecture={course.totalLecture}
                bundleCourse={course.bundleCourse}
                fullObject={{ ...course }}
                updateCourse={course.updateCourse2}
                
                />
              </Box>
            );
          })}
              
        </>)}
       
    </>
  );
};

export default BundleinCourse;


