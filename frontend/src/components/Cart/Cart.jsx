import React, { useContext} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import {motion} from "framer-motion";
import api from "../../api/Axios";
import { Container, Modal, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { remove } from "../../Store/cartSlice";
import { globalContext } from "../../pages/GlobalContext";
import swal from "sweetalert";
import { multiStepContext } from "../../pages/StepContext";


const PAYMENT_URL = "/api/buy";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Cart = (props) => {
  const {
    userRef,
    emailRef,
    errRef,
    validName,
    setValidName,
    userobj,
    userFocus,
    setUserFocus,
    validEmail,
    setValidEmail,
    email,
    setEmail,
    emailFocus,
    setEmailFocus,
    password,
    setPwd,
    validPwd,
    setValidPwd,
    pwdFocus,
    setPwdFocus,
    validMatch,
    setValidMatch,
    matchFocus,
    setMatchFocus,
    errMsg,
    setErrMsg,
    success,
    setSuccess,
    handleSubmit,
    theme,
    username,
    setUser,
    matchPwd,
    setMatchPwd,phone, setPhone,validPhone, phoneFocus,setPhoneFocus
  } = useContext(multiStepContext);
  let mail= userobj.user
  const {t}= useContext(globalContext)
  let user=localStorage.getItem("user")

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  const dispatch= useDispatch();

  const handleRemove=(course)=>{
    //// console.log("removed course id",course)
    
    dispatch(remove(course))

    let courseList = JSON.parse(localStorage.getItem("courselist"))
    courseList.map((obj)=>{
      if(obj.courseID===course.id)
      {
        obj["isSelected"] = true;
        course["fullObject"]["isSelected"]=true;
      }
    })
     localStorage.setItem("courselist",JSON.stringify(courseList));
      props.setCourses(courseList);
}

  const courses= useSelector(state=>state.cart)
  // //// console.log(courses)
  
   //  course list for api 
   let courseList=[];
   for(let i=0; i<courses.length;i++){
     courseList.push(courses[i].id);      
   }
   //
  // total cost 
  let total=0;
  for(const courseCost of courses){
    total= total+Number(courseCost.price)  
  }
  // //// console.log("cart er course",courses)

  // payment api
  const response =()=>{  api.post(PAYMENT_URL,
    JSON.stringify({  mail, courseList}),
    {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true,         
    }

).then((res)=>{
  if (res.data.result.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    swal("Session expired", "Redirecting to login page" ,'success');
    setTimeout(function(){
      window.location.href = '/login';
   }, 1000);

  }
}); }



  // payment api for gift 
  const responseForGift =()=>{  api.post(PAYMENT_URL,
    JSON.stringify({  email, courseList}),
    {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true,         
    }

).then((res)=>{
  if (res.data.result.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    swal("Session expired", "Redirecting to login page" ,'success');
    setTimeout(function(){
      window.location.href = '/login';
   }, 1000);

  }
}); }



  return (
    <>
      <Typography sx={{margin:"5rem"}} variant="h5"></Typography>
      <Container>
      <Box 
      sx={{display:"flex",
       flexDirection:"column",
       alignItems:"center"}}>
      <Grid spacing={4} sx={{display:"flex"}}>
        <Grid
          container
          columns={{ xs: 12, sm: 12, md: 10, lg: 10 }}
          justifyContent="center"
          alignItems="flex-start"
        >
          {courses.map((course) => {
            return (

              <>
              
              <motion.div whileHover={{scale:1.03}}>
              <Box data-aos="fade-right" key={course.courseID} sx={{ maxWidth: "40rem", mb:"15px", display:"flex", justifyContent:"flex-start" }} >
              <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {course.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {course.instructor}
          </Typography>
          <Typography variant="h6" color="text.primary" component="div">
          ৳{course.price}
          </Typography>
          <Typography variant="subtitle1" color="text.primary" component="div">
          Total {course.hour} Hours || Total {course.lecture} Lectures
          </Typography>
          <Link to={"/course-details"} state={{ courseId: course}} style={{
              textDecoration:"none"
            }}>
              <Button size="small" variant="contained">
                <Typography
                  sx={{
                    fontSize: "1rem",
                  }}
                >
                  {t("course_details")}
                </Typography>
              </Button>
            </Link>
       
        </CardContent>
        
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={course.img}
        alt="Live from space album cover"
      />
    </Card>
                <Button  
                onClick={()=>handleRemove(course)
                }>X</Button>

              </Box>
              </motion.div>
            </>
            );
          })}
        </Grid>
        </Grid>
        <Box sx={{margin:"5rem"}} >
        <Typography  variant="h5">Total: ${total}</Typography>
        {user? 
          ( 
            <>
          <Button
             onClick={response}
             disabled={(courseList.length===0)?true:false}
              variant="contained">Proceed to Payment
              </Button>
               {/* <Button 
               disabled={(courseList.length===0)?true:false}
               variant="contained" sx={{marginLeft:"1rem", marginTop:{ xs:"1rem", md:"0rem", lg:"0rem",xl:"0rem"}, overflow:"hidden"}}
               onClick={handleOpen}>Gift
             </Button> */}
             <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" color="text.secondary" variant="h6" component="h2">
            Please enter the email of the person you want to gift this course below
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              // error={errMsg}
              autoComplete="email"
              // autoFocus
              value={email}
              InputProps={{
                disableUnderline: true,
              }}
              inputProps={{
                maxLength: 320,
              }}
              onChange={(e) =>
                 setEmail(e.target.value)}
              // aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              // onBlur={() => setEmailFocus(false)}
              error={emailFocus && email && !validEmail ? true : false}
              helperText={
                emailFocus && email && !validEmail
                  ? "Please provide a valid email"
                  : ""
              }
            />
          </Typography>
          <Button 
            onClick={responseForGift} 
            
            // disabled={(courseList.length===0)?true:false}
            variant="contained">Proceed to Payment</Button>
        </Box>
        
      </Modal>
             </>
         )
           :
          (
          
          <Link to={"/login"} style={{
            textDecoration:"none"
          }}>
            <Button 
            onClick={response} 
            disabled={(courseList.length===0)?true:false}
            variant="contained">Proceed to Payment</Button>
          </Link>
          )} 
        </Box>
      </Box>
      </Container>
     
    </>
  );
};

export default Cart;