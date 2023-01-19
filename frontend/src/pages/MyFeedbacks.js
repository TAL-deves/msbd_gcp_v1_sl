import { Card, CardContent,  CircularProgress, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, {  useEffect, useState } from "react";
import api from "../api/Axios";
import swal from "sweetalert";

const REVIEWS_URL = "/api/user-reviews";

const MyFeedbacks = () => {

  const [username, setUser] = useState(localStorage.getItem("user"));
  const [reviewData, setReviewData] = useState([]);
  const [load, setLoad] = useState(true);

  let handleWatchReview = async () => {
    const response = await api.post(REVIEWS_URL, JSON.stringify({ username }), {
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Credentials": true,
    });
    // console.log("response",response)
    if (response.data.result.status === 200) {
      setReviewData(response.data.data);
      //  console.log(response.data.data, "-----------------review data")
      setLoad(false)
    }

    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
      // navigate("/login")
      // console.log("removed sesssion")
    }
  };

  useEffect(() => {
    handleWatchReview();
    //// console.log("review Data == ", reviewData)
  }, []);

  return (
    <>
     {load ? (
        <Box sx={{width:"100%"}}>
        <Container sx={{

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem",
          marginLeft:"12vw"
          
        }}>
          <CircularProgress sx={{
            color: "primary.main"
          }} />
        </Container>
        </Box>
      ) : (
      <Container>
        {!reviewData[0] ? (
          <>
            {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8NWVR_E168e_moO5Qco564gjDYHrB-oEkIGm0SpR1&s" alt="hello" /> */}
            <Typography sx={{ fontSize: "2rem" }}>No reviews available</Typography>
          </>
        ) : (
          <>
            {reviewData.map((reviews) => {
              
               let today = new Date(`${reviews.reviewDate}`);
               //let day = date.getDate();
              // console.log(day); // 23

              // let month = date.getMonth();
              // console.log(month + 1); // 8

              // let year = date.getFullYear();
              // console.log(year); // 2022
              // let dateFormat = day + "/" + month + "/" + year;
              // console.log("dateFormat",dateFormat)
              let dateMDY = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            //  console.log("dateFormat",dateMDY)
              return (
              
              

<Box sx={{margin:"1.5rem"}}>
    <Card sx={{ maxWidth: 345,
      "&:hover":{boxShadow:"5"} }} 
      // data-aos="flip-left"
      >
        <Box >
      <Typography sx={{
            fontSize: ".8rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            fontWeight:"500",
            mx:"1rem"
          }}>Course ID:{reviews.courseID}</Typography>
      <Typography sx={{
            fontSize: ".8rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            fontWeight:"500",
            mx:"1rem"
          }}>Review Date:{dateMDY}{" "}</Typography>
        </Box>
      
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom
          height="auto"
          sx={{
            fontSize: "1.1rem",
             overflow: "auto",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            fontWeight:"500",
          }}>
        "{reviews.review}"
        </Typography>
      </CardContent>
    </Card>
    </Box>
              );
            })}
          </>
        )}
      </Container>
      )}
    </>
  );
};

export default MyFeedbacks;