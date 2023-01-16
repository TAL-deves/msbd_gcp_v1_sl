import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios"

import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, Link } from "@mui/material";
import CourseCard from "../components/CourseCard/CourseCard";
import SideCart from "../components/SideCart/SideCart";
import { multiStepContext } from "./StepContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { globalContext } from "./GlobalContext";
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from "framer-motion";
// import googlebtn from "./playstore.png";
import googlebtn from "../components/downloadApp/playstore.png";
import applebtn from "../components/downloadApp/applestore.png";
import swal from "sweetalert";
import Lottie from "lottie-react";
import appimage_dark from "../components/downloadApp/downloadappanimation.json";


let CHECK_DEVICE_URL = "/api/checkdeviceanduser"
const Courses = (props) => {

  let username = localStorage.getItem("user")
  const { language } = useContext(globalContext);
  let mail = props.mail;

  const style = {
    height: { xs: 320 },
    width: { xs: 320 },
    borderRadius: "50px",
    margin: "5px",

  };


  AOS.init();

  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);
  const [isAndroid, setIsAndroid] = React.useState()

  let fetchData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
      // .then((res) => res.json())
      .then((data) => {
        // //// console.log(" THis is the data -----  "+data.data.data.coursesData);
        let listOfCourse;
        if (localStorage.getItem("language") === "bn") {
          listOfCourse = data.data.data.coursesData.en;
          // console.log("coursesbn",listOfCourse)

        }
        else {
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
          else {
            course["isSelected"] = true
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

  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');
  const { t } = React.useContext(globalContext)

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  // React.useEffect(() => {
  //   if (open) {
  //     const { current: descriptionElement } = descriptionElementRef;
  //     if (descriptionElement !== null) {
  //       descriptionElement.focus();
  //     }
  //   }
  // }, [open]);

  // React.useEffect(()=>{
  //   fetchDeviceData()
  // },[])

  useEffect(() => {
    fetchData();
    fetchDeviceData();
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [language, open]);




  return (
    // <Box >
    <Container>
      {isAndroid === "Android" || isAndroid === "Linux" || isAndroid === "iPhone" ?
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <CancelIcon onClick={handleClose} sx={{ position: 'absolute', cursor: "pointer", color: "white", top: "-7%", right: { xs: "-7%", sm: "-5%", md: "-5%", lg: "-3%", xl: "-3%" }, fontSize: "2rem" }} />
            <DialogContent dividers={scroll === 'paper'}>
              <Container
                // data-aos="fade-up"
                sx={{
                  color: "primary.main",
                  alignContent: "center",
                }}
              >
                <Box>
                  <Typography
                    gutterBottom
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {/* {t("download_app")} */}
                    Download Our Mobile App 
                  </Typography>
                  <Typography
                    gutterBottom
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "5400",
                      textAlign: "center",
                    }}
                  >
                    {/* {t("download_app")} */}
                    To run the courses on mobile devices
                  </Typography>
                  {isAndroid === "Android" || isAndroid === "Linux" ?
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <Link href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school" target="new">
                        <Box
                          // onClick={()=>{swal("","App Coming Soon","");}}
                          sx={{
                            backgroundColor: "other.footercolor",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: "20px",
                            boxShadow: "4",
                            "&:hover": { boxShadow: "5" }
                          }}
                        >
                          <img src={googlebtn} alt="google" width="72%" />
                        </Box>
                      </Link>
                    </motion.div> :

                    <motion.div whileHover={{ scale: 1.03 }}>
                      {/* <Link href="https://techanalyticaltd.com/" target="new"> */}
                      <Box
                        onClick={() => { swal("iOS App Coming Soon", "Thank You", ""); }}
                        sx={{
                          // backgroundColor: "secondary.main",
                          backgroundColor: "other.footercolor",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "20px",
                          boxShadow: "4",
                          "&:hover": { boxShadow: "5" }
                        }}
                      >
                        <img src={applebtn} alt="google" width="60%" />
                      </Box>
                      {/* </Link> */}
                    </motion.div>}
                  <Lottie
                    animationData={appimage_dark}
                    style={style}
                  />
                </Box>
                {/* </Grid> */}
              </Container>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose()
                  props.setN(props.n + 1)
                }} variant="contained" sx={{
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    color: "primary.main", fontWeight: "800"
                  }
                }}>Close</Button>
            </DialogActions>
          </Dialog>
        </> : <></>}


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
          flexDirection: { sm: "column-reverse", lg: "row", xl: "row", md: "row", xs: "column-reverse" }
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
                marginTop: "5rem"
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
            <Box sx={{
              border: "1px solid rgb(210 206 206 / 87%)",
              borderRadius: "10px", marginBottom: "2rem", width: { md: "90%" }
            }}>
              <Box sx={{ margin: "1rem" }}>
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