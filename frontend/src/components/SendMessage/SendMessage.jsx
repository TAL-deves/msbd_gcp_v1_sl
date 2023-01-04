import { Button, Fab, Modal, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import api from "../../api/Axios";
import swal from "sweetalert";

const LEAVE_MESSAGE_URL = "/api/leaveamessage";
const USER_URL = "/api/userprofile";

export default function SendMessage() {
    const [open, setOpen] = useState(false);
    const [phonenumber, setPhonenumber] = useState();
    const [fullname, setFullname] = useState()
    const [email, setEmail] = useState()
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [userInfo, setUserInfo] = useState({}) 
    const [profession, setProfession] = useState("")
    const [gender, setGender] = useState("")      
    const [age, setAge] = useState();
  // const loggedin = localStorage.getItem("access_token")
  const username = localStorage.getItem("user")
    // const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [leaveMessage, setLeaveMessage] = useState("")

    //  message submit 
  let handleLeaveMessage = async () => {
    const response = await api
      .post(LEAVE_MESSAGE_URL, JSON.stringify({ phonenumber, email, fullname, leaveMessage }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        //// console.log(data)
        if (data.status === 200) {
          swal("Message Sent", "", "success")
        }
        else {
          swal("Server Busy", "Please Try Again Later", "error")
        }
      });

    //// console.log("response", response);
  };


  let handleGetUser = async () => {
    const response = await api.post(USER_URL,
      JSON.stringify({ username }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }
    )

    //   .then((res)=>{// console.log(" response of user", res)
    //   if(res.data.data.result.status===401){
    //     navigate("/login")
    //   }
    // });
    // console.log("response data", response.data.result.status)

    // if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
    //   localStorage.removeItem("access_token");
    //   localStorage.removeItem("refresh_token");
    //   localStorage.removeItem("user");

    //   swal("You are logged out", "Your session ended, Please login again", "info")
    //   // navigate("/login")
    //   window.location.href = "/login";
    //   // console.log("removed sesssion")
    // }
    // else {
    if (response.data.result.status === 200) {
      setUserInfo(response.data.data)
      setEmail(response.data.data.email)
      setGender(response.data.data.gender ? response.data.data.gender : "male")
      setProfession(response.data.data.profession)
      setFullname(response.data.data.fullname)
      setAge(response.data.data.age)
      setPhonenumber(response.data.data.phoneNumber)
    }
    //   // console.log(response.data.data, "user prof response")
    // }
    // return response.data.data

  }

  useEffect(() => {
    handleGetUser();
  }, [])
  return (
    <Box>
      <Fab sx={{ backgroundColor: "#F8B100", position: 'fixed', bottom: "6rem", right: "2rem" }} onClick={() => {
                handleOpen()
              }} aria-label="add">
                {/* <SupportAgentIcon /> */}
                <MailOutlineIcon />
              </Fab>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box >

                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "80%",
                    // height: {xs:"85%", sm:"55%", md:"60%", lg:"75%", xl:"50%"},
                    height: "auto",
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                  }}>
                    <CancelIcon onClick={handleClose} sx={{ position: 'absolute',cursor:"pointer", color: "white", top: "-7%", right: { xs: "-7%", sm: "-5%", md: "-5%", lg: "-3%", xl: "-3%" }, fontSize: "2rem" }} />
                    <Container sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: "1rem" }}>
                      <Typography sx={{ fontSize: "2rem" }} >Leave a Message</Typography>

                      <Box sx={{ marginLeft: "5%", marginRight: "5%" }}>
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
                        onClick={() => handleLeaveMessage() && handleClose()}
                        disabled={!phonenumber}
                      >
                        Send
                      </Button>
                    </Container>
                  </Box>
                </Box>
              </Modal>
    </Box>
  )
}
