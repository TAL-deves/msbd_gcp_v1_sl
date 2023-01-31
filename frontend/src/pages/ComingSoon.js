import { Button, CardMedia, Grid, Typography } from "@mui/material";
import { Box, Container, width } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import appimage_dark from "../components/downloadApp/downloadappanimation.json";
import appleStore from "../components/downloadApp/AS.json";
import playStore from "../components/downloadApp/Ps.json";
import Link from "@mui/material/Link";
import { motion } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';
import swal from "sweetalert";
import Lottie from "lottie-react";
import { MuiTelInput } from "mui-tel-input";
import api from "../api/Axios";

const SUBSCRIBE_URL= "/api/subscribe";
const PHONE_REGEX = /^([+]8801){1}[3456789]{1}(\d){8}$/;

const ComingSoon = () => {

    const [phone, setPhone] =useState("")
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  AOS.init({ duration: 2000 });
  const style = {
    height: { xs: 320 },
    width: { xs: 320 },
    borderRadius: "50px",
    margin: "5px",

  };

  const appButtonStyle = {
    height: "70%",
    width: "100%",
    borderRadius: "50px",
    margin: "5px",
    pointer:"cursor"
  };
  const handleChange = (newPhone) => {
    setPhone(newPhone);
  }
  let phoneNumber= phone.replace(/\s/g, '');

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phoneNumber));
}, [phoneNumber])


  let handleRefer = async (e) => {
      
    const response = await api
      .post(SUBSCRIBE_URL, JSON.stringify({ phoneNumber}), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        if (data.status === 200) {
          swal("Submitted", "You will be notified", "success")
          // e.preventDefault();
          setPhone("")
          setPhoneFocus(false)
        }
      });
  };
  return (
    <Container
      sx={{
        border: "1px solid primary.main",
        boxShadow: "1px 1px 14px 1px rgba(102,102,102,0.83);",
        borderRadius: "10px",
        color: "primary.main",
        alignContent: "center",
        marginTop: "5rem"
      }}
    >
      <Box>
        <Grid
          container
          // rowSpacing={1}
          // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            // display: {md:"flex",lg:"flex", sm:"flex"},
            // flexDirection:{md:"row",lg:"row", sm:"row" },
            justifyContent: "center",
          }}
        >
          <Grid data-aos="fade-up"
            item
            lg={6}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid>
              <Typography
                gutterBottom
                sx={{
                  fontSize: "2rem",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Our iOS app is coming soon 
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {/* {t("to_take_care_of_your_health")} */}
                We are working on our iOS app, please check back within a week. Please share your mobile number so that we can update you immediately once available. Thank You.
              </Typography>
              <MuiTelInput
        sx={{ width: "100%", marginY: "1rem", color: "primary.main" }}
        label="Phone Number"
        defaultCountry="BD"
        value={phone}
        onChange={handleChange}
        required
        inputProps={{
          maxLength: 16,
        }}
        onFocus={() => setPhoneFocus(true)}
        error={
          phoneFocus && !validPhone ?
            true :
            false
        }
        helperText={phoneFocus && !validPhone ?
          "Enter valid phone number"
          : false
        }
      />
      <Button type="submit"
      fullWidth
      onClick={handleRefer}
      variant="contained"
      sx={{ mt: 3, mb: 2, fontSize: "1rem" }}>
        Submit</Button>
            </Grid>
            
          </Grid>

          <Grid data-aos="fade-up"
            item
            xs={6}
            sx={{
              // display: { md: "flex", lg: "flex", sm: "flex", xs: "none" },
              display: "flex", flexDirection: { md: "row", lg: "row", sm: "row", xs: "column" },
              justifyContent: "space-around",
            }}
          >
              <Lottie
                animationData={appimage_dark}
                style={style}
              />
             
          </Grid>
        </Grid>
      </Box>
      {/* </Grid> */}
    </Container>
  );
};

export default ComingSoon;
