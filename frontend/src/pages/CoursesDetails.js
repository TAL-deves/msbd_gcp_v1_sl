import React, { useEffect, useState, Component, useContext } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import coursesData from "../data/coursesData";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, CardActionArea, DialogActions, DialogContent, Dialog } from "@mui/material";
import InstructorCard from "../components/InstructorCard/InstructorCard";
import {
  BrowserRouter as Router,
  Switch,
  Route,

  useLocation,
  useNavigate,
} from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@mui/material/Button";

import api from "../api/Axios";
import { blue } from "@mui/material/colors";
import { styled, alpha } from "@mui/material/styles";
import { withRouter } from "../components/routing/withRouter";
import { Container } from "@mui/system";
import googlebtn from "../components/downloadApp/playstore.png"
import applebtn from "../components/downloadApp/applestore.png";
import { Link as Routerlink } from "react-router-dom";
import Link from '@mui/material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { instructorData } from "../data/instructorData";
import AOS from 'aos';
import 'aos/dist/aos.css';
import InstructorInCourseDetails from "../components/InstructorInCourseDetails/InstructorInCourseDetails";
import { globalContext } from "./GlobalContext";
import swal from "sweetalert";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import appimage_dark from "../components/downloadApp/downloadappanimation.json";
import ReactPlayer from "react-player";

let CHECK_DEVICE_URL = "/api/checkdeviceanduser"



const VIDEOLOG_URL = "/videologdata";
const COURSE_DETAILS_URL = "/api/coursedetails";
let USER_COURSES_URL = "/api/usercourses"

function Item(props) {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}


const textstyle = {
  textDecoration: "none",
};

Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};



