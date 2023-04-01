import React, { useEffect, useState } from 'react'
import Banner from '../components/banner/Banner'
import PopWindow from '../components/popWindow/PopWindow'
import HomeCourses from '../components/homeCourses/HomeCourses'
import Instructor from '../components/Instructor/Instructor'
import DownloadApp from '../components/downloadApp/DownloadApp'
import Portfolio from '../components/portfolio/Portfolio'
import ClientFeedback from '../components/clientfeedback/ClientFeedback'
import Subscribe from '../components/Subscribe/Subscribe'
import api from "../api/Axios"
import Faq from '../components/Faq/Faq'
import BundleCourses from '../components/BundleCourses/BundleCourses'

const WEB_NOTIFICATION_URL = "/api/webnotification"

const Home = (props) => {
  
  // const [webNotificationData, setWebNotificationData]= useState({})
  // let handleWebNotification = async () => {       
  //   await api.post(WEB_NOTIFICATION_URL, JSON.stringify({ }), {
  //       headers: { "Content-Type": "application/json" },
  //       "Access-Control-Allow-Credentials": true,
  //     })
  //     .then((data) => {
  //       setWebNotificationData(data.data.data[0])
  //       // console.log(data.data.data[0])
  //     });
     
  // };

  // useEffect(()=>{
  //   handleWebNotification()
    
  // },[])
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);
  return (
    <>
          
      <Banner/>
      {/* {props.n===0?
      <>
      {webNotificationData.read || !webNotificationData ?
      <PopWindow n={props.n} setN={props.setN} webNotificationData={webNotificationData}/>:<></>}</>:<></>} */}
      <HomeCourses/>
      <BundleCourses/>
      <Instructor/>
      <Portfolio/>
      <ClientFeedback/>
      <DownloadApp/>
      <Subscribe/>
      {/* <Faq/> */}
    </>
  )
}

export default Home