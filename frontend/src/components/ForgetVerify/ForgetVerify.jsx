import  {React, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Countdown from 'react-countdown';
import api from '../../api/Axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { multiStepContext } from '../../pages/StepContext';
import { multiForgotContext } from '../../pages/ForgotContext';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Backdrop, CircularProgress, Collapse, IconButton, Stack } from '@mui/material';

const ForgetVerify = () => {
  const [open, setOpen] = useState(true);
  const [resendbtn, setResendbtn]= useState(true)
  const { backdrop,setBackdrop,renderer,otp, setOTP,handleSubmitMailForget,handleSubmitForgetOTP,handleSubmitVerify, validName, setValidName,
   userFocus, setUserFocus,validEmail, setValidEmail,
     email, setEmail,emailFocus, setEmailFocus,
    password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus,
     validMatch, setValidMatch,matchFocus, setMatchFocus,
    errMsg, setErrMsg, success, setSuccess,handleSubmitRegistration,theme,
    username, setUser,matchPwd, setMatchPwd, handleSubmitResendVerify}= useContext(multiForgotContext)

    const handleLoading=()=>{
      setBackdrop(true)
      handleSubmitForgetOTP()
    }
  return (
    <Box>
      <Container sx={{display:"flex", height:"60vh",flexDirection:"column", alignItems:"center"}}>
        
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          Verification
          </Typography>
          {errMsg?
       <Stack sx={{ width: '100%' }} spacing={2}>
      {/* <Collapse in={open}> */}
      <Alert
       severity="error"
       action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setOpen(false);
          }}
        >
          {/* <CloseIcon fontSize="inherit" /> */}
        </IconButton>
      } >
        <AlertTitle>
          Error
        </AlertTitle>
        {errMsg}
      </Alert>
      {/* </Collapse> */}
      </Stack>:""}
          <Box component="form" onSubmit={handleSubmitVerify} noValidate sx={{ mt: 1 }}>
           
            <TextField
              margin="normal"
              required
              fullWidth
              name="otp"
              label="OTP"
              type="otp"
              id="otp"
              error={errMsg}
              InputProps={{ 
                disableUnderline: true
              }}
              inputProps={{
                maxLength: 5
                
              }}
              onChange={(e) => setOTP(e.target.value)}
            />
          
            <Grid container sx={{display:'flex', alignItems:"center"}}>
              <Grid item xs>
              <Countdown 
                date={Date.now() + 180000}
                renderer={renderer}
                onComplete={()=>setResendbtn(false)}
              />
              </Grid>
              <Grid item>
               
               {/* <Button variant="contained" disabled={resendbtn} onClick={handleSubmitResendVerify} >
                  {"Resend code"}
                </Button> */}
                  <Link
                  href="/forgotpassword"
                  variant="body2"
                  onClick={handleSubmitResendVerify}
                >
                  {"Resend code"}
                </Link>
              </Grid>
            </Grid>
          
          </Box>
          
        </Box>
        <Box>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdrop}           
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        <Button
            variant="contained"
            color="primary"
            // disabled={password !== matchPwd}
            onClick={handleLoading}
            sx={{ mt: "6rem",mb: "30%" }}
          >
            Submit
          </Button>
          </Box>
      </Container>
       
    </Box>
  )
}

export default ForgetVerify