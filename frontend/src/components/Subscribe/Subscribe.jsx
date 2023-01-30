import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'
import React, { useContext, useEffect } from 'react'
import { multiStepContext } from '../../pages/StepContext';
import api from "../../api/Axios";
import swal from 'sweetalert';
import newsletter from "./newsletter.json"
import Lottie from "lottie-react";
import { Container } from '@mui/system';
import { globalContext } from '../../pages/GlobalContext';
import { useState } from 'react';

const PHONE_REGEX = /^([+]8801){1}[3456789]{1}(\d){8}$/;

const SUBSCRIBE_URL= "/api/subscribe"

export default function Subscribe() {
  const [phone, setPhone] =useState("")
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  let username = localStorage.getItem("user")
  const {
    validEmail,
    email,
    setEmail,
    emailFocus,
    setEmailFocus,
    // phoneNumber,
    // phone, 
    // setPhone,
  } = useContext(multiStepContext);
  const { t } = useContext(globalContext);

  const handleChange = (newPhone) => {
    setPhone(newPhone);
  }
  let phoneNumber= phone.replace(/\s/g, '');

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phoneNumber));
}, [phoneNumber])

  const style = {
     height: "70%",
     width: "70%",
    // borderRadius: "50px",
    marginLeft:"3rem",
   
  };

  // subscribe api
  let handleSubscribe = async (e) => {
   
    const response = await api
      .post(SUBSCRIBE_URL, JSON.stringify({ phoneNumber, email}), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((data) => {
        if (data.status === 200) {
          swal("Subscribed", "You will get updates of our platform from now on", "success")
          // e.preventDefault();
          setPhone("")
          setEmail("")
          setPhoneFocus(false)
        }
      });

  };

    // refer api
    let handleRefer = async (e) => {
      
      const response = await api
        .post(SUBSCRIBE_URL, JSON.stringify({ phoneNumber}), {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        })
        .then((data) => {
          if (data.status === 200) {
            swal("Refered", "You friend will get invitation through SMS", "success")
            // e.preventDefault();
            setPhone("")
            setPhoneFocus(false)
          }
        });
    };



  return (
    <Box  sx={{margin:"5%"}}>
      <Container>
      <Grid container sx={{display:"flex", alignItems:"center"}}>
        <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box>
           <Lottie
          animationData={newsletter}
          style={style}  
        />
        </Box>
        </Grid>
        <Grid  xs={12} sm={6} md={6} lg={6} xl={6}>
        <Box sx={{textAlign:"center"}}>
         {username? 
           <>
           <Typography sx={{fontSize:"1.6rem", fontWeight:"800", color:"primary.main"}}>{t("refer")}</Typography>
           {/* <Typography sx={{fontSize:"1.3rem", fontWeight:"400", color:"primary.main"}}>to your friends</Typography> */}
           </>:
         <>
      <Typography sx={{fontSize:"1.6rem", fontWeight:"800", color:"primary.main"}}>{t("subscribe")}</Typography>
      <Typography sx={{fontSize:"1.3rem", fontWeight:"400", color:"primary.main"}}>{t("to_get_all_updates")}</Typography>
      </>}
      </Box>
      
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
      {username?<></>:
      <>
     <Typography sx={{textAlign:"center", color:"primary.main"}}>{t("or")}</Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        // error={errMsg}
        autoComplete="email"
        // autoFocus
        value={email}
        InputProps={{
          disableUnderline: true,
        }}
        inputProps={{
          maxLength: 320,
        }}
        onChange={(e) =>
          setEmail(e.target.value)}
        // aria-describedby="uidnote"
        onFocus={() => setEmailFocus(true)}
        // onBlur={() => setEmailFocus(false)}
        error={emailFocus && email && !validEmail ? true : false}
        helperText={
          emailFocus && email && !validEmail
            ? "Please provide a valid email"
            : ""
        }
      />
      </>}
      {username?
      <Button
      type="submit"
      fullWidth
      onClick={handleRefer}
      variant="contained"
      sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
      disabled={!validPhone}
    >
      {t("refer_button")}
    
  </Button>:
       <Button
            type="submit"
            fullWidth
            onClick={handleSubscribe}
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
            disabled={!validEmail && !validPhone}
          >
            {t("subscribe")}
           
        </Button>}
        </Grid>
        </Grid>
        </Container>
    </Box>
  )
}
