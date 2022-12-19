import { Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import api from "../api/Axios";
import { multiStepContext } from "./StepContext";
import swal from "sweetalert";

const REVIEWS_URL = "/api/user-reviews";

const MyFeedbacks = () => {
  const { userobj } = useContext(multiStepContext);

  const [username, setUser] = useState(localStorage.getItem("user"));
  const [reviewData, setReviewData] = useState([]);

  let handleWatchReview = async () => {
    const response = await api.post(REVIEWS_URL, JSON.stringify({ username }), {
      headers: { "Content-Type": "application/json" },
      "Access-Control-Allow-Credentials": true,
    });
    if (response.data.result.status === 200) {
      setReviewData(response.data.data);
      //  console.log(response.data.data, "-----------------review data")
    }

    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info")
      // navigate("/login")
      window.location.href = "/login";
      // console.log("removed sesssion")
    }
  };

  useEffect(() => {
    handleWatchReview();
    //// console.log("review Data == ", reviewData)
  }, []);

  return (
    <>
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
                <Box
                  sx={{
                    border: "1px solid white",
                    borderRadius: "5px",
                    boxShadow: "1px 1px 14px 1px rgba(102,102,102,0.83);",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "5%",
                    width: "20rem",
                    margin: "5%",
                  }}
                >
                  <Typography sx={{ padding: "3%" }} variant="h5">{reviews.username}</Typography>
                  <Typography sx={{ padding: "3%" }}>
                    Course ID:{reviews.courseID} <br />
                    {/* Review Date:{reviews.reviewDate}{" "} */}
                    Review Date:{dateMDY}{" "}
                  </Typography>
                  <Typography sx={{ padding: "3%" }} variant="h6">
                    "{reviews.review}"
                  </Typography>
                </Box>
              );
            })}
          </>
        )}
      </Container>
    </>
  );
};

export default MyFeedbacks;