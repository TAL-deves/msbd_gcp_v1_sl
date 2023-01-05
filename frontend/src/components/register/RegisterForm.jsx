import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect, useRef } from "react";
import {
  Backdrop,
  CircularProgress,
  Grid,
  Modal,
  StepLabel,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import api from "../../api/Axios";
import Regform1 from "../regform1/Regform1";
import Regform2 from "../Regform2/Regform2";
import { useContext } from "react";
import { multiStepContext } from "../../pages/StepContext";
import Verify from "../../pages/Verify";
import VerifyForm from "../verify/VerifyForm";
// import "./Register.css";
import { Container } from "@mui/system";
import swal from "sweetalert";
import { globalContext } from "../../pages/GlobalContext";

const theme = createTheme();

function getSteps() {
  return ["", ""];
} 

const RegisterForm = () => {
  const {backdrop, setBackdrop,
    userRef,
    emailRef,
    errRef,
    renderer,
    otp,
    setOTP,
    handleSubmitVerify,
    validName,
    setValidName,
    userFocus,
    setUserFocus,
    validEmail,
    setValidEmail,
    email,validPhone,
    setEmail,
    emailFocus,
    setEmailFocus,
    password,phoneNumber,
    setPwd,
    validPwd,
    setValidPwd,
    pwdFocus,
    setPwdFocus,
    validMatch,
    setValidMatch,
    matchFocus,
    setMatchFocus,
    errMsg,
    setErrMsg,
    success,
    setSuccess,
    handleSubmitRegistration,
    theme,
    username,
    setUser,
    matchPwd,
    setMatchPwd,
    registerapiresponse,
  } = useContext(multiStepContext);
  const { t } = useContext(globalContext)
  const [verify, setVerify] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [popup, setPopup] = useState();


  const handleLoadingSubmitRegistation=()=>{
    setBackdrop(true)
    handleSubmitRegistration()
  }
  const handleLoadingNext=()=>{
    setBackdrop(true)
    handleNext()
  }
  const steps = getSteps();
 
  const USERCHECK_URL = '/api/checkuser';

  // setPopup( <Modal
  //   open={open}
  //   onClose={handleClose}
  //   aria-labelledby="modal-modal-title"
  //   aria-describedby="modal-modal-description"
  //   // sx={containerStyle}
  // >
  //   {errMsg}
  // </Modal>)

  const handleNext = async () => {
    // setActiveStep(activeStep + 1);
    const response = await api.post(USERCHECK_URL,
      JSON.stringify({ email, username, phoneNumber}),
      {
          headers: { 'Content-Type': 'application/json' },
          'Access-Control-Allow-Credentials': true,
          
      }
  );   
  setBackdrop(false);
  
  let errResponse = response.data.result.status
  if(errResponse === 409){
    swal("Error!", `${response.data.result.errMsg}`, "error")
  } 
  else if(errResponse === 500){
    swal("Error!", `${response.data.result.errMsg}`, "error")
  }
  else {
    setActiveStep(activeStep + 1);
    
  }
  
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Box>
            <Regform1 />{" "}
          </Box>
        );

      case 1:
        return <Regform2 />;

      //  return <VerifyForm />;

      default:
        return "unknown step";
    }
  }

  return (
    <Box>
      <Container sx={{mt:"2rem"}}>
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((step, index) => {
            const labelProps = {};
            const stepProps = {};
            return (
              <Step {...stepProps} key={index}>
                <StepLabel {...labelProps}>{step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <>
            <CircularProgress />
          </>
        ) : (
          <>
            <form>{getStepContent(activeStep)}</form>
            {/* {( verify =><VerifyForm key={verify.email} verify={verify}></VerifyForm>)} */}
            <div className="stepperButton">
              <Button
                onClick={handleBack}
                // sx={{paddingLeft: "20%"}}
                disabled={activeStep === 0 || activeStep === 2}
                sx={{ mr: 1, mb: 5 }}
              >
                {t("back")}
              </Button>
              {/* && registerapiresponse !== null &&
            registerapiresponse?.result?.isError === false */}
              {activeStep === 1 ? (
                  <><Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={backdrop}
                 
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <Button
                  // className={classes.button}
                  variant="contained"
                  disabled={password === "" || password !== matchPwd}
                  onClick={handleLoadingSubmitRegistation} 
                  sx={{ mr: 1, mb: 5 }}
                >
                  Submit
                </Button></>
              ) : (
                <><Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdrop}
               
              >
                <CircularProgress color="inherit" />
              </Backdrop>
                <Button
                  // className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={!validEmail || !validName || !validPhone}
                  // disabled={errMsg}
                  onClick={()=>{handleLoadingNext()}}
                  sx={{ mr: 5, mb: 5 }}
                >
                  {/* Next{" "} */}
                  {t("next")}
                </Button></>
              )}
            </div>
          </>
        )}
      </Container>
    </Box>
  );
};

export default RegisterForm;
