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
import BundleinCourse from "../components/BundleinCourse/BundleinCourse";


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
  const [courses2, setCourses2] = useState([]);

  const [bundleCourses, setBundleCourses] = useState([]);
  const [load, setLoad] = useState(true);
  const [isAndroid, setIsAndroid] = React.useState()
  // const [isFirstActive, setIsFirstActive] = React.useState(true)
  let isFirstActive = true;
  let fetchData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/seeallcourses`)
      
      .then((data) => {
        console.log(" THis is the data -----  ", data.data.data);
        let listOfCourse;
        if (localStorage.getItem("language") === "bn") {
          // listOfCourse = data.data.data.coursesData.en;
          listOfCourse = data.data.data.allEnCourses;
          // console.log("coursesbn",listOfCourse)

        }
        else {
          // listOfCourse = data.data.data.coursesData.bn;
          listOfCourse = data.data.data.allBnCourses;
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
        console.log("listOfCourse", listOfCourse)
        setLoad(false);

        // bundle courses

        // let listOfBundleCourse
        // if (localStorage.getItem("language") === "bn") {
        //   listOfBundleCourse = data.data.data.bundleCourses.en;
        //   // console.log("coursesbn",listOfCourse)

        // }
        // else {
        //   listOfBundleCourse = data.data.data.bundleCourses.bn;
        //   //  console.log("coursesen",listOfCourse)
        // }
        // setBundleCourses(listOfBundleCourse)
        // console.log("listOfBundleCourse",listOfBundleCourse)
      });
  };


  let fetchLocalData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/seeallcourses`)
      // .then((res) => res.json())
      .then((data) => {
        setCourses2(data.data.data.allEnCourses)
        console.log("setcourse", data.data.data.allEnCourses)
      });
  };
  // let fetchBundleData = async () => {

  //   await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
  //     // .then((res) => res.json())
  //     .then((data) => {

  //       let listOfBundleCourse;
  //       if (localStorage.getItem("language") === "bn") {
  //         listOfBundleCourse = data.data.data.bundleCourses.en;
  //         // console.log("coursesbn",listOfCourse)

  //       }
  //       else {
  //         listOfBundleCourse = data.data.data.bundleCourses.bn;
  //         //  console.log("coursesen",listOfCourse)
  //       }
  //       let localCourseList = JSON.parse(localStorage.getItem("courselist"));
  //       //// console.log(localCourseList);
  //       listOfBundleCourse.map((course) => {
  //         if (localCourseList !== null) {
  //           let localCourse = localCourseList.find(obj => obj.courseID === course.courseID)
  //           course["isSelected"] = localCourse !== null ? localCourse["isSelected"] : true;

  //         }
  //         else {
  //           course["isSelected"] = true
  //         }
  //       })
  //       setCourses(listOfBundleCourse)
  //       console.log("listOfCourse",listOfBundleCourse)
  //       setLoad(false);

  //     });
  // };



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
  let updateCourse2 = (course, isSelected) => {
    //// console.log(course, isSelected)
    let update = courses2;
    update.map((obj) => {
      if (obj.courseID === course.courseID) {
        obj["isSelected"] = isSelected;
        course["isSelected"] = isSelected;
      }
    })
    setCourses(update)
    localStorage.setItem("courselist", JSON.stringify(update));


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


  useEffect(() => {
    fetchData();
    // fetchBundleData();

    fetchLocalData()
    fetchDeviceData();
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [language, open]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);


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
                      <Link href="https://apps.apple.com/app/id1667470558" target="new">
                        <Box
                          // onClick={() => { swal("iOS App Coming Soon", "Thank You", ""); }}
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
                      </Link>
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

      <Box
      >
        <Typography
          sx={{
            fontSize: "2rem",
            m: "5px",
          }}
        >
          Browse all our courses
        </Typography>
        <Grid sx={{
          display: "flex",
          flexDirection: { sm: "column-reverse", lg: "row", xl: "row", md: "column-reverse", xs: "column-reverse" }
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

                {courses.map((course) => {
                  if (course.bundleCourse && isFirstActive === true) {
                    isFirstActive = false
                    return (
                      <>
                        <Typography
                          sx={{
                            fontSize: "1.8rem",
                            color: "primary.main",
                            fontWeight: "500", width: "100%", alignItems: "center",
                          }}
                        >

                          {t("bundle_courses")}
                        </Typography>
                        <Box key={course.courseID}
                          sx={{ width: { xs: "100%", sm: "47%", md: "45%", lg: "40%", xl: "40%" }, mb: "1rem", mr: { xs: "0rem", sm: "1rem", md: "1rem", lg: "1rem", xl: "1rem" } }}
                        >
                          {/* {course.bundleCourse===true? */}


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
                        </Box>
                      </>
                    );
                  }

                  else {
                    return (
                      <>
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
                        </Box>
                      </>
                    )
                  }
                })}

                {/* <Typography
                  sx={{
                    fontSize: "1.8rem",
                    color: "primary.main",
                    fontWeight: "500",width:"100%", alignItems:"center"
                  }}
                >
                  {t("bundle_courses")}
                </Typography>
                
                <BundleinCourse updateCourse2={updateCourse2}/> */}
                {/* {courses.map((course) => {
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
                updateCourse={updateCourse}
                
                />
              </Box>
            );
          })} */}
              </>
            )}

          </Grid>
          <Grid
            xs={1}
          >

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
                  // setBundleCourses={setBundleCourses}
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