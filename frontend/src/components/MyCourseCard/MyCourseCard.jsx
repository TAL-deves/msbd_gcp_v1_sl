import {React,   useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";

import {add} from '../../Store/cartSlice';
import { useDispatch, useSelector } from "react-redux";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box } from "@mui/system";


const MyCourseCard = (props) => {
 
  AOS.init({duration:2000,once: true});
  
  let title = props.title;
  let instructor = props.instructor;
  let hour = props.hour;
  let lecture = props.lecture;
  let img = props.img;


 //// console.log("fullObject.id", fullObject)
  const dispatch= useDispatch()

  // course id finder
  const courses= useSelector(state=>state.cart)
  let courseList=[];
  for(let i=0; i<courses.length;i++){
    courseList.push(courses[i].id);
    
  }
  
  // //// console.log("flagagagagaaaaaaaaa", JSON.parse(localStorage.getItem("course")))
 
  

//   const handleAdd=(course)=>{
//     props.updateCourse(course.fullObject, false)
//   dispatch(add({...course}));
//   // course["fullObject"]["isSelected"]=false;
//   //// console.log("new course list handleAdd", course.fullObject.isSelected)
//   // setFlag(false);
  

//   // button change 
 
// //  //// console.log("flag", course.id)

// //  let array= JSON.parse(localStorage.getItem("course"))
// //   array.map((e)=>{
//     // //// console.log("flagagagagaaaaaaaaa", e.id)
//     // if(e.id===course.id){
//     //   //// console.log("yes im in", e.id, "and ", course.id);
//     //   setFlag(true);
//     // } else {
//     //   //// console.log("Nothing");
//     //   setFlag(false);
//     // }
//   // })

// }

 localStorage.setItem("course", JSON.stringify(courses));


  return (
    <Box sx={{width:"50%"}}>
     {/* <motion.div whileHover={{scale:1.03}}> */}
      {/* <Box
        // data-aos="zoom-in"
       > */}
    <Card sx={{ width:"100%",display:"flex", alignItems:"center",
    "&:hover":{boxShadow:"5"}}}   >
      <Box>
      <CardMedia 
        component="img"
        // height="130px"
        // width="170px"
        image={
          img
            ? `${img}`
            : "https://images.unsplash.com/photo-1659242536509-04df338adfea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
        }
        alt="image"
      />
      </Box>
      <CardContent sx={{display:"flex",width:"8rem",
       flexDirection:"column",
       justifyContent:"flex-start",
      //  alignItems:"center"
       }}>
        <Typography
          // gutterBottom
          // height={30}
          sx={{
            fontSize: "1rem",
            // overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            // WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            fontWeight:"500"
          }}
        >
          {title ? <>{title}</> : <>Course title</>}
        </Typography>
        <Typography variant="body2" noWrap color="text.secondary">
          {instructor ? <>{instructor}</> : <>Course instructor</>}
        </Typography>
        <Typography variant="body2">
          {hour ? <>Total {hour} hours</> : <>Course hour</>} |{" "}
          {lecture ? <>{lecture} lessons</> : <>Course lecture</>}
        </Typography>
      </CardContent>
      {/* <CardActions sx={{display:"flex", alignItems:"flex-start",
    justifyContent:"space-between"}}>
       
          
      
      </CardActions> */}
    </Card>
    {/* </Box> */}
    {/* </motion.div> */}
    </Box>
  );
};

export default MyCourseCard;
