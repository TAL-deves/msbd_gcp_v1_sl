import { BrowserRouter, Redirect, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import Navigationbar from "./components/navbar/Navigationbar";
import Offer from "./components/offer/Offer";
import Courses from "./pages/Courses";
import CoursesDetails from "./pages/CoursesDetails";
import Course from "./pages/Course";
import Error from "./pages/Error";
import Footer from "./components/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import LocalStorageService from "./api/localstorage";
// import ForgotPassword from "./components/Forgotpassword/ForgotPassword";
import ForgotPassword from "./pages/ForgotPassword";
import StepContext, { multiStepContext } from "../src/pages/StepContext";
import Forgot_Requestpassword from "./pages/Forgot_Requestpassword";
import Forgot_ResetPassword from "./pages/Forgot_ResetPassword";
import ForgotContext from "./pages/ForgotContext";
import Cart from "./components/Cart/Cart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OfflineBar from "./components/offlinebar/OfflineBar";
import { Offline, Online } from "react-detect-offline";
import Swal from "sweetalert2";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Button, Fab, Modal, Paper, TextField, Typography } from "@mui/material";
import primarytheme from "./style/style";
import UserProfile from "./pages/UserProfile";
import MyCourses from "./pages/MyCourses";
import InstructorDetails from "./pages/InstructorDetails";
import PaymentHistory from "./pages/PaymentHistory";
import MyFeedbacks from "./pages/MyFeedbacks";
import DeactivateAccount from "./pages/DeactivateAccount";
import Underconstruction from "./pages/Underconstruction";
import Coursedemo from "./pages/Coursedemo";
import ScrollToTop from "react-scroll-to-top";
import GlobalContext from "./pages/GlobalContext";
import i18n from "i18next";
import api from "../src/api/Axios";
import { useTranslation, initReactI18next, Trans } from "react-i18next";
import { translationsEn, translationsBn } from "../src/components/navbar/language";
import ScrollToTops from "./components/ScrollToTops/ScrollToTops";
import Wavefooter from "./components/Wavefooter/Wavefooter";
import AboutUs from "./pages/AboutUs";
import TermsCondition from "./pages/TermsCondition";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import swal from "sweetalert";
import { WindowSharp } from "@mui/icons-material";
import Contact from "./components/Contact/Contact";
import Payment from "./pages/Payment";
import ProfileTabs from "./pages/ProfileTabs";
import AddIcon from '@mui/icons-material/Add';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Container } from "@mui/system";
import VerifyCertificate from "./components/VerifyCertificate/VerifyCertificate";

const PROFILE_URL = `api/profile`;
const LEAVE_MESSAGE_URL = "/api/leaveamessage";
const USER_URL = "/api/userprofile";

