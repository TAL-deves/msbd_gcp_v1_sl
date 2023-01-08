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
  const [n, setN]=useState(0)


  return (
    <>
    
    {/* {n===0 ?
      <PopWindow n={n} setN={setN}/>:<></>} */}
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