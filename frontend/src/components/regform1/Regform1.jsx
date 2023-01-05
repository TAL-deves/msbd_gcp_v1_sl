import {
  Alert,
  AlertTitle,
  Backdrop,
  CircularProgress,
  Collapse,
  
  IconButton,
  Stack,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { React, useState } from "react";
import { useContext } from "react";
import { multiStepContext } from "../../pages/StepContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import CloseIcon from "@mui/icons-material/Close";
import { MuiTelInput } from "mui-tel-input";
import {Link as Routerlink} from "react-router-dom";
import { globalContext } from "../../pages/GlobalContext";



const Regform1 = () => {
  const {    
    validName,
    userFocus,
    setUserFocus,
    validEmail,
    email,
    setEmail,
    emailFocus,
    setEmailFocus,    
    errMsg,    
    handleSubmit,    
    username,
    setUser,
    phone, setPhone,validPhone, phoneFocus,setPhoneFocus
  } = useContext(multiStepContext);

   const { t } = useContext(globalContext)

  const [open, setOpen] = useState(true);
  const [backdrop, setBackdrop] = useState(false);
  
  // const googleAuth = () => {
  //   window.open(
  //     `${process.env.REACT_APP_API_URL}/api/google/callback`,
  //     "_self"
  //   );
  // };
  // const facebookAuth = () => {
  //   window.open(
  //     `${process.env.REACT_APP_API_URL}/api/facebook/callback`,
  //     "_self"
  //   );
  // };

  const googleAuth = () => {
    // window.open(
    //   `${process.env.REACT_APP_API_URL}/api/google`,
    //   "_self"   );
    window.open(
      `${process.env.REACT_APP_API_URL}/api/google`,
      "",
      "toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no,top=400, left=500, width=620,height=575"
      );
      setBackdrop(true) 
  };
  const facebookAuth = () => {
    // window.open(
    //   `${process.env.REACT_APP_API_URL}/api/facebook/callback`,
    //   "_self" );
    setBackdrop(true) 
    window.open(
      `${process.env.REACT_APP_API_URL}/api/facebook/callback`,
      "",
      "toolbar=no,menubar=no,location=no,scrollbars=no,resizable=no,top=400, left=500, width=620,height=575"
    );
  };

  // mui telnet
  const handleChange = (newPhone) => {
    setPhone(newPhone);
    // //// console.log(phone)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
        // maxWidth="xs"
      >
        {/* <CssBaseline /> */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("sign_up")}
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "70%", lg: "50%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Grid
            container
            // className="SocialContainer"
            // xs={12} lg={8} md={10} xl={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Grid item xs >
              <Typography sx={{ textAlign:"center", color:"var(--black)" }} mt={2}>Or sign in with social accounts</Typography>
            </Grid> */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                display: "flex",
                flexDirection: "row",
                bgcolor: "primary.main",
              }}
              onClick={googleAuth}
            >
              {/* <Link target={"_blank"} style={{display:"flex", flexDirection:"row", alignItems:'center', justifyContent:"center", paddingRight:"10px"}}> */}
              <GoogleIcon
                // className="Icons"
                sx={{
                  color: "other.dark",
                  fontSize: "2rem",
                  margin: "0px 10px",
                }}
              />
              <Typography sx={{ color: "other.dark", fontSize: "1rem" }}>
                {t("sign_up_with_google")}
              </Typography>
              {/* </Link> */}
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 1,
                display: "flex",
                flexDirection: "row",
                bgcolor: "primary.main",
              }}
              onClick={facebookAuth}
            >
              <FacebookIcon
                // className="Icons"
                sx={{
                  color: "other.dark",
                  fontSize: "2rem",
                  margin: "0px 10px",
                }}
              />
              <Typography sx={{ color: "other.dark", fontSize: "1rem" }}>
              {t("sign_up_with_facebook")}
              </Typography>
            </Button>

            <Typography component="p" variant="p" sx={{ textAlign: "center" }}>
            {t("or")} <br />
            {t("sign_up_with_email")}
            </Typography>
          </Grid>
          {errMsg ? (
            <Stack sx={{ width: "100%" }} spacing={2}>
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
                  }
                >
                  <AlertTitle>Error</AlertTitle>
                  {errMsg}
                </Alert>
              </Collapse>
            </Stack>
          ) : (
            ""
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >

            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>          */}
            <label htmlFor="username">
              {/* <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} /> */}
            </label>

            {/* MUI phone added */}
            <MuiTelInput 
            sx={{width:"100%", marginY:"1rem", color:"primary.main"}} 
            label={t("phone")}
            defaultCountry="BD" 
            //  autoFocus
            value={phone} 
            onChange={handleChange} 
            required
            inputProps={{
              maxLength: 16,
              // minLength:12
            }}
            onFocus={() => setPhoneFocus(true)}
            error={
              phoneFocus && !validPhone ? 
              true : 
              false
            }
            helperText={phoneFocus && !validPhone?
              "Enter valid Bangladeshi phone number"
              : false
            }
            />
            {/* <TextField 
            sx={{width:"100%", marginY:"1rem", color:"blue"}} 
            label="Phone Number"
            //  country="BD"
            // defaultValue="880"
            value={phone}
            onChange={handleChange} 
            required
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
            /> */}

           
            
            <TextField
              required
              fullWidth
              id="username  "
              label={t("full_name")}
              name="username"
              autoComplete="username"
              // autoFocus
              value={username}
              InputProps={{
                disableUnderline: true,
              }}
              inputProps={{
                maxLength: 50,
              }}
              onChange={(e) => setUser(e.target.value)}
              // aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              // onBlur={() => setUserFocus(false)}
             
              error={userFocus && username && !validName
                ? true
                : false}
                helperText={
                  userFocus && username && !validName
                ? <>4 to 50 letters <br />
                 {/* Must begin with a letter <br />
                 Letters, numbers, underscores, hyphens allowed</> */}</>
                : false
                }
            />
            

            <label htmlFor="email">
              {/* <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} /> */}
            </label>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("email")}
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
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdrop}
           
          >
            <CircularProgress color="inherit" />
          </Backdrop>
      
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Routerlink to="/login" style={{textDecoration:"none"}} variant="body2">
                  <Typography sx={{color:"primary.main"}}>
                  {t("already_have_an_acc")}</Typography>
                </Routerlink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </Box>
  );
};

export default Regform1;
