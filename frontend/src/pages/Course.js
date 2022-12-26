import React, { useEffect, useState } from "react";
// import Course from '../components/course/Course';
import coursesData from "../data/coursesData";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { width } from "@mui/system";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// import * as React from 'react';
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
// import Box from '@mui/material/Box';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Container, CssBaseline } from "@mui/material";
import { CardActionArea } from "@mui/material";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from "../api/Axios";


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));


const VideoGridWrapper = styled(Grid)(({ theme }) => ({
  marginTop: "30%",
}));

const VdoPlayerStyle = styled("div")(({ theme }) => ({
  width: "70%",
  height: "70%",
}));
const CardGridStyle = styled(Card)(({ theme }) => ({
  // padding: "5px",
  margin: "5px",
  // paddingRight: "5px"
}));

const CardMediaStyle = styled(CardMedia)(({ theme }) => ({
  width: "105%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [played, setPlayed] = useState(0);
  const [videolink, setVideolink]= useState("")


  useEffect(() => {
    // fetch('https://www.boredapi.com/api/activity')
    // fetch(`http://192.168.68.105:8084/api/courses`)
    //   .then((res) => res.json())
    //   .then((data) => setCourses(data.data.courseData.C001));

    api.get('http://192.168.68.104:8084/api/courses')
    .then(data=> setCourses(data.data.data.courseData.C001))
    //  //// console.log(courses)
  }, []);

  // //// console.log(courses)

  const textstyle = {
    textDecoration: "none",
  };
  const navigate = useNavigate();
  

  // //// console.log(courses.C001[0].title);
  return (
    <>
      {/* <Typography>are dada</Typography> */}
<Container sx={{marginTop:"5%", marginBottom:"10%"}}>
<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
<Grid item xs={6}>
      {courses.map((course) => {
              return (
                <Accordion key={course.title}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{course?.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.<br/>
            Link: <Button onClick={()=>{setVideolink(`${course?.link}`)}}>Click Here</Button>
            
            {/* {course?.link} */}
          </Typography>
        </AccordionDetails>
      </Accordion>
                );
              })}
              </Grid>
              <Grid item xs={6}>
              <VideoGridWrapper>
            <Grid >
        <VdoPlayerStyle>
          <div>

          </div>
          </VdoPlayerStyle>
    </Grid>
    </VideoGridWrapper>
              </Grid>
              </Grid>
      </Container>
    </>
  );
};

export default Courses;
