import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link as Routerlink } from "react-router-dom";
import { useState, useContext } from "react";
import api, { login } from "../../api/Axios";
import { useNavigate, useLocation } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import "./LoginForm.css";
import LocalStorageService from "../../api/localstorage";
import appimage_dark from "../downloadApp/downloadappanimation.json";
import appleStore from "../downloadApp/AS.json";
import playStore from "../downloadApp/Ps.json";
import {
  Alert,
  AlertTitle,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
  Backdrop,
  Link,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { globalContext } from "../../pages/GlobalContext";
import JsonFormatter from "../../api/jsonFormatter";
import swal from "sweetalert";
import { multiStepContext } from "../../pages/StepContext";
import { MuiTelInput } from "mui-tel-input";
import Lottie from "lottie-react";
import CancelIcon from '@mui/icons-material/Cancel';
//! my addition

import QRCode from "react-qr-code";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import uuid from "react-uuid";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { display } from "@mui/system";

const SEND_QR_DATA_TO_WEB = `/api/qrfromweb`;
const QR_MATCH_STATUS = `/api/qrcheck`;

//! my addition ends

var CryptoJS = require("crypto-js");

// Generate random 16 bytes to use as IV
var IV = CryptoJS.enc.Utf8.parse("1583288699248111");

const keyString = "thisIsAverySpecialSecretKey00000";
// finds the SHA-256 hash for the keyString
var Key = CryptoJS.enc.Utf8.parse(keyString);

const LOGIN_URL = `/api/oauth/token`;
const SESSION_CLEAR = `/api/clearalltoken`;
let CHECK_DEVICE_URL = "/api/checkdeviceanduser";

const theme = createTheme();

//! my addition part 2

function encrypt(data) {
  var encryptedCP = CryptoJS.AES.encrypt(data, Key, { iv: IV });
  var cryptText = encryptedCP.toString();
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cryptText),
    formatter: JsonFormatter,
  });
  return cipherParams.toString();
}

let encryptionOfData = (data) => {
  let encryptionData = encrypt(JSON.stringify(data));
  let encryptedData = {
    request: encryptionData,
    passphase: IV.toString(),
  };
  return encryptedData;
};

let qrdata;
//! my addition part 2

// var myInterval = setInterval(everyTime, 1000);

