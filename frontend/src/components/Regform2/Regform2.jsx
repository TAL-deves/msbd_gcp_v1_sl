import { Alert, AlertTitle, Collapse,InputAdornment, CssBaseline, IconButton, Stack } from '@mui/material';
import { Box, Container } from '@mui/system';
import React from 'react';
import { useContext, useState } from 'react';
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
// import "./Regform2.css";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {Link as Routerlink} from "react-router-dom";

const Regform2 = () => {
  const [open, setOpen] = React.useState(true);
  //to show pass
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

const handleClickShowPassword = () => setShowPassword(!showPassword);
const handleMouseDownPassword = () => setShowPassword(!showPassword);

const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);

//
    const {userRef, 
        emailRef,errRef, validName, setValidName,
       userFocus, setUserFocus,validEmail, setValidEmail,
         email, setEmail,emailFocus, setEmailFocus,
        password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus,
         validMatch, setValidMatch,matchFocus, setMatchFocus,
        errMsg, setErrMsg, success, setSuccess,handleSubmit,theme,
        username, setUser,matchPwd, setMatchPwd}= useContext(multiStepContext)
   
    return (
        // <div>
            
      <Container component="main" maxWidth="xs">
        {/* <CssBaseline /> */}
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
            Sign Up
          </Typography>

      {errMsg?
       <Stack sx={{ width: '100%' }} spacing={2}>
      <Collapse in={open}>
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
          <CloseIcon fontSize="inherit" />
        </IconButton>
      } >
        <AlertTitle>
          Error
        </AlertTitle>
        {errMsg}
      </Alert>
      </Collapse>
      </Stack>:""}
          <Box component="form"  onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>          */}
          <label htmlFor="username">

                            {/* <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} /> */}
                       </label>
 
           <label htmlFor="password">
                   
            </label>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password1"
              label="Password"
              // type="password"
              
              autoComplete="current-password"
              //
              type={showPassword ? "text" : "password"}
              id="password1"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>

                )
              }}
              inputProps={{maxLength: 20}}
              //
              onChange={(e) => setPwd(e.target.value)}
               
              value={password}
              onFocus={() => setPwdFocus(true)}
              // onBlur={() => setPwdFocus(false)}
              error={
                pwdFocus && !validPwd ? 
                true : 
                false
              }
              helperText={pwdFocus && !validPwd?
                "Enter password between 8 to 20 characters"
                : false
              }
            />
             {/* <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                           
                            Enter any number between 0 to 9 and at least 6 to 20 characters<br />
                        </p> */}
            <label htmlFor="confirm_pwd">
                            {/* <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} /> */}
            </label>
            <TextField
            // autoFocus
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
               //
              type={showPassword2 ? "text" : "password"}
              
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                      onMouseDown={handleMouseDownPassword2}
                    >
                      {showPassword2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>

                )
              }}
              inputProps={{maxLength: 20} && {minLength:8}}
              //
            
              autoComplete="confirm-password"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
            
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              // onBlur={() => setMatchFocus(false)}
              error={
                matchFocus && !validMatch ? 
                true : 
                false
              }
              helperText={
                matchFocus && !validMatch ? 
                "Must match the first password input field." : 
                false                
              }
            />
             {/* <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                           
                            Must match the first password input field.
                        </p> */}
  
            <Grid container>
              <Grid item xs>                
              </Grid>
              <Grid item>
                <Routerlink to="/login" style={{textDecoration:"none"}} >
                  <Typography sx={{color:"primary.main"}}>{"Already have an account? Login here"}
                  </Typography>
                </Routerlink>    
              </Grid>
            </Grid>
          </Box>
        </Box>
        
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
      
    // </ThemeProvider>
    //     </div>
    );
};

export default Regform2;