import { Button, CircularProgress, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react'
import {
    useLocation, useNavigate,
} from "react-router-dom";
import api from "../api/Axios"
import CourseCard from '../components/CourseCard/CourseCard';
import { globalContext } from './GlobalContext';


const BUNDLE_ID_URL = "/api/coursedetails"
export default function BundleCourseDetails() {
    const [bundleIdList, setBundleIdList] = useState([]);
    const [load, setLoad] = useState(true);
    const [courses, setCourses] = useState();
    let location = useLocation();
    let fullobject = location.state.courseId;
    let bundleCourse = location.state.bundleCourse;
    
    const { language } = useContext(globalContext);
    const navigate = useNavigate();

    useEffect(() => {
        setBundleIdList(fullobject.bundleList)
    }, [])



    // bundleIdList.map(async(courseID, index)=> {
    //         await api
    //         .post(BUNDLE_ID_URL, JSON.stringify({ courseID }), {
    //           headers: { "Content-Type": "application/json" },
    //           "Access-Control-Allow-Credentials": true,
    //         })
    //         .then((data) => {
    //           console.log(data.data.data, index)
    //           courses.push(data.data.data)
    //         });  
    // })

    const promises = bundleIdList.map(async (courseID) => {
        const response = await api.post(
            BUNDLE_ID_URL,
            JSON.stringify({ courseID, language }),
            {
                headers: { "Content-Type": "application/json" },
                "Access-Control-Allow-Credentials": true,
            }
            
        );
        return response.data.data;
    });

    useEffect(() => {
        Promise.all(promises)
            .then((data) => {
                setCourses(data)
                setLoad(false);
                // Do something with the data
            })
            .catch((error) => {
                console.error(error);
            });
    }, [bundleIdList])
    // console.log("courses aray", courses)


    return (
        <div>
            {/* <>helo</> */}
            {/* {courses ? */}
                <Container 
                // sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", md: "row", lg: "row", xl: "row" } }}
                >
                     {load ? (
              <Container sx={{

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "10%"
              }}>
                <CircularProgress sx={{
                  color: "primary.main"
                }} />
              </Container>
              // <Skeleton variant="rectangular" width={210} height={118} /> 
            ) : (<>
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

                    {courses.map((course) => {
                        return (
                            <Box key={course.courseID}
                                sx={{ m: 3, width: { xs: "80%", sm: "60%", md: "30%", lg: "25%", xl: "25%" }, mb: "1rem", mr: { xs: "0rem", sm: "1rem", md: "1rem", lg: "1rem", xl: "1rem" } }}
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
                                    bundleBtnDisable={bundleCourse}


                                />
                            </Box>
                        );
                    })}
                
                    </Grid>
                   
                    </Grid>
                    <Box sx={{textAlign:"center", display:"flex", justifyContent:"center", mr:"5rem", mt: { xs: "0rem", sm: "2rem", md: "3rem", lg: "3rem", xl: "3rem"}}}>
                    <Button 
                          onClick={() => {
                            navigate("/payment-info", { state: { total: fullobject?.price, singleCourse: fullobject?.courseID } }
                            )
                          }}
                          variant="contained">Buy Now
                        </Button>
                        </Box>
                        </>)}
                    
                </Container>
                {/* : <>No Course Available</>} */}
            {/* {courses.map((course)=>{
        <>{course.courseID}</>

      })} */}
        </div>
    )
}
