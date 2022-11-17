import React, { useContext } from 'react'
import Banner from '../components/banner/Banner'
import VideoPlayer from '../components/videoPlayer/VideoPlayer'
import Player from '../components/Player/Player'
import PopWindow from '../components/popWindow/PopWindow'
import HomeCourses from '../components/homeCourses/HomeCourses'
import Instructor from '../components/Instructor/Instructor'
import DownloadApp from '../components/downloadApp/DownloadApp'
import Portfolio from '../components/portfolio/Portfolio'
import ClientFeedback from '../components/clientfeedback/ClientFeedback'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CourseSlider from '../components/CourseSlider/CourseSlider'
import StepContext, { multiStepContext } from './StepContext'
import GlobalContext, { globalContext } from './GlobalContext'

const Home = () => {
  const playerProps = { playing: true };
//   const { abc}= useContext(globalContext)
//  //console.log(abc)
const {
  userRef,
  emailRef,
  errRef,
  renderer,
  otp,
  setOTP,
  handleSubmitVerify,
  validName,
  setValidName,
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
  handleSubmitRegistration,
  theme,
  username,
  setUser,
  matchPwd,
  setMatchPwd,
  registerapiresponse,
} = useContext(multiStepContext);
  return (
    <>
      <Banner/>
      {/* <Player {...playerProps}/> */}
      <HomeCourses/>
      <Instructor/>
      <Portfolio/>
      <ClientFeedback/>
      <DownloadApp/>
    </>
  )
}

export default Home