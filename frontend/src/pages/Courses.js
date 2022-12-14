import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios"

import {  Container } from "@mui/material";
import CourseCard from "../components/CourseCard/CourseCard";
import SideCart from "../components/SideCart/SideCart";
import { multiStepContext } from "./StepContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { globalContext } from "./GlobalContext";


const Courses = (props) => {
  

  const { language } = useContext(globalContext);
  let mail = props.mail;

  //// console.log("registration_er_user", userobj)


  AOS.init();

  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);

  let fetchData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
      // .then((res) => res.json())
      .then((data) => {
        // //// console.log(" THis is the data -----  "+data.data.data.coursesData);
        let listOfCourse;
        if(localStorage.getItem("language")==="bn"){
           listOfCourse = data.data.data.coursesData.en;
           // console.log("coursesbn",listOfCourse)

        }
        else{
          listOfCourse = data.data.data.coursesData.bn;
          //  console.log("coursesen",listOfCourse)
        }
        let localCourseList = JSON.parse(localStorage.getItem("courselist"));
        //// console.log(localCourseList);
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


  useEffect(() => {
    fetchData();
  }, [language]);




  return (
    // <Box >
      <Container>
        <Typography
          sx={{
            fontSize: "2rem",
            m: "5px",
          }}
        >
          Browse all our courses
        </Typography>

        <Box
        //  {sm:"column", lg:"row", xs:"column"}}}
        >
          <Grid sx={{
            display: "flex",
            flexDirection: { sm: "column-reverse", lg: "row",xl:"row",md:"row", xs: "column-reverse" }
          }}>
            <Grid
              container
              // columns={{ xs: 10, sm: 10, md: 10, lg: 10 }}
              xs={11}
              // lg={8}
              justifyContent="center"
            >
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
                // <Skeleton variant="rectangular" width={210} height={118} /> 
              ) : (
                <>
                {/* for ssl 
                <Box sx={{ width: {xs:"100%", sm:"47%", md:"45%", lg:"40%", xl:"40%"}, mb: "1rem",mr:{xs:"0rem", sm:"1rem", md:"1rem", lg:"1rem", xl:"1rem"} }}>
                <SSLCourseCard
                          title={courses[2].title}
                          id={courses[2].courseID}
                          img={courses[2].thumbnail}
                          instructor={courses[2].instructor.name}
                          price={courses[2].price}
                          hour={courses[2].courseLength}
                          lecture={courses[2].totalLecture}
                          fullObject={{ ...courses[2] }}
                          updateCourse={updateCourse}
                          
                        />

                </Box> */}
                  {courses.map((course) => {
                    return (
                      <Box key={course.courseID}
                        sx={{ width: {xs:"100%", sm:"47%", md:"45%", lg:"40%", xl:"40%"}, mb: "1rem",mr:{xs:"0rem", sm:"1rem", md:"1rem", lg:"1rem", xl:"1rem"} }}
                      >
                        
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
                          
                        />
                        {/* <Button variant="contained" 
                    onClick={()=>handleAdd(course)}
                    //  disabled=
                    >
                   <ShoppingCartIcon/>
                    </Button> */}

                      </Box>
                    );
                  })}
                 
                </>
              )}
              
            </Grid>
            <Grid
              // columns={{ xs: 2, sm: 2, md: 1, lg: 1 }}
              xs={1}
            // lg={8}
            >
              {/* <Box sx={{ marginTop: "2rem" }}>
                
                <>
                  <SideCart
                    mail={mail}
                    setCourses={setCourses}
                  /></>

                
              </Box> */}
              <Box sx={{border: "1px solid rgb(210 206 206 / 87%)",
               borderRadius: "10px", marginBottom:"2rem", width:{md:"90%"}}}>
              <Box sx={{ margin: "1rem"}}>
                {/* <StepContext> */}
                <>
                  <SideCart
                    mail={mail}
                    setCourses={setCourses}
                  /></>

                {/* </StepContext>        */}
              </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    // </Box>
  );
};

export default Courses;