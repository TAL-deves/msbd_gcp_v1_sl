import {React, useContext} from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import {motion} from "framer-motion";
import { globalContext } from "../../pages/GlobalContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Box } from "@mui/system";

const InstructorInCourseDetails = (props) => {
  AOS.init({duration:2000});
  const {t}= useContext(globalContext)
  let title = props.title;
  let instructor = props.instructor;
  let img = props.img;
  let description = props.description;
//// console.log("fullObject", description)
  return (
    <motion.div whileHover={{scale:1.03}}>
      <Box sx={{
        // border:"1px solid secondary.main",
      borderRadius:"5px ",
      backgroundColor:"secondary.main",
       padding:"1rem", marginBottom:"2rem"}}>
        <Typography variant="h4" sx={{paddingBottom:"1rem",
      color:"other.black"}}>
          Instructor
        </Typography>
        <Box  sx={{backgroundColor:"white",
        padding:"2rem",borderRadius:"5px"
        }}>
        
    <Box borderBottom={1} sx={{display:"flex",
  alignItems:"center", justifyContent:"space-around",
   marginBottom:"1rem"}}>
     
       <CardMedia
        component="img"
        sx={{ height:100,width: 100,marginBottom:"1rem",
        borderRadius: '50%',
       }}
        image={
          img
            ? `${img}`
            : "https://images.unsplash.com/photo-1659242536509-04df338adfea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
        }
        alt="Live from space album cover"
      />
        <Box>
        <Typography variant="h5" color="black" >
        {title}
        </Typography>
        <Typography variant="h7" color="black">
          {/* uncomment after ssl  */}
        {/* {instructor} */}

        Instructor
        </Typography>
        </Box>
    </Box>
    <Typography variant="subtitle_1" color="black">
    {description}
        </Typography>
        </Box>
    </Box>
   
    </motion.div>
  );
};

export default InstructorInCourseDetails;
