import { Alert, AlertTitle,InputAdornment, Collapse, CssBaseline, IconButton, Stack } from '@mui/material';
import { Box, Container } from '@mui/system';
import {React, useState} from 'react';
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
import { multiForgotContext } from '../../pages/ForgotContext';
import {CloseIcon} from '@mui/icons-material/Close';
// import {  } from "@material-ui";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ForgotForm2 = () => {
  const [open, setOpen] = useState(true);

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
        password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus, validMatch, setValidMatch,matchFocus, setMatchFocus,
        errMsg, setErrMsg, success, setSuccess,handleSubmit,theme,
        username, setUser,matchPwd, setMatchPwd, handleSubmitNewPassword}= useContext(multiForgotContext)
  //  //// console.log(password, "this is pass")
    return (
        
            <Box>
      <Container sx={{height:"60vh"}}>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h4" variant="h5">
            Enter New Password
          </Typography>
         
          <Box component="form"  
          // onSubmit={handleSubmit} 
          noValidate sx={{ mt: 1 }}>
          
          <label htmlFor="username">

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
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password1"
              label="New Password"
              // type="password"
              //
              type={showPassword ? "text" : "password"}
              InputProps={{ // <-- This is where the toggle button is added.
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
              //
              id="password1"
              autoComplete="current-password"
              onChange={(e) => setPwd(e.target.value)}
              value={password}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
             
            />
             <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                           
                            Enter any number between 0 to 9 and at least 6 to 20 characters<br />
                        </p>
            <label htmlFor="confirm_pwd">
            </label> */}

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
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
            
                 type={showPassword2 ? "text" : "password"}
                 InputProps={{ // <-- This is where the toggle button is added.
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
                 //
              id="password2"
              autoComplete="confirm-password"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
            
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
             <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            Must match the first password input field.
                        </p> */}
  
          </Box>
          <Box>
          <Button
            variant="contained"
            color="primary"
            disabled={password==='' || password !== matchPwd}
            onClick={()=>handleSubmitNewPassword()}
            // onClick={()=>alert("jhs")}
            sx={{  mt: "6rem",mb: "30%" }}
          >
            Submit
          </Button>
          </Box>
        </Box>
        
        
      </Container>
     
    </Box>
        
    );
};

export default ForgotForm2;