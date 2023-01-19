

import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios"
import { Button, Container, LinearProgress, linearProgressClasses, Table, TableCell, TableContainer, TableRow } from "@mui/material";

import AOS from 'aos';
import 'aos/dist/aos.css';
import swal from "sweetalert";
import MyCourseCard from "../components/MyCourseCard/MyCourseCard";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import axios from "axios";
// import fileDownload from 'js-file-download';

// import { AiFillLinkedin } from 'react-icons/ai';



var fileDownload = require('js-file-download');

let USER_COURSES_URL = "/api/usercourses"
let CHECK_DEVICE_URL = "/api/checkdeviceanduser"
// let CERTIFICATE_URL= "/api/testingpoint"

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));


const MyCourses = (props) => {

  AOS.init();

  //// console.log(mail)

  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);

  let fullName = props.fullName
  let setIsAndroid = props.setIsAndroid
  let username = localStorage.getItem("user")
  let fetchData = async () => {
    await api
      .post(USER_COURSES_URL, JSON.stringify({ username }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {


        if (data.data.result.status === 401 || data.data.result.status === 400 || data.data.result.status === 404) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          swal("You are logged out", "Your session ended, Please login again", "info").then(() => { window.location.href = "/login"; })
          // navigate("/login")
          // console.log("removed sesssion")
        }
        else {
          if (data.data.data === null) {
            setCourses([])
          }
          else { setCourses(data.data.data) }
        }

        setLoad(false);
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


  useEffect(() => {
    fetchData();
    fetchDeviceData();
  }, []);



  return (
    <>
      {load ? (
        <Container sx={{
          marginLeft: "12vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem"
        }}>
          <CircularProgress sx={{
            color: "primary.main"
          }} />
        </Container>
      ) : (
        <Box
        >

          <Container>
            <Typography
              sx={{
                fontSize: "2rem",
                m: "5px",
              }}
            >
              My courses
            </Typography>

            {courses[0] ?
              <Box >
                <Box
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
                  ) : (
                    <>
                      <TableContainer component={Paper} sx={{ marginTop: "0rem" }}>
                        <Table sx={{ minWidth: { xs: "100%", sm: "100%", md: 700, lg: 900, xl: 900 } }} aria-label="simple table">
                          <TableRow>
                            {courses.map((course) => {

                              return (

                                <Box key={course.courseID} fullWidth

                                >
                                  <TableCell sx={{
                                    display: "flex", flexDirection: { xs: "column", sm: "column", md: "row", lg: "row", xl: "row" }, alignItems: "center",
                                    mb: "15px", padding: ".5rem"
                                  }}>
                                    <MyCourseCard

                                      title={course.title}
                                      id={course.courseID}
                                      img={course.thumbnail}
                                      instructor={course.instructor}
                                      price={course.price}
                                      hour={course.courseLength}
                                      lecture={course.totalLecture}
                                      fullObject={{ ...course }}

                                    />
                                    {/* </TableCell> */}
                                    {/* <TableCell>
                               <Typography>{course.title}</Typography>
                              </TableCell> */}
                                    {/* <TableCell sx={{width:"50%"}}> */}
                                    {/* <Box sx={{ width: '100%' }}> */}
                                    {/* <LinearProgress variant="determinate" value={9} /> */}
                                    <Box sx={{ width: { xs: "50%", sm: "50%", md: "50%", lg: '50%', xl: "50%" }, margin: "2rem" }}>
                                      {/* <BorderLinearProgress variant="determinate" value={course.status} /> */}
                                      <LinearProgress variant="determinate" value={course.status} sx={{
                                        height: 10,
                                        borderRadius: "5px"
                                      }} />

                                      <Typography sx={{}}>{course.status}%</Typography>
                                    </Box>
                                    {/* </Box> */}
                                    {/* </TableCell> */}

                                    {/* <TableCell> */}
                                    <Box sx={{ display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
                                      {/* {course.status===100? */}
                                      <Box>
                                        <Button disabled={course.status === 100 ? false : true} variant="outlined" sx={{ cursor: "pointer" }} onClick={async () => {
                                          let courseID = `${course.courseID}`
                                          let courseName = `${course.title}`
                                          let courseInstructor = `${course.instructor}`
                                          // console.log(course,"course --------------")
                                          await axios
                                            .post(`${process.env.REACT_APP_API_URL}/api/certificate`, { username, courseID, courseName, courseInstructor, fullName }, { responseType: "blob" })
                                            .then((data) => {
                                              fileDownload(data.data, "Certificate.pdf")
                                            });
                                        }}>
                                          Certificate
                                        </Button>

                                      </Box>
                                      <Box item sx={{
                                        paddingBottom: ".5rem"
                                      }}>
                                        {/* uncomment again  */}
                                        <Link to={"/course-video"} state={{ courseId: course }} style={{
                                          textDecoration: "none"
                                        }}>

                                          {/* <Button size="small" variant="contained"
                                            sx={{
                                              color: "secondary.main",
                                              "&:hover": {
                                                backgroundColor: "secondary.main",
                                                color: "primary.main"
                                              }
                                            }}
                                          > */}
                                            {course.status === 0 ?
                                              <Button
                                              variant="contained"
                                              sx={{ width: 127}}
                                            >
                                              
                                              Start

                                            </Button>
                                              :
                                              <Button
                                                variant="contained"
                                                sx={{ width: 127}}
                                              >

                                                Continue

                                              </Button>}

                                          {/* </Button> */}
                                        </Link>
                                      </Box>
                                    </Box>
                                  </TableCell>

                                </Box>
                              );
                            })}

                          </TableRow>

                        </Table>
                      </TableContainer>
                    </>
                  )}
                </Box>




                {/* cmnt  */}
                {/* <Box sx={{ width: '100%' }}>
                            <BorderLinearProgress variant="determinate" value={50} />
                            50%
                          </Box> */}

              </Box> :
              <Box>
                no courses
              </Box>}
          </Container>


        </Box>)}
    </>
  );
};

export default MyCourses;