const CoursesDetails = () => {
  const [startbutton, setStartButton] = useState(true)
  const videoRef = React.useRef(null);
  const navigate = useNavigate();
  const { language, t } = useContext(globalContext);
  AOS.init({ duration: 2000 });
  const [played, setPlayed] = useState(0);
  const [state, setState] = useState({});
  const [instructorState, setInstructorState] = useState(instructorData);
  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);
  const [isAndroid, setIsAndroid] = React.useState()
  const loggedin = localStorage.getItem("access_token")
  let location = useLocation();
  let username = localStorage.getItem("user")


  let fullobject = location.state.courseId;
  let courseID = fullobject.courseID;
  let bundleBtnDisable = location.state.bundleBtnDisable;

  const style = {
    height: { xs: 320 },
    width: { xs: 320 },
    borderRadius: "50px",
    margin: "5px",

  };

  let fetchData = async () => {
    let username = localStorage.getItem("user")
    await api
      .post(USER_COURSES_URL, JSON.stringify({ username }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        //  console.log("ins dta", data);
        if (data.data.result.status === 404 || data.data.result.status === 401) {
          // swal("No Puchase Done Yet", "You will get to see only purchased courses here","info")
          setCourses([])
        }
        else {
          setCourses(data.data.data)
          // console.log("state",data.data.data)
        }

        setLoad(false);
      });
  };



  let fetchCourseDetails = async () => {
    await api
      .post(COURSE_DETAILS_URL, JSON.stringify({ courseID, language }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        setState(data.data.data)
        // console.log(data.data.data)
      });

  };

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

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

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
    fetchCourseDetails()
    fetchDeviceData()
  }, [language, open]);


  let existingCourse;
  let newButton = false
  if (courses !== null && courses.length !== 0) {
    existingCourse = courses.find(c => c.courseID === state?.courseID)
    newButton = true
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (

    <Box >
      <Container >
        {/* <Typography variant="h3" sx={{display:"flex", justifyContent:"center"}}>Course Details</Typography> */}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}
            sx={{ marginTop: "1rem" }}>
            <Grid item xs={12} lg={6} data-aos="fade-right">
              <Typography variant="h4" sx={{ marginBottom: "1rem", color: "primary.main" }}>

                {state?.title}
              </Typography>

              {state.description ?
                state.description.map((dt) => {
                  return <Typography variant="h6"
                    sx={{ marginBottom: "1rem", textAlign: "justify" }}>
                    {dt}
                  </Typography>
                }) :
                ""}

              {bundleBtnDisable ?
               <>
                 <Button sx={{ marginLeft: "0rem" }}
                          //  onClick={response}
                          onClick={() => {
                            navigate(-1)
                          }}
                          variant="contained">Back
                        </Button>
               </> 
               :
                <>
                  {loggedin ?
                    <>

                      {/* {Object.keys(existingCourse).length === 0 && existingCourse.constructor === Object ? */}
                      {existingCourse === undefined ?
                        <Button sx={{ marginLeft: "0rem" }}
                          onClick={() => {
                            navigate("/payment-info", { state: { total: state?.price, singleCourse: state?.courseID } }
                            )
                          }}
                          variant="contained">Buy Now
                        </Button>
                        :
                        <>
                          {isAndroid === "Android" || isAndroid === "Linux" || isAndroid === "iPhone" ?
                            <>
                              <Button variant="contained" color="primary" onClick={handleClickOpen()}>
                                <Typography variant="p" color="other.dark"
                                >
                                  Start Now
                                </Typography>
                              </Button>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                scroll={scroll}
                                aria-labelledby="scroll-dialog-title"
                                aria-describedby="scroll-dialog-description"
                              >
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
                                    }} variant="contained" sx={{
                                      "&:hover": {
                                        backgroundColor: "secondary.main",
                                        color: "primary.main", fontWeight: "800"
                                      }
                                    }}>Close</Button>
                                </DialogActions>
                              </Dialog>
                            </>
                            :
                            <>

                              <Routerlink to="/course-video" state={{ courseId: state }}
                                style={{ textDecoration: 'none' }}
                              >
                                <Button variant="contained" color="primary">
                                  <Typography variant="p" color="other.dark"
                                  >
                                    Start now
                                  </Typography>
                                </Button>
                              </Routerlink>
                            </>}</>

                      }</> :
                    <Routerlink to="/login"
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="contained" color="primary">
                        <Typography variant="p" color="other.dark"
                        >
                          Buy now
                        </Typography>
                      </Button>
                    </Routerlink>}
                </>
              }

              {/* <Button sx={{marginLeft:"2rem"}}
                //  onClick={response}
                onClick={() => {
                  
                  navigate("/payment-info", { state: { total: state?.price, singleCourse: state?.courseID} }
                  )
                }}
                // disabled={(courseList.length === 0) ? true : false || checkBoxStatus === false }
                // disabled
                variant="contained">Buy Now
              </Button> */}

            </Grid>
            <Grid item xs={12} lg={6} sx={{ position: "relative" }} data-aos="fade-left">
              <Item sx={{ paddingTop: { xs: "1rem", sm: "1rem", md: "1rem", lg: "6rem" }, position: "sticky", top: 0 }}>
                
                <Box sx={{ backgroundColor: "primary.main", borderRadius: "10px", width: "100%", height: "100%", paddingTop: ".8rem", paddingBottom: ".5rem", }}>
                  {/* <iframe ref={videoRef} width="100%" height="315" src={state?.courseIntro} title="YouTube video player" frameborder="0" ></iframe> */}
                  <ReactPlayer width='100%'
                    height='100%' controls="true" url={state?.courseIntro} />
                </Box>
              </Item>
            </Grid>

          </Grid>
        </Box>

      </Container>

      <Container sx={{ marginTop: "5rem", width: { xs: "100%", sm: "60%", md: "60%", lg: "100%" } }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={7} data-aos="fade-right">
              <Typography variant="h4" sx={{ color: "primary.main" }}>{t("course_details")}:</Typography>
              {/* <Typography variant="h6" >
        <img  src={state?.thumbnail} alt=""/>
        </Typography> */}
              <Typography variant="h6">
                <Typography variant="h6"
                  sx={{
                    color: "primary.main",
                    marginTop: "2rem", display: "flex", alignItems: "center"
                  }}><CheckCircleOutlineIcon />
                  {t("total_lecture")}: </Typography>{state?.totalLecture}
              </Typography>
              <Typography variant="h6">
                <Typography variant="h6" sx={{
                  color: "primary.main",
                  marginTop: "1rem", display: "flex", alignItems: "center"
                }}>
                  <CheckCircleOutlineIcon />{t("course_length")}:</Typography>
                {state?.courseLength} {t("hours")}
              </Typography>
              <Typography variant="h6" sx={{
                color: "primary.main",
                marginTop: "1rem", display: "flex", alignItems: "center"
              }}>
                <CheckCircleOutlineIcon />{t("validity")}:</Typography>
              <Typography variant="h6">
                {/* {state?.validity} Days */}
                {bundleBtnDisable?`${t("days180")}`:`${t("days120")}`}
                {/* {t("days")} */}
              </Typography>
              <Typography variant="h6">
                
              </Typography>
              <Typography variant="h6">
                <Typography variant="h6"
                  sx={{
                    color: "primary.main", marginTop: "1rem",
                    display: "flex", alignItems: "center"
                  }}>
                  <CheckCircleOutlineIcon />{t("course_price")}:  </Typography>
                ৳{state?.price}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={5} data-aos="fade-left">
              <Box>
                {/* instructor card */}
                <InstructorInCourseDetails
                  fullobject={state?.instructor}
                  title={state?.instructor?.name}
                  instructor={state?.instructor?.designation}
                  img={state?.instructor?.image}
                  description={state?.instructor?.description[0]}
                >
                </InstructorInCourseDetails>
                <Box>
                </Box>
                <Box
                  sx={{
                    margin: "2%", padding: "2%", border: "1px solid white",
                    borderRadius: "5px", marginTop: "2rem",
                    boxShadow: "1px 1px 14px 1px rgba(102,102,102,0.83);"
                  }}>
                  <Typography
                    sx={{
                      paddingBottom: "5%", textAlign: "center"
                    }}
                    variant="h4">
                    Download Our App
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <Link href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school" target="new">
                      <Box
                        sx={{
                          // backgroundColor: "other.logocolor",
                          backgroundColor: "secondary.main",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "10px",
                          margin: "2%"
                        }}
                      >
                        <img src={googlebtn} alt="google" width="96%" />
                      </Box>
                    </Link>
                    {/* <Link href="https://techanalyticaltd.com/" target="new"> */}
                    <Link href="https://apps.apple.com/app/id1667470558" target="new">
                      <Box
                        // onClick={()=>{swal("iOS app is coming soon", "Thank You", "info")}}
                        sx={{
                          // backgroundColor: "other.footercolor",
                          backgroundColor: "secondary.main",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "9px",
                          borderRadius: "10px",
                          margin: "2%"
                        }}
                      >
                        <img src={applebtn} alt="google" width="80%" />
                      </Box>
                    </Link>
                  </Box>
                  <Lottie
                    animationData={appimage_dark}
                    style={style}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

      </Container>
    </Box>

  );
};

export default CoursesDetails;