import {React, useContext,  useState} from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import {motion} from "framer-motion";
import { globalContext } from "../../pages/GlobalContext";
import {add} from '../../Store/cartSlice';
import { useDispatch, useSelector } from "react-redux";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box } from "@mui/system";


const SSLCourseCard = (props) => {

  AOS.init({duration:2000});
  const {t}= useContext(globalContext)
  
  let title = props.title;
  let instructor = props.instructor;
  let price = props.price;
  let hour = props.hour;
  let lecture = props.lecture;
  let img = props.img;
  let fullObject = props.fullObject;


  const dispatch= useDispatch()

  // course id finder
  const courses= useSelector(state=>state.cart)
  let courseList=[];
  for(let i=0; i<courses.length;i++){
    courseList.push(courses[i].id);
    
  }
  
  // //// console.log("flagagagagaaaaaaaaa", JSON.parse(localStorage.getItem("course")))
 
  
// useEffect(()=>{
//   let array= JSON.parse(localStorage.getItem("course"))
//   array.map((e)=>{
//     // //// console.log("flagagagagaaaaaaaaa", e.id)
//   })
  
// })

//  const [toggle, setToggle]=("x")
  const handleAdd=(course)=>{
    props.updateCourse(course.fullObject, false)
  dispatch(add({...course}));
  // course["fullObject"]["isSelected"]=false;
  //// console.log("new course list handleAdd", course.fullObject.isSelected)
  // setFlag(false);
  

  // button change 
 
//  //// console.log("flag", course.id)

//  let array= JSON.parse(localStorage.getItem("course"))
//   array.map((e)=>{
    // //// console.log("flagagagagaaaaaaaaa", e.id)
    // if(e.id===course.id){
    //   //// console.log("yes im in", e.id, "and ", course.id);
    //   setFlag(true);
    // } else {
    //   //// console.log("Nothing");
    //   setFlag(false);
    // }
  // })

}

 localStorage.setItem("course", JSON.stringify(courses));


  return (
    <motion.div whileHover={{scale:1.03}}>
      <Box
        data-aos="zoom-in"
       >
    <Card sx={{ margin: "0" ,width:"100%", 
    "&:hover":{boxShadow:"5"}}}   >
      <CardMedia
        component="img"
        height="200"
        
        image={
          img
            ? `${img}`
            : "https://images.unsplash.com/photo-1659242536509-04df338adfea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
        }
        alt="image"
      />
      <CardContent sx={{display:"flex",
       flexDirection:"column",
       justifyContent:"flex-start",
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
            fontWeight:"500"
          }}
        >
          {title ? <>Demo</> : <>Course title</>}
        </Typography>
        <Typography variant="body2" noWrap color="text.secondary">
          {instructor ? <>D. Almasur Rahman</> : <>Course instructor</>}
        </Typography>
        <Typography variant="h6">
          {price ? <>&#x9F3;10</> : <>&#x9F3;Course price</>}
        </Typography>
        <Typography variant="body2">
          {hour ? <>Total {hour} hours</> : <>Course hour</>} |{" "}
          {lecture ? <>{lecture} lessons</> : <>Course lecture</>}
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex", alignItems:"flex-start",
    justifyContent:"space-between"}}>
       
          <Box item mb={1} mr={1}>
            <Button size="small" variant="contained" sx={{backgroundColor:"secondary.main", color:"primary.main","&:hover":{backgroundColor:"primary.main",
            color:"secondary.main"}}}
             onClick={()=>handleAdd(props)
              
             }
            
            
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                }}
              >
                {/* {t("buy")} */}
               {fullObject.isSelected===true?<>{t("buy")}</>:<>{t("selected")}</>} 
               {/* {fullObjectToggle==="y"?<>{t("buy")}</>:<>{t("selected")}</>}  */}
              </Typography>
            </Button>
          </Box>
          <Box item>


            {/* uncomment again  */}
          <Link to={"/course-details"} state={{ courseId: fullObject }} style={{
              textDecoration:"none"
            }}>
              <Button size="small" variant="contained"  
              sx={{color:"secondary.main",
            "&:hover":{backgroundColor:"secondary.main",
            color:"primary.main"}}}
            >
             
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
               
                  {t("course_details")}
                  
                </Typography>
                
              </Button>
              </Link>
              {/* only for soft launch */}
              {/* <Button size="small" variant="contained"  
              sx={{color:"secondary.main",
            "&:hover":{backgroundColor:"secondary.main",
            color:"primary.main"}}} onClick={()=>{
              swal("","To Be Announced","");
            }}
            >
             
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
               
                  {t("course_details")}
                  
                </Typography>
                
              </Button> */}
              
          </Box>
        {/* </Box> */}
      </CardActions>
    </Card>
    </Box>
    </motion.div>
  );
};

export default SSLCourseCard;

