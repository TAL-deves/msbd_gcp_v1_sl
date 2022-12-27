import React, { useContext } from 'react'
import Banner from '../components/banner/Banner'

import HomeCourses from '../components/homeCourses/HomeCourses'
import Instructor from '../components/Instructor/Instructor'
import DownloadApp from '../components/downloadApp/DownloadApp'
import Portfolio from '../components/portfolio/Portfolio'
import ClientFeedback from '../components/clientfeedback/ClientFeedback'
// const HomeCourses=React.lazy(()=> HomeCourses('../components/homeCourses/HomeCourses'))
// const Instructor=React.lazy(()=> Instructor('../components/Instructor/Instructor'))
// const DownloadApp=React.lazy(()=> DownloadApp('../components/downloadApp/DownloadApp'))
// const Portfolio=React.lazy(()=> Portfolio('../components/portfolio/Portfolio'))
// const ClientFeedback=React.lazy(()=> ClientFeedback('../components/clientfeedback/ClientFeedback'))

// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import StepContext, { multiStepContext } from './StepContext'

const Home = () => {
  // const playerProps = { playing: true };
//   const { abc}= useContext(globalContext)
//  //// console.log(abc)
// const {
//   userRef,
//   emailRef,
//   errRef,
//   renderer,
//   otp,
//   setOTP,
//   handleSubmitVerify,
//   validName,
//   setValidName,
//   userFocus,
//   setUserFocus,
//   validEmail,
//   setValidEmail,
//   email,
//   setEmail,
//   emailFocus,
//   setEmailFocus,
//   password,
//   setPwd,
//   validPwd,
//   setValidPwd,
//   pwdFocus,
//   setPwdFocus,
//   validMatch,
//   setValidMatch,
//   matchFocus,
//   setMatchFocus,
//   errMsg,
//   setErrMsg,
//   success,
//   setSuccess,
//   handleSubmitRegistration,
//   theme,
//   username,
//   setUser,
//   matchPwd,
//   setMatchPwd,
//   registerapiresponse,
// } = useContext(multiStepContext);
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