export function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const [qrvalue, setQrvalue] = React.useState({});
  const handleOpen = () => {
    // setQrvalue({
    //   id: uuid().replaceAll("-", ""),
    //   username: "testuser",
    // });

    let ranid = uuid().replaceAll("-", "");

    qrdata = encryptionOfData({
      id: ranid,
    });

    // encryptionOfData()
    // console.log("qrdata",qrdata.request.ct, "ranid ---", ranid);

    async function sendQrToServer() {
      await api
        .post(SEND_QR_DATA_TO_WEB, JSON.stringify({ qrdata }), {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        })
        .then((response) => {
          // console.log("SEND_QR_DATA_TO_WEB ---- ", response);
        });
    }
    sendQrToServer();

    async function checkQRmatch() {
      // console.log("this is printing",n);
      const localStorageService = LocalStorageService.getService();

      await api
        .post(QR_MATCH_STATUS, JSON.stringify({ qrdata }), {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        })
        .then((response) => {
          // console.log("Response----- ", response.data.data);
          // console.log("Response if matched ", response.data.data.data);
          if (response.data.data.matched) {
            localStorageService.setToken(response.data.data.data);
            // window.location.reload();
            // swal("Success!", "You will be redirected in a moment", "success").then(()=>{
            //   window.location.reload();
            // })

            swal({
              title: "Login Success",
              text: "Redirecting...",
              icon: "success",
              timer: 2000,
              buttons: false,
            }).then(() => {
              window.location.href = "/";
            });
          }
        });
    }

    setInterval(checkQRmatch, 10 * 1000);
    // var myInterval = setInterval(everyTime, 10 * 1000);
    // clearInterval(myInterval);

    // setQrvalue({
    //   id: uuid().replaceAll("-", ""),
    //   username: "testuser",
    // });

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

    const style = {
    // height: "50%",
    // width: "50%",
    borderRadius: "50px",
    margin: "5px",
  };

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        sx={{
          // maxWidth:"500px",

          fontSize: "1rem",
          mt: 1,
          mb: 1,
          color: "other.dark",
        }}
        onClick={handleOpen}
      >
        {/* &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; */}
        <QrCodeIcon /> &nbsp;&nbsp;Continue from mobile
        {/* &nbsp; &nbsp; &nbsp; &nbsp;  */}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              // border: "2px solid #000",
              borderRadius: "5px",
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column", alignItems: "center"

            }}
          >
            <CancelIcon onClick={handleClose} sx={{ position: 'absolute', cursor: "pointer", color: "white", top: "-5%", right: { xs: "5%", sm: "-5%", md: "-5%", lg: "-3%", xl: "-3%" }, fontSize: "2rem" }} />
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.2rem",
                pb: 2
              }}
            >
              Scan the QR from app to login and continue your session.
            </Typography>
            <Box
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 120,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                // value={JSON.stringify(qrdata)}
                value={qrdata?.request?.ct}
                viewBox={`0 0 256 256`}
              />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.2rem",
                pb: 2
              }}
            >
              If you don't have our app, please download from the links below.
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Link href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school" target="new">
                <Lottie
                  animationData={playStore}
                  style={style}
                /></Link>
              <Box sx={{ cursor: "pointer" }}>
                <Lottie
                  animationData={appleStore}
                  style={style}
                  onClick={() => { swal("iOS App Coming Soon", "Thank You", ""); }}
                />
              </Box>
            </Box>
            <Lottie
              animationData={appimage_dark}
              style={style}
            />
          </Box>

        </Fade>
      </Modal>
    </Box>
  );
}

