import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'
import React, { useContext } from 'react'
import { multiStepContext } from '../../pages/StepContext';
import api from "../../api/Axios";
import swal from 'sweetalert';
import newsletter from "./newsletter.json"
import Lottie from "lottie-react";
import { Container } from '@mui/system';
import { globalContext } from '../../pages/GlobalContext';


const SUBSCRIBE_URL= "/api/subscribe"

export default function Subscribe() {
  const {
    validEmail,
    email,
    setEmail,
    emailFocus,
    setEmailFocus,phoneNumber,
    phone, setPhone, validPhone, phoneFocus, setPhoneFocus
  } = useContext(multiStepContext);
  const { t } = useContext(globalContext);

  const handleChange = (newPhone) => {
    setPhone(newPhone);
    // //// console.log(phone)
  }

  const style = {
     height: "70%",
     width: "70%",
    // borderRadius: "50px",
    marginLeft:"3rem",
   
  };

  // subscribe api
  let handleSubscribe = async (e) => {
    // let phoneNumber= phone
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
     

    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
      // navigate("/login")
      // console.log("removed sesssion")
    }
    // e.preventDefault();
    //// console.log("response", response);
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
      <Typography sx={{fontSize:"1.6rem", fontWeight:"800", color:"primary.main"}}>{t("subscribe")}</Typography>
      <Typography sx={{fontSize:"1.3rem", fontWeight:"400", color:"primary.main"}}>{t("to_get_all_updates")}</Typography>
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
       <Button
            type="submit"
            fullWidth
            onClick={handleSubscribe}
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
            disabled={!validEmail && !validPhone}
          >
            {t("subscribe")}
           
        </Button>
        </Grid>
        </Grid>
        </Container>
    </Box>
  )
}
