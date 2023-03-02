import { InputAdornment, IconButton } from '@mui/material';
import { Box, Container } from '@mui/system';
import { React, useRef, useState } from 'react';
import { useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import api from "../api/Axios"
import { multiForgotContext } from '../pages/ForgotContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import swal from 'sweetalert';
const CHANGEPASS_URL = '/api/changepassword';
const passwordRegex = /^[A-z0-9!@#$%^&*+-:;<>?/)(_~-]{8,23}$/;

export default function ChangePassword() {

    //     const [showPassword, setShowPassword] = useState(false);
    //     const [showPassword2, setShowPassword2] = useState(false);
    //     const [password, setPwd]= useState("")
    //   const handleClickShowPassword = () => setShowPassword(!showPassword);
    //   const handleMouseDownPassword = () => setShowPassword(!showPassword);

    //   const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
    //   const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
    //   const navigate = useNavigate();
    //   //

    //     //   const {
    //     //      password, setPwd,validPwd, pwdFocus, setPwdFocus, validMatch, matchFocus, setMatchFocus,
    //     //      matchPwd, setMatchPwd, setSuccess, setBackdrop, setErrMsg}= useContext(multiForgotContext)

    //          const handleSubmitpassword = async (e) => {

    //            const username= localStorage.getItem("user")


    //               const response = await api.post(RESETPASS_URL,
    //                 JSON.stringify({ username,  password }),
    //                 {
    //                   headers: { 'Content-Type': 'application/json' },
    //                   'Access-Control-Allow-Credentials': true,

    //                 }
    //               ).then((response) => {
    //                 swal("Password changed!", `Redirecting to profile`, "success", { timer: 1000 });
    //                 // setSuccess(true);
    //                 // setBackdrop(false)
    //                 navigate("/userprofile")
    //               })
    //             }

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
  
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);

    const handlepasswordChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value === confirmPassword) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        if (event.target.value === password) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    };


    const handleSubmitNewPassword = async (e) => {
        e.preventDefault()
        const username = localStorage.getItem("user")
        const response = await api.post(CHANGEPASS_URL,
            JSON.stringify({ username, password }),
            {
                headers: { 'Content-Type': 'application/json' },
                'Access-Control-Allow-Credentials': true,

            }
        ).then((response) => {
            // console.log("response", response)
            swal("Password changed!", `Redirecting to Profile page`, "success");
            setPassword("")
            setConfirmPassword("")
            
        })




    }

    return (
        <Box>
        <form onSubmit={handleSubmitNewPassword}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" , marginLeft:{md:"0rem",xl:"25rem",lg:"20rem"}}}>
                <Typography sx={{ fontSize: "2rem" }}>Change your password</Typography>
                <TextField
                    id="new-password"
                    label="New Password"
                    // type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={handlepasswordChange}
                    inputProps={{ maxLength: 23 }}
                    type={showPassword ? "text" : "password"}
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
                    required
                    error={Boolean(password) && !passwordRegex.test(password)}
                    helperText={Boolean(password) && !passwordRegex.test(password) ? 'Password must be 8-23 character' : ''}
                />
                <TextField
                    id="confirm-password"
                    label="Confirm Password"
                    // type="password"
                    variant="outlined"
                    margin="normal"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    inputProps={{ maxLength: 23 }}
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
                    required
                    error={Boolean(confirmPassword) && confirmPassword !== password}
                    helperText={Boolean(confirmPassword) && confirmPassword !== password ? 'Passwords do not match' : ''}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitDisabled}
                >
                    Submit
                </Button>
            </Box>
        </form>
        </Box>
    )
}
