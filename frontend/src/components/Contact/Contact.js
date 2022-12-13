import { Button, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import AOS from 'aos';
import 'aos/dist/aos.css';
import api from "../../api/Axios";
import swal from "sweetalert";

const LEAVE_MESSAGE_URL = "/api/leaveamessage";
const USER_URL = "/api/userprofile";
const UPDATE_USER_URL = "/api/updateuserprofile";

const Contact = () => {
  const [leaveMessage, setLeaveMessage] = useState("")

  const [username, setUsername] = useState(localStorage.getItem('user'))
  const [userInfo, setUserInfo] = useState({})
  const [fullname, setFullname] = useState()
  const [email, setEmail] = useState()
  const [profession, setProfession] = useState("")
  const [gender, setGender] = useState("")

  const [phonenumber, setPhonenumber] = useState();
  const [age, setAge] = useState();
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  AOS.init({ duration: 2000 });

  //  message submit 
  let handleLeaveMessage = async () => {
    const response = await api
      .post(LEAVE_MESSAGE_URL, JSON.stringify({ phonenumber,email,fullname,leaveMessage }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        console.log(data)
        if (data.status === 200) {
          swal("Message Sent", "", "success")
        }
        else{
          swal("Server Busy", "Please Try Again Later", "error")
        }
      });

    //console.log("response", response);
  };


  let handleGetUser = async () => {
    const response = await api.post(USER_URL,
      JSON.stringify({ username }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }
    )

    //   .then((res)=>{console.log(" response of user", res)
    //   if(res.data.data.result.status===401){
    //     navigate("/login")
    //   }
    // });
    console.log("response data", response.data.result.status)

    // if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
    //   localStorage.removeItem("access_token");
    //   localStorage.removeItem("refresh_token");
    //   localStorage.removeItem("user");

    //   swal("You are logged out", "Your session ended, Please login again", "info")
    //   // navigate("/login")
    //   window.location.href = "/login";
    //   console.log("removed sesssion")
    // }
    // else {
    //   setUserInfo(response.data.data)
    //   setEmail(response.data.data.email)
    //   setGender(response.data.data.gender ? response.data.data.gender : "male")
    //   setProfession(response.data.data.profession)
    //   setFullname(response.data.data.fullname)
    //   setAge(response.data.data.age)
    //   setPhonenumber(response.data.data.phoneNumber)
    //   console.log(response.data.data, "user prof response")
    // }
    // return response.data.data

  }

  useEffect(() => {
    handleGetUser();
    // handleGetUserImage();

  }, [])





  let handleUpdateUserProfile = async () => {
    const response = await api.post(UPDATE_USER_URL,
      JSON.stringify({ username, fullname, email, phonenumber, profession, age, gender }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }

    ).then((e) => {
      swal("Profile Updated!", "", "success")
    });
    setUserInfo(response.data.data)
    setProfession(userInfo.profession)
    // if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
    //   localStorage.removeItem("access_token");
    //   localStorage.removeItem("refresh_token");
    //   localStorage.removeItem("user");

    //   swal("You are logged out", "Your session ended, Please login again", "info")
    //   // navigate("/login")
    //   window.location.href = "/login";
    //   console.log("removed sesssion")
    // }
    // setGender(userInfo.gender)
    // console.log("HONULULULUASDHASDHHASDHASDH",userInfo)
    // return response.data.data

  }


  return (

    <Container sx={{ height: "100%" }}>
      <Box sx={{
        display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem", border: "1px solid #f7eed7", borderRadius: "10px",
      }}>
        <Typography sx={{ fontSize: "2rem", fontWeight: "bolder", border: "1px solid #f8b100", borderRadius: "10px", backgroundColor: "secondary.main", padding: "1rem", marginTop: ".5rem", color: "primary.main" }} >Contact Us</Typography>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem", color: "primary.main" }} >Address</Typography>
        <Typography sx={{ color: "primary.main" }} > Progress Tower(4th floor) House #01, Road #23, Gulshan 1, Dhaka 1212</Typography>

        <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem", color: "primary.main" }} >Email</Typography>
        <Typography sx={{ color: "primary.main" }} >support@mindschoolbd.com</Typography>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem", color: "primary.main" }} >Contact</Typography>
        <Typography sx={{ color: "primary.main" }} >+880248811161</Typography>
        <Typography sx={{ color: "primary.main" }} >+880248811162</Typography>


        <Container sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: "4rem" }}>
          <Typography sx={{ fontSize: "2rem", fontWeight: "bolder", border: "1px solid #f8b100", borderRadius: "10px", backgroundColor: "secondary.main", padding: "1rem", marginTop: "0rem", color: "primary.main" }} >Leave a Message</Typography>
          
          <Box sx={{marginLeft:"5%", marginRight:"5%"}}>
            <TextField
            margin="normal"
            focused
            fullWidth
            required
            id="name"
            label="Phone Number"
            onChange={(e) => { setPhonenumber(e.target.value) }}
            value={phonenumber}
            name="name"
            autoComplete="name"
            inputProps={{
              maxLength: 320,
            }}
            autoFocus
          />

          <TextField
            margin="normal"
            // required
            // color="success"
            focused
            fullWidth
            name="email"
            label="Email"
            id="email"
            value={email}
            onFocus={() => setEmailFocus(true)}
            // error={
            //   emailFocus && !validEmail ?
            //     true :
            //     false
            // }
            // helperText={emailFocus && !validEmail ?
            //   "Enter valid Email"
            //   : false
            // }
            onChange={(e) => { setEmail(e.target.value) }}
          />

          <TextField
            margin="normal"
            // required
            focused
            fullWidth
            id="name"

            label="Name"
            value={fullname}
            onChange={(e) => { setFullname(e.target.value) }}
            name="name"
            autoComplete="name"
            inputProps={{
              maxLength: 320,
            }}
          // autoFocus
          />
          <TextField
            sx={{ marginTop: "1.5%", width: "100%" }}
            id="outlined-basic"
            focused
            multiline
            rows={3}
            label="Message"
            variant="outlined"
            onChange={(e) => setLeaveMessage(e.target.value)}
          />
          </Box>
          <Button
            sx={{ margin: "2%" }}
            variant="contained"
            onClick={()=>handleLeaveMessage()} 
            disabled={!phonenumber}
          >
            Send
          </Button>
        </Container>


      </Box>

    </Container>
  )
}

export default Contact