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
  


  return (

    <Container sx={{ height: "60vh" }}>
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




      </Box>

    </Container>
  )
}

export default Contact