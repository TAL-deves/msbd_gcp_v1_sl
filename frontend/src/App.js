import { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Navigationbar from "./components/navbar/Navigationbar";
import Offer from "./components/offer/Offer";
import Courses from "./pages/Courses";
import CoursesDetails from "./pages/CoursesDetails";
import Course from "./pages/Course";
import Error from "./pages/Error";
import LocalStorageService from "./api/localstorage";
import ForgotPassword from "./pages/ForgotPassword";
import StepContext from "../src/pages/StepContext";
import Forgot_Requestpassword from "./pages/Forgot_Requestpassword";
import Forgot_ResetPassword from "./pages/Forgot_ResetPassword";
import ForgotContext from "./pages/ForgotContext";
import Cart from "./components/Cart/Cart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OfflineBar from "./components/offlinebar/OfflineBar";
import { Offline } from "react-detect-offline";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import {
  Box,
  Paper,
} from "@mui/material";
import primarytheme from "./style/style";
import MyCourses from "./pages/MyCourses";
import InstructorDetails from "./pages/InstructorDetails";
import PaymentHistory from "./pages/PaymentHistory";
import MyFeedbacks from "./pages/MyFeedbacks";
// import DeactivateAccount from "./pages/DeactivateAccount";
import Underconstruction from "./pages/Underconstruction";
import Coursedemo from "./pages/Coursedemo";
import ScrollToTop from "react-scroll-to-top";
import GlobalContext from "./pages/GlobalContext";
import ScrollToTops from "./components/ScrollToTops/ScrollToTops";
import Wavefooter from "./components/Wavefooter/Wavefooter";
import AboutUs from "./pages/AboutUs";
import TermsCondition from "./pages/TermsCondition";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./components/Contact/Contact";
import Payment from "./pages/Payment";
import ProfileTabs from "./pages/ProfileTabs";
import VerifyCertificate from "./components/VerifyCertificate/VerifyCertificate";
import SendMessage from "./components/SendMessage/SendMessage";
import Lottie from "lottie-react";
import loadingAnimation from "./assets/loadingAnimation.json";



const Home = lazy(() => import("./pages/Home"));

function App() {
  const [fromtoken, setFromtoken] = useState(false);
  const [user, setUser] = useState("");
  const [mode, setMode] = useState("theme");
  const [darkmode, setDarkMode] = useState(false);
  const [mail, setMail] = useState("");
  const [n, setN]=useState(0)

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
        footertext: "#F8B100",
      },
      background: {
        paper: "#002054",
      },
      text: {
        primary: "#F8B100",
        secondary: "F8B100",
      },
    },
  });

  const theme = createTheme(primarytheme);

  useEffect(() => {
    // localStorage.setItem("theme", mode)
    if (localStorage.getItem("theme") === "theme") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }

    const timer = setTimeout(() => {
      const localStorageService = LocalStorageService.getService();
      const token = localStorageService.getAccessToken();
      let flag = 1;
      if (token) {
        setUser(token);

        if (flag === 1) {
          flag = 0;
        }
        setFromtoken(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [user, mode]);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}>
            <Lottie
              animationData={loadingAnimation}
              style={{
                width: 200,
              }}
            />
          </Box>
        }
      >
        <ScrollToTops />
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
                />
                <Routes>
                  ¸<Route exact path="/" element={<Home n={n} setN={setN}/>}></Route>
                  <Route
                    path="registration"
                    element={user ? <Navigate to="/courses" /> : <Register />}
                  ></Route>
                  <Route path="registration/verify" element={<Verify />} />
                  <Route
                    path="login"
                    element={
                      user ? (
                        <Navigate to="/courses" />
                      ) : (
                        <Login setMail={setMail} />
                      )
                    }
                  />
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
                  <Route
                    path="courses"
                    element={
                      // <StepContext>
                      <Courses mail={mail} />
                      // </StepContext>
                    }
                  />
                  <Route path="cart" element={<Cart />} />
                  <Route path="course-details" element={<CoursesDetails />} />
                  <Route path="payment-info" element={<Payment />} />
                  {/* //! Underconstruction */}
                  <Route path="live" element={<Underconstruction />} />
                  <Route path="apointment" element={<Underconstruction />} />
                  <Route path="group" element={<Underconstruction />} />
                  <Route path="*" element={<Error />} />
                  <Route
                    path="store"
                    element={
                      // <StepContext>
                      <Cart />
                      // </StepContext>
                    }
                  />
                  <Route
                    path="course"
                    element={user ? <Course /> : <Navigate to="/login" />}
                  />
                  {/* <Route path="userprofile" element={<UserProfile />} /> */}
                  <Route path="userprofile" element={<ProfileTabs />} />
                  {/* <Route path="mycourses" element={<MyCourses />} /> */}
                  <Route path="paymenthistory" element={<PaymentHistory />} />
                  <Route path="myfeedback" element={<MyFeedbacks />} />
                  {/* <Route path="dectivateaccount" element={<DeactivateAccount />} /> */}
                  <Route
                    path="instructor-details"
                    element={<InstructorDetails />}
                  />
                  <Route
                    path="verify-certificate"
                    element={<VerifyCertificate />}
                  />
                  {/* <Route path="coursedemo" element={<Course />} /> */}
                  {/* <Route path="coursedemo" element={loggedin ? <Coursedemo /> : <Navigate to="/login" />} /> */}
                  <Route path="course-video" element={<Coursedemo />} />
                  <Route path="about" element={<AboutUs />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="refund-policy" element={<RefundPolicy />} />
                  <Route
                    path="terms-and-conditions"
                    element={<TermsCondition />}
                  />
                </Routes>
                {/* <Footer /> */}

                <Wavefooter />
                <SendMessage />
                <ScrollToTop smooth color="primary.main" />
              </Paper>
            </StepContext>
          </GlobalContext>
        </ThemeProvider>
        {/* </Scrollbars> */}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;