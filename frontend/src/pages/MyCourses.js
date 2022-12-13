

import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios"

import { Button, Container, LinearProgress, linearProgressClasses, Table, TableCell, TableContainer, TableRow } from "@mui/material";
import { add } from '../Store/cartSlice';
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../components/CourseCard/CourseCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SideCart from "../components/SideCart/SideCart";
import StepContext, { multiStepContext } from "./StepContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import swal from "sweetalert";
import MyCourseCard from "../components/MyCourseCard/MyCourseCard";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CardMembershipIcon from '@mui/icons-material/CardMembership';

let USER_COURSES_URL = "/api/usercourses"

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
  let mail = props.mail;
  AOS.init();

  //console.log(mail)

  const [courses, setCourses] = useState([]);
  const [load, setLoad] = useState(true);

  let fetchData = async () => {
    // cmmnt later after my courses api created
    // await api.post(`${process.env.REACT_APP_API_URL}/api/allcourses`)
    //   .then((data) => {
    //     // //console.log(" THis is the data -----  "+data.data.data.coursesData);
    //     let listOfCourse;
    //     if(localStorage.getItem("language")==="bn"){
    //        listOfCourse = data.data.data.coursesData.en;
    //        console.log("coursesbn",listOfCourse)

    //     }
    //     else{
    //       listOfCourse = data.data.data.coursesData.bn;
    //       console.log("coursesen",listOfCourse)
    //     }
    //     setCourses(listOfCourse)
    //     setLoad(false);
    //   });


    // uncomment 
    let username = localStorage.getItem("user")

    await api
      .post(USER_COURSES_URL, JSON.stringify({ username }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        console.log("ins dta", data);
        if (data.data.result.status === 404) {
          // swal("No Puchase Done Yet", "You will get to see only purchased courses here","info")
          setCourses([])
        }
        else {
          setCourses(data.data.data)
        }
        console.log("data", data)

        setLoad(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  return (
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
                <CircularProgress sx={{
                  color: "primary.main"
                }} />
              ) : (
                <>
                  <TableContainer component={Paper} sx={{ marginTop: "0rem" }}>
                    <Table sx={{ minWidth: {xs:"100%",sm:"100%",md:"100%", lg:900, xl:900 } }} aria-label="simple table">
                      <TableRow>
                        {courses.map((course) => {
                          return (

                            <Box key={course.courseID} fullWidth
                             
                            >
                              <TableCell  sx={{
                                display: "flex", flexDirection: { xs: "column", sm: "column", md: "row", lg: "row", xl: "row" }, alignItems:"center",
                                mb: "15px", padding: ".5rem"
                              }}>
                                <MyCourseCard

                                  title={course.title}
                                  id={course.courseID}
                                  img={course.thumbnail}
                                  instructor={course.instructor.name}
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
                                <Box sx={{ width: {xs:"50%",sm:"50%",md:"50%",lg:'50%', xl:"50%"}, margin:"2rem" }}>
                                  <BorderLinearProgress variant="determinate" value={course.status} />

                                  <Typography sx={{}}>{course.status}%</Typography>
                                </Box>
                                {/* </Box> */}
                                {/* </TableCell> */}

                                {/* <TableCell> */}
                                <Box sx={{display:"flex", flexDirection:{xs:"row"}}}>
                                {course.status===100?
                                <Box sx={{margin:"1rem"}}>
                                {/* <img height={50} src={course.thumbnail} alt="" /> */}
                                <CardMembershipIcon/>
                                </Box>
                                :""}
                                {/* </TableCell> */}
                                {/* <TableCell> */}
                                <Box item sx={{
                                  paddingBottom: ".5rem"
                                }}>
                                  {/* uncomment again  */}
                                  <Link to={"/coursedemo"} state={{ courseId: course }} style={{
                                    textDecoration: "none"
                                  }}>

                                    <Button size="small" variant="contained"
                                      sx={{
                                        color: "secondary.main",
                                        "&:hover": {
                                          backgroundColor: "secondary.main",
                                          color: "primary.main"
                                        }
                                      }}
                                    >
                                     {course.status===0?
                                      <Typography
                                        sx={{
                                          fontSize: ".8rem",
                                        }}
                                      >

                                        Start Now

                                      </Typography>
                                      :
                                      <Typography
                                        sx={{
                                          fontSize: ".8rem",
                                        }}
                                      >

                                        Continue Course

                                      </Typography>}

                                    </Button>
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


    </Box>
  );
};

export default MyCourses;