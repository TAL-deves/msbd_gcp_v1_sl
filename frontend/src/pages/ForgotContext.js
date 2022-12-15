import React from 'react';
import RegisterForm from '../components/register/RegisterForm';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box'; 
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {useRef,useState, useEffect } from "react";
import api from "../api/Axios";
import Regform1 from '../components/regform1/Regform1';
import Regform2 from '../components/Regform2/Regform2';
import { Modal } from '@mui/material';
import ForgotPassword from '../components/Forgotpassword/ForgotPassword';
import swal from 'sweetalert';

//forget password 
const FORGOTPASSWORD_URL = '/api/forget-password';
// const REQUESTPASS_URL= '/api/verify';
const REQUESTPASS_URL= '/api/request-password';
const RESETPASS_URL= '/api/reset-password';
const RESEND_VERIFY_URL = '/api/resend-otp-forgotpassword';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// const PHONE_REGEX = /^[0-9+]{14,15}/;
const PHONE_REGEX = /^[0-9+]{14,15}/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^[A-z0-9!@#$%^&*+-:;<>?/)(_~-]{8,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const theme = createTheme();
//

//verify
// const VERIFY_URL = '/api/verify';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.techanalyticaltd.com/" target={"_blank"}>
          Tech Analytica Limited
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  // Random component
const Completionist = () => <span>Code expired!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};
  
//



export const multiForgotContext= React.createContext()
const ForgotContext = (props) => {

    //registration
const userRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();

  const [username, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [responseprop, setReponseprop] =useState({});
  const [phone, setPhone] =useState('');
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [backdrop, setBackdrop] = useState(false);



const phoneNumber = phone.replace(/\s/g, '');



  useEffect(() => {
    // userRef.current.focus();
}, [])

useEffect(() => {
    // emailRef.current.focus();      
}, [])

useEffect(() => {
    setValidName(USER_REGEX.test(username));
}, [username])


useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
}, [email])

useEffect(() => {
  setValidPhone(PHONE_REGEX.test(phoneNumber));
}, [phoneNumber])

useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd);
}, [password, matchPwd])

useEffect(() => {
  setErrMsg('');
}, [username,email, password, matchPwd])

const navigate = useNavigate();

//mail
const handleSubmitMailForget = async (e) => {
    // //// console.log(username, email, password)
    
    // e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    const v3 = EMAIL_REGEX.test(email);
    // if ( !v2 ) {
    //     setErrMsg("Invalid Entry");
    //     return;
    // }
    try {
        // //// console.log(user, pwd, email)
        const response = await api.post(FORGOTPASSWORD_URL,
            JSON.stringify({ phoneNumber}),
            {
                headers: { 'Content-Type': 'application/json' },
                'Access-Control-Allow-Credentials': true,
                
            }
        ).then((res)=>{
          //// console.log("the response is ----- ", res);
          let statusCode = res.data.result.status
          setBackdrop(false)
          if (statusCode === 404) {
            swal("Error!", `${res.data.result.errMsg}`, "error")
          } else if (statusCode === 202) {
            swal("OTP sent!", "Please verify the OTP", "success", {timer:2000})
            navigate("/ForgotRequestpassword")
          } else if (statusCode === 403) {
            swal(`${res.data.data}`, "Please contact our support","warning")
          } else{
            swal("Error!", `${res.data.result.errMsg}`, "error")
          }
        })   
    
    } catch (err) {
      swal("Error!", "Server is busy, please try again later", "error")
    }
  }

  //

  //otp
	const [otp, setOTP] = useState('')
    const handleSubmitForgetOTP =async (event) => {
    

      const response = await api
      .post(REQUESTPASS_URL, JSON.stringify({ phoneNumber, otp }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((response) => {
        let data = response.data.result.status;
        let dataMsg = response.data.data;
        setBackdrop(false);
        if (data === 406) {
          setErrMsg("Invalid OTP");
          swal("Invalid OTP", `Please check again`, "error");
        } else if (data === 404) {
          setErrMsg("User not found");
          swal("Error", `User not found!`, "error");
        } else {
          swal("Success", `${dataMsg}, You will be redirected to next page`, "success", {timer: 1000});
          navigate("/ForgotResetPassword") 
        }
      });

      };

      //

 //new and confirm password

const handleSubmitNewPassword = async (e) => {

  // const v1 = USER_REGEX.test(username);
  // const v2 = PWD_REGEX.test(password);
  // const v3 = EMAIL_REGEX.test(email);
  // if (!v3) {
  //     setErrMsg("Invalid Entry");
  //     return;
  // }
  try {
      // //// console.log(user, pwd, email)
      const response = await api.post(RESETPASS_URL,
          JSON.stringify({ phoneNumber, otp, password}),
          {
              headers: { 'Content-Type': 'application/json' },
              'Access-Control-Allow-Credentials': true,
              
          }
      ).then((response)=>{
        swal("Password changed!", `Redirecting to login page`, "success", {timer: 1000});
        setSuccess(true);
        setBackdrop(false)
        navigate("/login")
      })   
  //     //// console.log(response)     
    
  //     setSuccess(true);
  //     //clear state and controlled inputs
  //     //need value attrib on inputs for this
  //     // setUser('');
  //     // setEmail('');
  //     // setPwd('');
  //     // setMatchPwd('');
  // navigate("/login")

  } catch (err) {
      if (!err?.response) {
          setErrMsg('No Server Response');
         
      } else if (err.response?.status === 409) {
          setErrMsg('Mail Taken');
          // setErrMsg();
          //// console.log("Username Taken");
      } else{
          setErrMsg('Signup Failed');
          //// console.log("Signup Failed");
      }
      errRef.current.focus();
  }

  
}
 //

 //   resend otp

 const handleSubmitResendVerify =async (event) => {
  event.preventDefault();

const response = await api
      .post(RESEND_VERIFY_URL, JSON.stringify({ phoneNumber, otp }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((response) => {
        //// console.log(response.data.data);
        let data = response.data.result.status
        setBackdrop(false)
        if(data === 302){
          swal("OTP sent!", `Please verify to continue, ${response.data.data} try left`, "warning")
        } else if(data === 406){
          swal("Account locked for too many otp retry!", `Please contact support`, "error")
          .then(()=>{
            // window.location.href = "/login"
          })
        } else {
          swal("Account locked for too many otp retry!", `Please contact support`, "error")
          .then(()=>{
            // window.location.href = "/login"
          })
        }
      });

};

//
    
    return (
        <div>
            <multiForgotContext.Provider value={{backdrop,setBackdrop,setPhone,setPhoneFocus,phone, phoneFocus,validPhone,phoneNumber,responseprop, Copyright, renderer,otp, setOTP,handleSubmitForgetOTP,
                emailRef,errRef, validName, setValidName,
               userFocus, setUserFocus,validEmail, setValidEmail,
                 email, setEmail,emailFocus, setEmailFocus,
                password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus,
                 validMatch, setValidMatch,matchFocus, setMatchFocus,
                errMsg, setErrMsg, success, setSuccess,handleSubmitMailForget,handleSubmitNewPassword,theme,
                username, setUser,matchPwd, setMatchPwd, handleSubmitResendVerify
                }}>
                    
                 {props.children}
                 
            </multiForgotContext.Provider>
         </div>
    );
};

export default ForgotContext;