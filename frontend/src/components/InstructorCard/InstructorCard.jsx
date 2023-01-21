import {React, useContext} from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import {motion} from "framer-motion";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box } from "@mui/system";
import swal from "sweetalert";

const InstructorCard = (props) => {
  AOS.init({duration:2000, once: true});
  const {t}= useContext(globalContext)
  let title = props.title;
  let instructor = props.instructor;
  let img = props.img;
  let fullObject = props.fullObject;
  // console.log("fullObject in homepage inst det",fullObject)
  

  return (
    <motion.div whileHover={{scale:1.03}}>
      
    <Card 
    //  data-aos="slide-up"
     sx={{ margin: "0 5px", "&:hover":{boxShadow:"5", position:"top"} }}>
      <CardMedia
        component="img"
        // height="290"
        image={
          img
            ? `${img}`
            : "https://images.unsplash.com/photo-1659242536509-04df338adfea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
        }
        alt="image"
        sx={{
          // maxWidth: "50%",
          // width:"100%",
        //  height:"25vh",
         width:{xs:"100%",sm:"100%", md:"100%"}
        }}
      />
      <Box sx={{display:"flex", 
      flexDirection:"column",
      alignItems:"center"
    }}>
      <CardContent sx={{display:"flex",
    flexDirection:"column", alignItems:"center"}}>
        <Typography
          gutterBottom
          sx={{
            fontSize: "1.2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            fontWeight:"500", 
          }}
          
        >
          {title ? <>{title}</> : <>Instructor Name</>}
        </Typography>
        <Typography variant="body2" noWrap color="text.secondary">
          {instructor ? <>{instructor}</> : <>Instructor title</>}
        </Typography>
        {/* <Typography variant="h6">
          {price ? <>&#x9F3;{price}</> : <>&#x9F3;Course price</>}
        </Typography>
        <Typography variant="body2">
          {hour ? <>Total {hour} hours</> : <>Course hour</>} |{" "}
          {lecture ? <>{lecture} lessons</> : <>Course lecture</>}
        </Typography> */}
      </CardContent>
      <CardActions>

           {/* uncomment after gcp upload  */}
           {fullObject.available?
      <Link to={"/instructor-details"} state={{ instructorId: fullObject }} style={{
              textDecoration:"none"
            }}>
           
        <Button size="small" variant="contained" sx={{color:"secondary.main"}}>
          <Typography
            sx={{
              fontSize: "1rem",
            }}
          >
            {t("instructor_details")}
          </Typography>
        </Button>
</Link>
:
<Button size="small" variant="contained" onClick={()=>{swal("Instructor details coming soon","Thank You","info")}} sx={{color:"secondary.main"}}>
          <Typography
            sx={{
              fontSize: "1rem",
            }}
          >
            {t("instructor_details")}
          </Typography></Button>}



        {/* <Button onClick={()=>{
              swal("","To Be Announced","");
            }} size="small" variant="contained" sx={{color:"secondary.main"}}>
          <Typography
            sx={{
              fontSize: "1rem",
            }}
          >
            {t("instructor_details")}
          </Typography>
        </Button> */}
        
      </CardActions>
      </Box>
    </Card>
   
    </motion.div>
  );
};

export default InstructorCard;
