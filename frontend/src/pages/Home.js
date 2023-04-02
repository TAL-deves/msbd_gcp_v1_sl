import React, { useContext, useEffect, useState } from 'react'
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
import { globalContext } from './GlobalContext'

const WEB_NOTIFICATION_URL = "/api/webnotification"

const Home = (props) => {
  const { language } = useContext(globalContext);
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
  let fetchData = async () => {

    await api.post(`${process.env.REACT_APP_API_URL}/api/seeallcourses`)
      // .then((res) => res.json())
      .then((data) => {
        // //// console.log(" THis is the data -----  "+data.data.data.coursesData);
        // let listOfCourse = data.data.data.coursesData;
        // let localCourseList = JSON.parse(localStorage.getItem("courselist"));
        //// console.log(localCourseList);

        let listOfCourse;
        if (localStorage.getItem("language") === "bn") {
          //  listOfCourse = data.data.data.bundleCourses.en;
          listOfCourse = data.data.data.allEnCourses;
          //// console.log("coursesbn",listOfCourse)

        }
        else {
          listOfCourse = data.data.data.allBnCourses;
        }
        let localCourseList = JSON.parse(localStorage.getItem("courselist"));

        listOfCourse.map((course) => {
          if (localCourseList !== null) {
            let localCourse = localCourseList.find(obj => obj.courseID === course.courseID)

            course["isSelected"] = localCourse !== null ? localCourse["isSelected"] : true;

          }
          else {
            course["isSelected"] = true
          }
        })
      
    // bundle courses local
        if(localStorage.getItem("courselist"))
        {
          let localCourse= localStorage.getItem("course")
        let localCourselist= localStorage.getItem("courselist")

        let newListOfCourses = localCourselist.map((obj1) => {
          let matchingObj = localCourse.filter((obj2) => obj2.id === obj1.courseID);
          return {
            ...obj1,
            isSelected: matchingObj.length > 0,
          };

        });
        localStorage.setItem("courselist",JSON.stringify(newListOfCourses))
        }
        else{
        localStorage.setItem("courselist",JSON.stringify(listOfCourse))
        }
      });
  };




  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    fetchData()
  }, [language]);
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