const LoginForm = (props) => {
  const { t } = useContext(globalContext);
  const {
    addUserobj,
    phone,
    setPhone,
    validPhone,
    phoneFocus,
    setPhoneFocus,
    phoneNumber,
  } = useContext(multiStepContext);

  // mui telnet
  const handleChange = (newPhone) => {
    setPhone(newPhone);
  };
  const search = useLocation().search;
  // const nameg = new URLSearchParams(search).get("gusername");
  const gobject = new URLSearchParams(search).get("gobject");
  const gprofilename = new URLSearchParams(search).get("profilename");
  // const namef = new URLSearchParams(search).get("fusername");
  const fobject = new URLSearchParams(search).get("fobject");
  const fprofilename = new URLSearchParams(search).get("fprofilename");

  const [currentuser, setCurrentuser] = useState("");
  const [gName, setGname] = useState("");
  const [fName, setFname] = useState("");
  const [backdrop, setBackdrop] = useState(false);
  // const [fName, setfname] = useState('');
  const [qrdata, setQrdata] = useState("No result");

  let obj = JSON.parse(JSON.parse(JSON.stringify(gobject)));
  let fbObj = JSON.parse(JSON.parse(JSON.stringify(fobject)));

  // //// console.log("nameg Object is ------ ", nameg);
  // //// console.log("gobject Object is ------ ", gobject);

  // //// console.log("namef Object is ------ ", namef);
  // //// console.log("fobject Object is ------ ", fbObj);

  if (obj) {
    obj.request.ct = obj.request.ct.replaceAll(" ", "+");
    // //// console.log("updated gobject Object is ------ ", obj);

    if (gobject !== null) {
      const { request, passphase } = obj;

      let decryptedFromText = CryptoJS.AES.decrypt(
        JsonFormatter.parse(JSON.stringify(request)),
        Key,
        { iv: IV }
      );

      // //// console.log("decryptedFromText   -------   ", decryptedFromText);

      let recievedData = decryptedFromText.toString(CryptoJS.enc.Utf8);

      // //// console.log("recievedData   -------   ", JSON.parse(recievedData));

      let googleData = JSON.parse(recievedData);

      // console.log("google data", googleData);

      const localStorageService = LocalStorageService.getService();
      // //// console.log("Google data : ", googleData.data.result.isError);

      if (googleData.data.result.isError === false) {
        //// console.log("accesstoken  data : ", googleData.data.data.access_token);
        setCurrentuser(gprofilename);
        setGname(setGname);
        localStorageService.setToken(googleData.data.data);
        // //// console.log(googleData.reslut);
        // window.opener.location.reload();
        window.opener.document.location.href = "/";
        window.close();
        // window.location.href="/courses"
        setBackdrop(false);
      }
    }
  } else if (fbObj) {
    fbObj.request.ct = fbObj.request.ct.replaceAll(" ", "+");
    // //// console.log("updated gobject Object is ------ ", obj);

    if (fobject !== null) {
      const { request, passphase } = fbObj;

      let decryptedFromText = CryptoJS.AES.decrypt(
        JsonFormatter.parse(JSON.stringify(request)),
        Key,
        { iv: IV }
      );

      // //// console.log("decryptedFromText   -------   ", decryptedFromText);

      let recievedData = decryptedFromText.toString(CryptoJS.enc.Utf8);

      // //// console.log("recievedData   -------   ", JSON.parse(recievedData));

      let facebookData = JSON.parse(recievedData);

      const localStorageService = LocalStorageService.getService();
      // //// console.log("facebook data : ", facebookData.data);

      if (facebookData.data.result.isError === false) {
        // //// console.log("accesstoken  data : ", facebookData.data.data.access_token);
        setCurrentuser(fprofilename);
        setGname(setFname);
        localStorageService.setToken(facebookData.data.data);
        // //// console.log(facebookData.reslut);
        // window.opener.location.reload();
        window.opener.document.location.href = "/";
        window.close();
        // window.location.href="/courses"
      }
    }
  }

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(true);
  const [isAndroid, setIsAndroid] = React.useState();

  const [sessionFound, setSessionFound] = useState(false);
  //to show pass
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  //

  const googleAuth = () => {
    var w = 620;
    var h = 575;
    var left = (window.screen.width - w) / 2;
    var top = (window.screen.height - h) / 2;

    // window.open(
    //   `${process.env.REACT_APP_API_URL}/api/google`,
    //   "_self",

    // );
    let googleWindow= window.open(
      `${process.env.REACT_APP_API_URL}/api/google`,
      "",
      `width=${w}, 
      height=${h}, 
      top=${top}, 
      left=${left}`
    );
    setBackdrop(true);
    googleWindow.onunload = function(){ setBackdrop(false); };
  };
  const facebookAuth = () => {
    var w = 620;
    var h = 575;
    var left = (window.screen.width - w) / 2;
    var top = (window.screen.height - h) / 2;
    // window.open(
    //   `${process.env.REACT_APP_API_URL}/api/facebook/callback`,
    //   "_self"

    // );
    let facebookWindow= window.open(
      `${process.env.REACT_APP_API_URL}/api/facebook/callback`,
      "",
      `width=${w}, 
      height=${h}, 
      top=${top}, 
      left=${left}`
    );
    setBackdrop(true);
    facebookWindow.onunload = function(){ setBackdrop(false); };
  };
  //   let fetchDeviceData = async () => {
  //     await api
  //     .post(CHECK_DEVICE_URL, JSON.stringify({ username }), {
  //       headers: { "Content-Type": "application/json" },
  //       "Access-Control-Allow-Credentials": true,
  //     })
  //     .then((data) => {
  //      console.log("device",data.data.data.data.platform)
  //     setIsAndroid(data.data.data.data.platform)
  //     });
  // };

  async function handleLoginNow () {

    const response = await login(
      username,
      email,
      password,
      phoneNumber,
      (response) => {
        const localStorageService = LocalStorageService.getService();
        // //// console.log("response ", response);
        // setLoad(false);
        setBackdrop(true);
        if (response.data.result.status === 409) {
          setSessionFound(true);
          setErrMsg(response.data.result.errMsg);
        } else if (response.data.result.status === 200) {
          setCurrentuser(response.data.data.user);
          localStorageService.setToken(response.data.data);
          if (response.data.data.user) {
            // setMail(username)
            // window.location.href = "/courses";
            addUserobj(response.data.data);
            // navigate("/courses")
            navigate("/");

            // <Navigate to="/courses" />
          }
        } else if (response.data.result.status === 401) {
          setErrMsg(response.data.result.errMsg);
          swal("Invalid!", `${response.data.result.errMsg}`, "warning");
        } else {
          setErrMsg(response.data.result.errMsg);
          swal("Error!", `${response.data.result.errMsg}`, "error");
        }
      }
    );

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await login(
      username,
      email,
      password,
      phoneNumber,
      (response) => {
        const localStorageService = LocalStorageService.getService();
        // //// console.log("response ", response);
        // setLoad(false);
        setBackdrop(false);
        if (response.data.result.status === 409) {
          setSessionFound(true);
          setErrMsg(response.data.result.errMsg);
        } else if (response.data.result.status === 200) {
          setCurrentuser(response.data.data.user);
          localStorageService.setToken(response.data.data);
          if (response.data.data.user) {
            // setMail(username)
            // window.location.href = "/courses";
            addUserobj(response.data.data);
            // navigate("/courses")
            navigate("/");

            // <Navigate to="/courses" />
          }
        } else if (response.data.result.status === 401) {
          setErrMsg(response.data.result.errMsg);
          swal("Invalid!", `${response.data.result.errMsg}`, "warning");
        } else {
          setErrMsg(response.data.result.errMsg);
          swal("Error!", `${response.data.result.errMsg}`, "error");
        }
      }
    );
  };

  const handleLoading = () => {
    setBackdrop(true);
  };

  const clearSession = async () => {
    let username = phoneNumber;
    const response = await api
      .post(SESSION_CLEAR, JSON.stringify({ username, phoneNumber }), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      })
      .then((response) => {
        if (response.data.result.status === 401) {
          swal("Error!", "No active session found", "error");
        } else if (response.data.result.status === 404) {
          swal("Error!", "No user found", "error");
          //// console.log("no user found", response.data.result)
        } else if (response.data.result.status === 500) {
          swal("Oh no!", "Server error, please try again later", "error");
        } else {
          setSessionFound(false);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
         

          swal({
            title: "Sessions cleared",
            text: "Logging you in",
            icon: "success",
            timer: 1000,
            buttons: false,
          })
          // .then((e) => {
          // });
          setBackdrop(true);
          handleLoginNow();

          setErrMsg(null);
          // }, 2000);
        }
      });
  };

  // // for testing
  // useEffect(async()=>{

  //   //// console.log("JSON.stringify({ userrrrname })", ({ username }))
  //   const response = await api
  //     .post("/api/userdetails", JSON.stringify({ username }), {
  //       headers: { "Content-Type": "application/json" },
  //       "Access-Control-Allow-Credentials": true,
  //     })
  //     .then((response) => {
  //       //// console.log("texting response------",response)
  //     });

  // },[])
  return (
    // <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs" sx={{ mb: 35 }}>
      {/* <CssBaseline /> */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 2, bgcolor: "primary.main", p: 3 }}>
          <LoginIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("login")}
        </Typography>
        <Grid
          container
          className="SocialContainer"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            // sx={{ mt: 1, mb: 1, display: "flex", flexDirection: "row" }}
            sx={{
              mt: 1,
              mb: 1,
              display: "flex",
              flexDirection: "row",
              bgcolor: "primary.main",
            }}
            onClick={googleAuth}
          >
            <GoogleIcon
              // className="Icons"
              sx={{ color: "other.dark", 
              fontSize: "2rem", 
              // marginRight: "2.4rem",
              width:"10%"
            }}
            />
            <Typography sx={{ color: "other.dark", fontSize: "1rem",
          width:"60%"
          }}>
              {t("login_with_gmail")}
            </Typography>
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 1 }}
            onClick={facebookAuth}
          >
            <FacebookIcon
              // className="Icons"
              sx={{ color: "other.dark", fontSize: "2rem", 
              // margin: "0px 10px"
              // marginRight: ".5rem" 
              width:"10%"
             }}
            />
            <Typography sx={{ color: "other.dark", fontSize: "1rem",
          width:"60%"
          }}>
              {t("login_with_facebook")}
            </Typography>
          </Button>
          {/* //! my addition */}
          <Box sx={{ width: "100%", display: { xs: "none", sm: "block" } }}>
             <TransitionsModal />
           </Box>
          {/* //! my addition */}
          <Typography component="p" variant="p" sx={{ textAlign: "center" }}>
            {t("or")} <br />
            {t("login_with_email")}
          </Typography>
        </Grid>
        {errMsg ? (
          <Stack sx={{ width: "100%" }} spacing={2}>
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
              }
            >
              <AlertTitle>{errMsg}</AlertTitle>
              {/* <Typography>{errMsg}</Typography> */}
              {sessionFound ? (
                <>
                  <Typography>
                    Click on proceed to continue on this device
                  </Typography>
                  <Button
                    sx={{ mt: "1rem", 
                    // bgcolor:"secondary.main",
                    // color:"primary.main",

                    bgcolor:"primary.main",
                      color:"other.white",

                     "&:hover":{
                      bgcolor:"secondary.main",
                      color:"primary.main",
                    } }}
                    variant="contained"
                    onClick={()=>{
                      clearSession();
                      // handleSubmit();
                    }}
                  >
                    Proceed
                  </Button>
                </>
              ) : (
                ""
              )}
            </Alert>
          </Stack>
        ) : (
          ""
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* uncomment letter for login with phone  */}
          <MuiTelInput
            sx={{ width: "100%", marginY: "1rem", color: "primary.main" }}
            label="Phone Number"
            defaultCountry="BD"
            value={phone}
            onChange={handleChange}
            required
            inputProps={{
              maxLength: 16,
            }}
            onFocus={() => setPhoneFocus(true)}
            error={phoneFocus && !validPhone ? true : false}
            helperText={
              phoneFocus && !validPhone ? "Enter valid phone number" : false
            }
          />

          {/* <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("email")}
            name="email"
            error={errMsg}
            autoComplete="email"
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              maxLength: 320,
            }}
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value);
              setUsername(e.target.value);
              props.setMail = email;
            }}
          /> */}

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("password")}
            error={errMsg}
            type={showPassword ? "text" : "password"}
            InputProps={{
              // <-- This is where the toggle button is added.
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
              ),
            }}
            //
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* {load ? (
            <CircularProgress sx={{
              color:"primary.main"
            }} />
          ) : ( */}

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Button
            type="submit"
            fullWidth
            onClick={() => {
              handleLoading();
              // fetchDeviceData()
            }}
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
          >
            {t("login")}
          </Button>

          {/* )}  */}
          <Grid container>
            <Grid item xs>
              <Routerlink
                to="/forgotpassword"
                style={{ textDecoration: "none" }}
                variant="body2"
              >
                <Typography sx={{ color: "primary.main" }}>
                  {t("forgot_password")}
                </Typography>
              </Routerlink>
            </Grid>
            <Grid item>
              <Routerlink
                to="/registration"
                style={{ textDecoration: "none" }}
                variant="body2"
              >
                <Typography sx={{ color: "primary.main" }}>
                  {t("no_account")}
                </Typography>
              </Routerlink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
};

export default LoginForm;