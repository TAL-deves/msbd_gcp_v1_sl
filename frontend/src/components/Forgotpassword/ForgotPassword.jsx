import * as React from 'react';
// import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
// import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState, useEffect,useRef} from 'react'
import { Grid, StepLabel, TextField } from '@mui/material';
// import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import api from "../../api/Axios";
// import Regform1 from '../regform1/Regform1';
// import Regform2 from '../Regform2/Regform2';
import { useContext } from 'react';
// import Verify from '../../pages/Verify';
// import VerifyForm from '../verify/VerifyForm';

import "./ForgotPassword.css"
import Forgotform1 from '../Forgotform1/Forgotform1';
import Forgotform2 from '../Forgotform2/Forgotform2';
import { multiForgotContext } from '../../pages/ForgotContext';
import ForgetVerify from '../ForgetVerify/ForgetVerify';
// import { alignProperty } from '@mui/material/styles/cssUtils';


// const theme = createTheme();

function getSteps() {
  
  return [
    "",
    "", ""
  ];
}



const ForgotPassword = () => {
  const {validPhone,Copyright, renderer,otp, setOTP,handleSubmitForgetOTP,
    emailRef,errRef, validName, setValidName,
   userFocus, setUserFocus,validEmail, setValidEmail,
     email, setEmail,emailFocus, setEmailFocus,
    password, setPwd,validPwd, setValidPwd,pwdFocus, setPwdFocus,
     validMatch, setValidMatch,matchFocus, setMatchFocus,
    errMsg, setErrMsg, success, setSuccess,handleSubmitMailForget,handleSubmitNewPassword,theme,
    username, setUser,matchPwd, setMatchPwd, responseprop}= useContext(multiForgotContext)

  const [activeStep, setActiveStep] = useState(0);

  const steps = getSteps();

  const isStepOptional = (step) => {
    return step === 1 || step === 2 || step ===3;
  };

  const handleNext = async() => {
    await handleSubmitMailForget();
    //// console.log(responseprop.data.result.status);
    if(responseprop.data.result.status === 401){
      //// console.log("Unauthorized");
    
      
    }else if(responseprop.data.result.status === 202){
      //// console.log("moved to next page! Authorized!");
      setActiveStep(activeStep+1)
    }else{
      //// console.log("Something wrong!");
      
    }
    
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    setActiveStep(activeStep + 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
         <Forgotform1/>
        );
      case 1:   
          return (<ForgetVerify />);

      case 2:
          return( <Forgotform2 />)   ;
      default:
        return "unknown step";
    }
  }
  return (
    <div className='barwidth'>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography
                variant="caption"
                align="center"
                style={{ display: "block" }}
              >
              </Typography>
            );
          }
          
          return (
            <Step {...stepProps} key={index}>
              <StepLabel {...labelProps}>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <>
        </>
        
      ) : (
        <>
          <form>{getStepContent(activeStep)}</form>
          <div className='stepperButton'>
          <Button
           
        disabled={activeStep === 0}
            
            onClick={handleBack}
            sx={{ mr: 1, mb:5 }}
          >
            back
          </Button>          
            {activeStep === steps.length - 1 ?  
            <Button
            variant="contained"
            color="primary"
            disabled={password !== matchPwd}
            // onClick={()=>handleSubmitNewPassword()}
            onClick={()=>alert("first")}
            sx={{ mr: 1, mb: 5 }}
          >
            Submit
          </Button>
          // <></> 
          : 
          <Button
            variant="contained"
            color="primary"
           disabled={(!validPhone )} 
            // disabled={errMsg}
           
            onClick={()=>handleNext()}
            sx={{ mr: 5 , mb: 5}}
          >Next </Button>}
         </div>
          
        </>
      )}
    </div>
  );
};

export default ForgotPassword;