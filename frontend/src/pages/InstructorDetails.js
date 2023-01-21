import React, { useEffect, useState, Component, useContext } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import coursesData from "../data/coursesData";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Avatar, CardActionArea, Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "@mui/material/Button";

import api from "../api/Axios";
import { blue } from "@mui/material/colors";
import { styled, alpha } from "@mui/material/styles";

import { withRouter } from "../components/routing/withRouter";
import { Image } from "@mui/icons-material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { globalContext } from "./GlobalContext";
import swal from "sweetalert";
import { Container } from "@mui/system";
import ReactPlayer from "react-player";

const VIDEOLOG_URL = "/videologdata";
const SINGLE_COURSE_URL = "/api/instructorcourses";
const INSTRUCTOR_DETAILS_URL = "/api/instructordetails";

const VideoGridWrapper = styled(Grid)(({ theme }) => ({
  marginTop: "30%",
}));

const VdoPlayerStyle = styled("Box")(({ theme }) => ({
  width: "70%",
  height: "70%",
}));

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

const CardGridStyle = styled(Card)(({ theme }) => ({
  margin: "5px",
}));

const CardMediaStyle = styled(CardMedia)(({ theme }) => ({
  width: "105%",
}));

const InstructorDetails = () => {
  const videoRef = React.useRef(null);
  const { language } = useContext(globalContext);
  AOS.init({ duration: 2000 });
  const [played, setPlayed] = useState(0);
  const [courses, setCourses] = useState([]);
  const [instructorInfo, setInstructorInfo] = useState();

  let location = useLocation();

  let state = location.state.instructorId;
  localStorage.setItem("instructor", state._id);
// console.log("instructor details",state)

  let instructorID = localStorage.getItem("instructor")


  let instructorDetails = async () => {
    let instructorID = state?._id;

    await api
      .post(INSTRUCTOR_DETAILS_URL, JSON.stringify({ instructorID, language }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        setInstructorInfo(data.data.data)
      });
  }

  useEffect(() => {
    // if(language==="en"){
    // setCourses([])
    state.courses.map(async (singleCourse) => {
      var courseID = instructorID;
      // console.log("courseID", courseID)
      await api
        .post(SINGLE_COURSE_URL, JSON.stringify({ courseID, language }), {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        })
        .then((data) => {
          setCourses(data.data.data)
          // console.log("first courses", data.data.data)
        });
    });
    instructorDetails()

  }, [language]);


  return (
    <Box>
      <Container>
        <Box>
          <Typography
            variant="h4"
            sx={{ paddingLeft: "40%", marginTop: "2%" }}
          ></Typography>

          <Box style={{ width: "100%" }}>
            <Typography
              variant="h4"
              sx={{ mt: "2%", textAlign: "center" }}
            >
              {instructorInfo?.name}
            </Typography>
            <Typography
              sx={{ mb: "2%", textAlign: "center", fontSize: "1.5rem" }}
            >
              {instructorInfo?.designation}
            </Typography>
            <Box
            >
              <Grid
                sx={{
                  display: "flex", justifyContent: "space-around", alignItems: "center",
                  flexDirection: { sm: "column-reverse", lg: "row", xl: "row", md: "row", xs: "column-reverse" }
                }}
              >
                <Grid
                  container
                  xs={10}
                  sm={6}
                  md={6}
                  lg={3}
                  xl={3}
                  justifyContent="center"
                >
                  <Box data-aos="fade-right" >
                    <img width={300} height={300} src={instructorInfo?.image} alt="" />
                  </Box>
                </Grid>

                {/* <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                  <Grid>
                    <Box sx={{ backgroundColor: "primary.main", borderRadius: "10px", width: "100%", justifyContent: "center", height: "80%", paddingTop: ".8rem", paddingBottom: ".5rem", overflow: "hidden" }}>
                      <ReactPlayer width='100%'
           height='315' controls="true" url={instructorInfo?.intro}/>
                    </Box>
                  </Grid>
                </Grid> */}
              </Grid>
            </Box>
            <Box>

              {instructorInfo?.description ? instructorInfo?.description.map((description) => {
                return (
                  <>
                    <Typography
                      variant="h5"
                      sx={{ margin: "5%", textAlign: "justify" }}
                    >
                      {description}
                    </Typography>
                  </>
                );
              }) : ""}


              {/* </Container>  */}
            </Box>
            <Typography
              variant="h4"
              sx={{
                marginTop: "5rem",
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "center",
                  md: "flex-start",
                  lg: "flex-start",
                },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Courses List of {instructorInfo?.name}
            </Typography>
            <Grid
              sx={{
                display: "flex", justifyContent: "space-around", alignItems: "center",
                flexDirection: { sm: "column-reverse", lg: "row", xl: "row", md: "row", xs: "column-reverse" }
              }}
            >

              {courses.map((course) => {
                // console.log("first course", course)
                return (
                  <Grid
                    container
                    xs={10}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    justifyContent="center"
                  >
                    <Box key={course.id} data-aos="flip-left">
                      <CardGridStyle>
                        <Card >
                          <CardActionArea>
                          {course.available?
                                <Link
                                  to={"/course-details"}
                                  state={{ courseId: course }}
                                  style={textstyle}
                                >
                            <CardMediaStyle>
                           
                              <CardMedia
                                component="img"
                                height="auto"
                                width="auto"
                                image={course.thumbnail}
                                alt={course.title}
                              />
                              
                            </CardMediaStyle>
                            </Link>:
                            <CardMediaStyle>
                           
                            <CardMedia
                              component="img"
                              height="auto"
                              width="auto"
                              image={course.thumbnail}
                              alt={course.title}
                            />
                            
                          </CardMediaStyle>}
                            <CardContent >
                              <Box sx={{ height: "8rem" }}>
                                <Typography variant="h6" component="Box">
                                  {course.title}
                                </Typography>
                                <br />
                                <Typography variant="body4" color="text.secondary">
                                  {course.instructor.name}
                                </Typography>
                                <Typography variant="h6" color="text.primary">
                                  &#2547;{course.price}
                                </Typography>
                                <Typography variant="body3" color="text.primary">
                                  Total {course.courseLength} hours |{" "}
                                  {course.totalLecture} Lectures
                                </Typography>
                              </Box>
                              <br />
                              {course.instructor.name === "D. Almasur Rahman" ?
                                <>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{ marginTop: "3%", marginLeft: "27%" }}
                                    onClick={() => { swal("This course is coming soon", "Thank You", "info") }}
                                  >
                                    Course Details
                                  </Button>
                                </>
                                :
                                <>
                                {course.available?
                                <Link
                                  to={"/course-details"}
                                  state={{ courseId: course }}
                                  style={textstyle}
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{ marginTop: "3%", marginLeft: "27%" }}
                                  >
                                    Course Details
                                  </Button>
                                </Link>:
                                <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{ marginTop: "3%", marginLeft: "27%" }}
                                    onClick={()=>{swal("This course is coming soon","Thank You", "info")}}
                                  >
                                    Course Details
                                  </Button>
                                </>}
                                </>}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </CardGridStyle>
                    </Box>
                    {/* // <Box key={course.id}>{course.title}</Box> */}
                  </Grid>
                );
              })}

            </Grid>
            <Box></Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InstructorDetails;
