import { Alert, AlertTitle, Collapse, CssBaseline, IconButton, Stack } from '@mui/material';
import { Box, Container } from '@mui/system';
import {React,useState} from 'react';
import { useContext } from 'react';
import { multiStepContext } from '../../pages/StepContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import "./Forgotform1.css";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { multiForgotContext } from '../../pages/ForgotContext';
import CloseIcon from '@mui/icons-material/Close';
import primarytheme from '../../style/style';
import { MuiTelInput } from 'mui-tel-input';

const Forgotform1 = () => {
  const [open, setOpen] = useState(true);
    const {userRef, 
        emailRef,errRef, validName, setValidName,
       userFocus, setUserFocus,validEmail, setValidEmail,
         email, setEmail,emailFocus, setEmailFocus,
        password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus,
         validMatch, setValidMatch,matchFocus, setMatchFocus,
        errMsg, setErrMsg, success, setSuccess,handleSubmit,theme,
        username, setUser,matchPwd, setMatchPwd, handleSubmitForgetOTP,handleSubmitMailForget, phoneNumber,setPhoneFocus,phone, phoneFocus,validPhone,setPhone}= useContext(multiForgotContext)


        const handleChange = (newPhone) => {
          setPhone(newPhone);
          // //console.log(phone)
        }
        return (
        <Box >
            {/* <ThemeProvider theme={theme}> */}
      <Container sx={{height:"60vh",display:"flex", flexDirection:"column",alignItems:"center" }}>
      
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
            Enter Your Phone Number
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
          <Box component="form"  onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <label htmlFor="username">
           </label>
             
              <label htmlFor="email">              
              </label>
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              
              autoComplete="email"
              autoFocus
              value={email}
              // color="primary.main"
              onChange={(e) => setEmail(e.target.value)}
              error={errMsg}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              
            />
             <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            Please provide a valid email<br /></p> */}

          <MuiTelInput 
            sx={{width:"100%", marginY:"1rem", color:"blue"}} 
            label="Phone Number"
            defaultCountry="BD" 
            // autoFocus
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
            helperText={phoneFocus && !validPhone?
              "Enter valid phone number"
              : false
            }
            />
           
            <Grid container>
              <Grid item xs>
                
              </Grid>
              <Grid item>
              
                
              </Grid>
            </Grid>
          </Box>
          
     
        </Box>
        <Button
            variant="contained"
            color="primary"
            disabled={password !== matchPwd}
            onClick={handleSubmitMailForget}
            sx={{ mt: "6rem",mb: "30%" }}
          >
            Submit
          </Button>
      </Container>
     
    {/* </ThemeProvider> */}
        </Box>
    );
};

export default Forgotform1;