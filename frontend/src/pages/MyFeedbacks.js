import { Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import api from "../api/Axios";
import { multiStepContext } from "./StepContext";

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
      // console.log(response.data.data, "-----------------review data")
    }
  };

  useEffect(() => {
    handleWatchReview();
    //// console.log("review Data == ", reviewData)
  }, []);

  return (
    <>
      <Container>
        {!reviewData ? (
          <>
            {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8NWVR_E168e_moO5Qco564gjDYHrB-oEkIGm0SpR1&s" alt="hello" /> */}
            <Typography sx={{fontSize:"2rem"}}>No reviews available</Typography>
          </>
        ) : (
          <>
            {reviewData.map((reviews) => {
              // console.log(reviews, "mapped review")
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
                    width:"100%",
                    margin: "5%",
                  }}
                >
                  <Typography variant="h5">{reviews.username}</Typography>
                  <Typography>
                    Course ID:{reviews.courseID} <br />
                    Review Date:{reviews.reviewDate}{" "}
                  </Typography>
                  <Typography sx={{ padding: "3%" }} variant="h6">
                    {reviews.review}
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