function App() {
  const [fromtoken, setFromtoken] = useState(false);
  const [user, setUser] = useState("")
  const loggedin = localStorage.getItem("access_token")
  const username = localStorage.getItem("user")
  const [mode, setMode] = useState("theme");
  const [darkmode, setDarkMode] = useState(false);
  const [mail, setMail] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [leaveMessage, setLeaveMessage] = useState("")

  const [userInfo, setUserInfo] = useState({})
  const [fullname, setFullname] = useState()
  const [email, setEmail] = useState()
  const [profession, setProfession] = useState("")
  const [gender, setGender] = useState("")

  const [phonenumber, setPhonenumber] = useState();
  const [age, setAge] = useState();
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);


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
  // permanent dark theme
  // const darkTheme = createTheme({  
  //   palette: {
  //     mode: "dark",
  //     primary: {
  //       main: "#fff",
  //     },
  //     secondary: {
  //       // This is green.A700 as hex.
  //       main: "#2D2D2D",
  //     },
  //     other: {
  //       black: "#fff",
  //       white: "#fff",
  //       dark:"#000",
  //       logocolor:"#222222",
  //       footercolor:"#2D2D2D",
  //       footertext:"#fff"
  //     },
  //   },
  // });

  // test dark theme 
  const darkTheme = createTheme({
    palette: {
      // mode: "dark",
      primary: {
        main: "#F8B100",
      },
      secondary: {
        // This is green.A700 as hex.
        main: "#002054",
      },
      other: {
        black: "#fff",
        white: "#fff",
        dark: "#fff",
        logocolor: "#fff",
        footercolor: "#002054",
        footertext: "#F8B100"
      },
      background: {
        paper: "#002054"
      },
      text: {
        primary: "#F8B100",
        secondary: "F8B100"
      }
    },
  });


  const theme = createTheme(primarytheme);

  // const getUser = async () => {
  //   try {
  //     const url = `${process.env.REACT_APP_API_URL}/api/login/success`;
  //     const { data } = await api.get(url, {
  //       "Access-Control-Allow-Credentials": true,
  //       withCredentials: true,
  //     });
  //     setUser(data.user.passport.user.displayName);
  //     //// console.log(data.user.passport.user.displayName);

  //   } catch (err) {
  //     // //// console.log(err);
  //   }
  // };

  useEffect(() => {
    // getUser();

    const timer = setTimeout(() => {
      const localStorageService = LocalStorageService.getService();
      const token = localStorageService.getAccessToken();
      let flag = 1;
      if (token) {
        setUser(token);

        if (flag === 1) {
          // window.location.reload();
          flag = 0;
        }
        setFromtoken(true);
      }
    }, 2000);
    return () => clearTimeout(timer);


  }, [user]);
  //// console.log("user login",loggedin)


  useEffect(() => {
    // localStorage.setItem("theme", mode)
    if (localStorage.getItem("theme") === "theme") {
      setDarkMode(false)
    }
    else {
      setDarkMode(true)
    }



  }, [mode]);

  // let fetchData = async () => {
  //   await api
  //     .post(
  //       `${process.env.REACT_APP_API_URL}/api/sessioncheck`,
  //       JSON.stringify({ username }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         "Access-Control-Allow-Credentials": true,
  //       }
  //     )
  //     .then((data) => {
  //       // // console.log(" Testing data ----- ", data.data.result.status);

  //       if (data.data.result.status === 200) {

  //       } else if (data.data.result.status === 400 || data.data.result.status === 401) {
  //         swal("Error!", "Session ended! Please login again", "error").then(() => {
  //           localStorage.clear();

  //           //  <Navigate to="/login" />
  //         })
  //       } else {
  //         // // console.log("okay");
  //       }
  //     });
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData()
  //   }, 50000);

  //   return () => clearInterval(interval); 
  // }, [])

  return (
    <BrowserRouter>
      <ScrollToTops />
      {/* <Scrollbars style={{ 
          height: "100vh"
       }}> */}
      {/* <ThemeProvider theme={mode ? theme : darkTheme}> */}
      <ThemeProvider theme={darkmode ? theme : darkTheme}>
        <GlobalContext>
          <StepContext>
            <Paper sx={{ position: "relative" }}>

              <Offline>
                <OfflineBar />
              </Offline>
              <Offer />
              {/* <StepContext> */}
              <Navigationbar
                user={user}
                fromtoken={fromtoken}
                themestatus={setMode}
                currentstatus={mode}
                darkmode={darkmode}
              //  setlocalStorage={localStorage.setItem("theme",true)}
              //  getlocalStorage={setMode(localStorage.getItem("theme"))}

              />
              {/* </StepContext> */}
              <Routes>
                <Route exact path="/"
                  element={
                    // <StepContext>
                    <Home />
                    // </StepContext>
                  }>
                  <Route index element={<Home />} />
                </Route>
                {/* <Route path="*" element={<Error />} /> */}

                <Route
                  path="registration"
                  element={
                    user ? (
                      <Navigate to="/courses" />
                    ) : (
                      // <StepContext>
                      <Register />
                      // </StepContext>
                    )
                  }
                ></Route>
                <Route
                  path="registration/verify"
                  element={
                    // <StepContext>
                    <Verify />
                    // </StepContext>
                  }
                />

                <Route
                  path="login"
                  element={user ? <Navigate to="/courses" /> : <Login setMail={setMail} />}
                />
                <Route path="dashboard" element={<Dashboard />} />
                {/* <Route path="forgotpassword" element={<ForgotPass />} /> */}
                <Route
                  path="forgotpassword"
                  element={
                    <ForgotContext>
                      <ForgotPassword />
                    </ForgotContext>
                  }
                />
                <Route
                  path="ForgotRequestpassword"
                  element={
                    <ForgotContext>
                      <Forgot_Requestpassword />
                    </ForgotContext>
                  }
                />
                <Route
                  path="ForgotResetPassword"
                  element={
                    <ForgotContext>
                      <Forgot_ResetPassword />
                    </ForgotContext>
                  }
                />
                <Route path="courses"
                  element={
                    // <StepContext>
                    <Courses mail={mail} />
                    // </StepContext>
                  } />
                <Route path="cart" element={<Cart />} />
                <Route path="course-details" element={<CoursesDetails />} />
                <Route path="payment-info" element={<Payment />} />

                {/* //! Underconstruction */}

                <Route path="live" element={<Underconstruction />} />
                <Route path="apointment" element={<Underconstruction />} />
                <Route path="group" element={<Underconstruction />} />
                <Route path="*" element={<Error />} />

                <Route path="store" element={
                  // <StepContext>
                  <Cart />
                  // </StepContext>
                } />

                <Route
                  path="course"
                  element={user ? <Course /> : <Navigate to="/login" />}
                />
                {/* <Route path="userprofile" element={<UserProfile />} /> */}
                <Route path="userprofile" element={<ProfileTabs />} />
                <Route path="mycourses" element={<MyCourses />} />
                <Route path="paymenthistory" element={<PaymentHistory />} />
                <Route path="myfeedback" element={<MyFeedbacks />} />
                <Route path="dectivateaccount" element={<DeactivateAccount />} />
                <Route path="instructor-details" element={<InstructorDetails />} />
                <Route path="verify-certificate" element={<VerifyCertificate />} />
                {/* <Route path="coursedemo" element={<Course />} /> */}
                {/* <Route path="coursedemo" element={loggedin ? <Coursedemo /> : <Navigate to="/login" />} /> */}
                <Route path="coursedemo" element={<Coursedemo />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="refund-policy" element={<RefundPolicy />} />
                <Route path="terms-and-conditions" element={<TermsCondition />} />
              </Routes>

              {/* <Footer /> */}
             
              <Wavefooter />
            
              
              {/* <Box sx={{
                position: 'fixed',
                // top: { xs: "82%", sm: '85%', md: "88%", lg: "80%", xl: "85%" },
                top:"85%",
                // right: { xs: '7%', sm: "2%", md: "2%", lg: "2%" },
                right:"2%"
              }}> */}
                <Fab sx={{ backgroundColor: "#F8B100",position: 'fixed',bottom:"6rem", right:"2rem" }} onClick={() => {
                  handleOpen()
                }} aria-label="add">
                  {/* <SupportAgentIcon /> */}
                  <MailOutlineIcon />
                </Fab>
              {/* </Box> */}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
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
                  p: 4,
                }}>
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
                      onClick={() => handleLeaveMessage()}
                      disabled={!phonenumber}
                    >
                      Send
                    </Button>
                  </Container>
                </Box>
              </Modal>
              {/* <ProfileTabs/> */}
              <ScrollToTop smooth color="primary.main" />
              


            </Paper>
          </StepContext>
        </GlobalContext>

      </ThemeProvider>
      {/* </Scrollbars> */}
    </BrowserRouter>
  );
}

export default App;

// Added 12 sep
