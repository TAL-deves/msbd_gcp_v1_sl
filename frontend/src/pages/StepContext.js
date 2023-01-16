import React from 'react';

import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import {useRef,useState, useEffect } from "react";
import api from "../api/Axios";

import {  useNavigate } from 'react-router-dom';
import swal from 'sweetalert';



//registration 
const REGISTRATION_URL = '/api/signup';

// const USER_REGEX = /^[A-z][A-z0-9-_" "]{3,50}$/;
const USER_REGEX = /^[A-z" "]{3,50}$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const PWD_REGEX = /^[0-9]{6,20}/;

const PHONE_REGEX = /^([+]8801){1}[3456789]{1}(\d){8}$/;
const PWD_REGEX = /^[A-z0-9!@#$%^&*+-:;<>?/)(_~-]{8,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const theme = createTheme();
//

//verify
// const VERIFY_URL = '/api/verify';
const RESEND_VERIFY_URL = '/api/resend-otp';

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


export const multiStepContext= React.createContext(null)
const StepContext = (props) => {

    //registration
// const userRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();
  const [registerapiresponse, setRegisterApiresponse] =useState({});
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
  const [useremail, setUseremail]=useState("");
  const [phone, setPhone] =useState('');
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [resendbtn, setResendbtn] = useState(true);

  const [backdrop, setBackdrop] = useState(false);


const phoneNumber = phone.replace(/\s/g, '');

//   useEffect(() => {
//     // userRef.current.focus();
// }, [])

// useEffect(() => {
//     // emailRef.current.focus();      
// }, [])

// useEffect(() => {
//     setValidPhone(PHONE_REGEX.test(phoneNumber));
// }, [phoneNumber])


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
}, [phoneNumber, username, email, password, matchPwd])

const navigate = useNavigate();


const handleSubmitRegistration = async (e) => {
    // //// console.log(username, email, password)
    
    // e.preventDefault();
    // if button enabled with JS hack
    let v1 = USER_REGEX.test(username);
    let v2 = PWD_REGEX.test(password);
    let v3 = EMAIL_REGEX.test(email);
    let v5= PHONE_REGEX.test(phoneNumber)
    //
     var v4=true;
    
    
  //  //// console.log(username, password, email, matchPwd)
   
    if(password !== matchPwd){
      setErrMsg("Password didn't match");
       v4=false
      // //// console.log("eta hocche v4",v4)
      // //// console.log(v4, password, matchPwd)
      // //// console.log(v1, v2, v3, v4)
      return v4;
      
    } 
   
    
    if (v1===false ) {
      setErrMsg("wrong name");
      return;
  }

  if (v5===false ) {
    setErrMsg("enter valid phone number");
    return;
}
  if(v2===false ){
    setErrMsg("Password format doesn't match");
    return;
  }
  if(v3===false){
    setErrMsg("wrong mail");
      return;
  }
  // if(v4===false){
  //   setErrMsg("");
  //     return;
  // }
    try {
        // //// console.log(user, pwd, email)
        let fullname= username;
        const response = await api.post(REGISTRATION_URL,
            JSON.stringify({ phoneNumber ,fullname, password , email, matchPwd}),
            {
                headers: { 'Content-Type': 'application/json' },
                'Access-Control-Allow-Credentials': true,
                
            }
        );   
        setBackdrop(false)
        //// console.log("registration response  ---- ", response.data.result.status)
        let errResponse = response.data.result.status
       //// console.log(errResponse)
        if(errResponse === 409){
          // navigate("/registration/verify")
          swal("Error!", `${response.data.result.errMsg}`, "error")
          // //// console.log("navigate")
        }
        else if(errResponse === 202){
          swal("Registered!", "Please complete verification", "success",{timer: 1000})
          navigate("/registration/verify")
        } else {
          swal("Error!",`${response.data.result.errMsg}`, "error")
        }
        
     //return response
   
    } catch (err) {
      
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else 
        if (err.response?.status === 409) {
            setErrMsg('Mail Taken');
            // setErrMsg()     
            //// console.log("Username Taken");
        } else{
            setErrMsg('Signup Failed');
            //// console.log("Signup Failed");
        }
        errRef.current.focus();
        //return err;
    }
    
  }

  //

  //verify

	const [otp, setOTP] = useState('')
    

      // 

       //resend verify

 
//   let email=email

  const handleSubmitResendVerify =async (event) => {
      event.preventDefault();
      const response = await api.post(RESEND_VERIFY_URL,
        JSON.stringify({ email , otp}),
        {
            headers: { 'Content-Type': 'application/json' },
            'Access-Control-Allow-Credentials': true,             
        }               
    ).then(response => {
      let data = response.result.isError
      //// console.log(data);
      setBackdrop(false)
    if(data[0] === 'Invalid OTP'){
      setErrMsg("Wrong OTP")
      //// console.log("wrong otp")
    }
    else{
      //// console.log('first')
      //  navigate("/login")   
    }})
    };

 //

 //set user obj for login
  const [userobj, setUserobj] =useState({})

  const addUserobj=(data)=>{
    setUserobj(data)
  }

 //


    return (
        <div>
            <multiStepContext.Provider value={{phoneNumber,backdrop, setBackdrop,resendbtn, setResendbtn,phone, setPhone, userobj,addUserobj,useremail, setUseremail,Copyright, renderer,otp, setOTP,
                emailRef,errRef, validName, setValidName,
                userFocus, setUserFocus,validEmail, setValidEmail,
                 email, setEmail,emailFocus, setEmailFocus,
                password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus,
                 validMatch, setValidMatch,matchFocus, setMatchFocus,
                errMsg, setErrMsg, success, setSuccess,handleSubmitRegistration,theme,
                username, setUser,matchPwd, setMatchPwd, registerapiresponse,handleSubmitResendVerify,
                validPhone, phoneFocus, setPhoneFocus
                }}>                    
                    {props.children}       
            </multiStepContext.Provider>
         </div>
    );
};

export default StepContext;