import { React, useContext, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { globalContext } from "../../pages/GlobalContext";
import { add } from '../../Store/cartSlice';
import { useDispatch, useSelector } from "react-redux";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box } from "@mui/system";
import swal from "sweetalert";



const CourseCard = (props) => {


  AOS.init({ duration: 2000, once: true });
  const { t } = useContext(globalContext)

  let title = props.title;
  let id = props.courseID;
  let instructor = props.instructor;
  let price = props.price;
  let hour = props.hour;
  let lecture = props.lecture;
  let img = props.img;
  let fullObject = props.fullObject;


  // console.log("fullObject.id", fullObject)
  const dispatch = useDispatch()

  // course id finder
  const courses = useSelector(state => state.cart)
  let courseList = [];
  for (let i = 0; i < courses.length; i++) {
    courseList.push(courses[i].id);

  }


  const [found, setFound] = useState(false)
  const handleAdd = (course) => {
    props.updateCourse(course.fullObject, false)
    dispatch(add({ ...course }));
    
  }

  localStorage.setItem("course", JSON.stringify(courses));

  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Box
        data-aos="zoom-in"
      >
        <Card sx={{
          margin: "0", width: "100%",
          "&:hover": { boxShadow: "5" }
        }}   >
          {fullObject.available?
          <Link to={"/course-details"} state={{ courseId: fullObject }} style={{
                textDecoration: "none"
              }}>
          <CardMedia
            component="img"
            height="auto"

            image={
              img
                ? `${img}`
                : "https://images.unsplash.com/photo-1659242536509-04df338adfea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
            }
            alt="image"
          />
          </Link>
          :
          <>
          <CardMedia
            component="img"
            height="auto"
            image={
              img
                ? `${img}`
                : "https://images.unsplash.com/photo-1659242536509-04df338adfea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
            }
            alt="image"
          />
          </>}
          <CardContent sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            //  alignItems:"center"
          }}>
            <Typography
              gutterBottom
              height={30}
              sx={{
                fontSize: "1.2rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                fontWeight: "500"
              }}
            >
              {title ? <>{title}</> : <>Course title</>}
            </Typography>
            <Typography variant="body2" noWrap color="text.secondary">
              {instructor ? <>{instructor}</> : <>Course instructor</>}
            </Typography>
            <Typography variant="h6">
              {price ? <>&#x9F3;{price}</> : <>&#x9F3;Course price</>}
            </Typography>
            <Typography variant="body2">
              {hour ? <>{t("total")} {hour} {t("hours")}</> : <>Course hour</>} |{" "}
              {lecture ? <>{lecture} {t("lessons")}</> : <>Course lecture</>}
            </Typography>
          </CardContent>
          <CardActions sx={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between"
          }}>

            <Box item mb={1} mr={1}>
            {fullObject.available?
              <Button size="small" variant="contained"
                sx={{
                  backgroundColor: "secondary.main", color: "primary.main", "&:hover": {
                    backgroundColor: "primary.main",
                    color: "secondary.main"
                  }
                }}
                onClick={() => handleAdd(props)

                }


              >
                
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
                  {fullObject.isSelected === true ? <>{t("buy")}</> : <>{t("selected")}</>}
                </Typography>
   
              </Button>
              :
              <Button size="small" variant="contained"
              sx={{
                backgroundColor: "secondary.main", color: "primary.main", "&:hover": {
                  backgroundColor: "primary.main",
                  color: "secondary.main"
                }
              }}
              onClick={() => swal("This course is coming soon","Thank You", "info")

              }
            >
              <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
                  {t("buy")}
                </Typography>
            </Button>
              }
            </Box>
            <Box item>
              {/* uncomment again  */}
              {!fullObject.available?
              <>
              <Button size="small" variant="contained"
                  sx={{
                    color: "secondary.main",
                    "&:hover": {
                      backgroundColor: "secondary.main",
                      color: "primary.main"
                    }
                  }}
                  onClick={()=>{swal("This course is Coming Soon","Thank You","info")}}
                >

                  <Typography
                    sx={{
                      fontSize: "1rem",
                    }}
                  >

                    {t("course_details")}

                  </Typography>

                </Button>
              </>
              :
              <Link to={"/course-details"} state={{ courseId: fullObject }} style={{
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

                  <Typography
                    sx={{
                      fontSize: "1rem",
                    }}
                  >

                    {t("course_details")}

                  </Typography>

                </Button>
              </Link>}

              



            </Box>
            {/* </Box> */}
          </CardActions>
        </Card>
      </Box>
    </motion.div>
  );
};

export default CourseCard;
