import React, { useEffect, useState } from 'react'
import Banner from '../components/banner/Banner'
import PopWindow from '../components/popWindow/PopWindow'
import HomeCourses from '../components/homeCourses/HomeCourses'
import Instructor from '../components/Instructor/Instructor'
import DownloadApp from '../components/downloadApp/DownloadApp'
import Portfolio from '../components/portfolio/Portfolio'
import ClientFeedback from '../components/clientfeedback/ClientFeedback'
import Subscribe from '../components/Subscribe/Subscribe'


const Home = () => {


  return (
    <>
    {/* use after ios app creation  */}
       {/* {isAndroid==="Android" || isAndroid==="iPhone"?          
          <>
            {isAndroid==="iPhone"?            
            swal("iOS app is coming soon","Thank You", "info"):
            swal("iOS app is coming soon","Thank You", "infp")
          }
          </>:<></>
         } */}
        
          
      <Banner/>
      <HomeCourses/>
      <Instructor/>
      <Portfolio/>
      <ClientFeedback/>
      <DownloadApp/>
      <Subscribe/>
    
    </>
  )
}

export default Home