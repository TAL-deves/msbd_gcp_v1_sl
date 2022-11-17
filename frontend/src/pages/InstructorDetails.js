import React, { useEffect, useState, Component } from "react";
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
import ReactPlayer from "react-player";
import api from "../api/Axios";
import { blue } from "@mui/material/colors";
import { styled, alpha } from "@mui/material/styles";

import { withRouter } from "../components/routing/withRouter";
import { Image } from "@mui/icons-material";

const VIDEOLOG_URL = "/videologdata";
const SINGLE_COURSE_URL = "/api/instructorcourses";

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
  const [played, setPlayed] = useState(0);
  const [courses, setCourses] = useState([]);
  const [courseID, setCourseID] = useState();

  let location = useLocation();

  let state = location.state.instructorId;

  useEffect(() => {
    state.courses.map(async (singleCourse) => {
      var courseID = singleCourse;
      await api
        .post(SINGLE_COURSE_URL, JSON.stringify({ courseID }), {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        })
        .then((data) => {
          //console.log("single course id", data.data.data);
          courses.push(data.data.data);
        });
    });
  }, []);

  return (
    <Box>
      <Box>
        <Typography
          variant="h4"
          sx={{ paddingLeft: "40%", marginTop: "2%" }}
        ></Typography>

        <Box style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                  lg: "flex-start",
                },
                paddingLeft: "10%",
              }}
            >
              <Grid sx={{ marginLeft: "5%" }} item lg={2} md={6} sm={12}>
                <br />
                <br />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    {/* <Paper sx={{height:"100px", width:"100px"}}>
                <img  src={state?.image} alt="" /></Paper> */}
                    <Avatar
                      variant={"rounded"}
                      alt="The image"
                      src={state?.image}
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid sx={{ marginRight: "5%" }} item lg={4} md={6} sm={12}>
                <Typography
                  variant="h4"
                  sx={{ paddingLeft: "20%", marginTop: "2%" }}
                >
                  Profile of {state?.name}
                </Typography>
                <Typography sx={{ paddingLeft: "20%", marginTop: "2%" }}>
                  {state?.description_title1}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ paddingLeft: "20%", marginTop: "2%" }}
                >
                  {state?.description}{" "}
                </Typography>
              </Grid>
              <Grid item lg={2} md={4} sm={12}>
                {/* <VideoGridWrapper> */}
                <Grid>
                  <VdoPlayerStyle>
                    <Box>
                      <ReactPlayer
                        url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
                        controls={false}
                        loop={true}
                        playing={true}
                        onProgress={(progress) => {
                          setPlayed(progress.playedSeconds);
                        }}
                        onPlay={() => {
                          //console.log("play data sent");
                          const response = api.post(
                            VIDEOLOG_URL,
                            JSON.stringify({}),
                            {
                              headers: { "Content-Type": "application/json" },
                              "Access-Control-Allow-Credentials": true,
                            }
                          );
                        }}
                        onPause={() => {
                          //console.log("pause data sent");
                          const response = api.post(
                            VIDEOLOG_URL,
                            JSON.stringify({}),
                            {
                              headers: { "Content-Type": "application/json" },
                              "Access-Control-Allow-Credentials": true,
                            }
                          );
                        }}
                        // onProgress={//console.log("playing")}
                      />
                    </Box>
                  </VdoPlayerStyle>
                </Grid>
                {/* </VideoGridWrapper> */}
              </Grid>
            </Grid>
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
            Courses List of {state?.title}
          </Typography>
          <Grid spacing={4}>
            <Grid
              container
              columns={{ xs: 12, sm: 12, md: 10, lg: 10 }}
              justifyContent="center"
            >
              {courses.map((course) => {
                return (
                  <Box key={course.id}>
                    <CardGridStyle>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                          <CardMediaStyle>
                            <CardMedia
                              component="img"
                              height="140"
                              image={course.thumbnail}
                              alt="green iguana"
                            />
                          </CardMediaStyle>
                          <CardContent>
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
                            <br />
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
                            </Link>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </CardGridStyle>
                  </Box>
                  // <Box key={course.id}>{course.title}</Box>
                );
              })}
            </Grid>
          </Grid>
          <Box></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorDetails;
