import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,

  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import api from "../api/Axios";
import Webcam from "react-webcam";
import swal from "sweetalert";



const AGE_REGEX = /^[0-9]*$/;
const PHONE_REGEX = /^[0-9+]*$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const style = {
  position: 'absolute',
  top: '50%',

  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { md: "50%", xs: "80%", sm: "80%" },
  bgcolor: 'other.white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const videoConstraints = {
  width: 420,
  height: 400,
  facingMode: "user"
};

const USER_URL = "/api/userprofile"
const UPDATE_USER_URL = "/api/updateuserprofile"
const USER_IMAGE_URL = "/api/getuserimage"

const genders = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  },
  {
    value: 'Others',
    label: 'Others',
  }
];


const UserProfile = (props) => {
  const webcamRef = React.useRef(null);
  const [userprofileimage, setUserprofileimage] = useState("")
  const [image, setImage] = useState("")
  const [webimage, setWebImage] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('user'))
  const [userInfo, setUserInfo] = useState({})
  const [fullname, setFullname] = useState()
  const [email, setEmail] = useState()
  const [profession, setProfession] = useState("")
  const [gender, setGender] = useState("")
  const [googleId, setGoogleId] = useState("")
  const [facebookId, setFacebookId] = useState("")
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = useState(true);
  
  const handleClose = () => setOpen(false);
  
  const [phonenumber, setPhonenumber] = useState();
  const [userPhone, setUserPhone] = useState();
  const [age, setAge] = useState();
  const [validAge, setValidAge] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [ageFocus, setAgeFocus] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
  

  useEffect(() => {
    setValidAge(AGE_REGEX.test(age));

  }, [age])
  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phonenumber));
  }, [phonenumber])
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
    // // console.log(validEmail)
  }, [email])
    

  const handleOpen = () => {setOpen(true);
  };
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setWebImage(imageSrc)
    },
    

    [webcamRef]
  );

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };


  let handleGetUser = async () => {
    const response = await api.post(USER_URL,
      JSON.stringify({ username }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }
    )

    //   .then((res)=>{// console.log(" response of user", res)
    //   if(res.data.data.result.status===401){
    //     navigate("/login")
    //   }
    // });
    // // console.log("response data", response.data.result.status)

    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(() => { window.location.href = "/login"; })
      // navigate("/login")

      // console.log("removed sesssion")
    }
    else {
      setUserInfo(response.data.data)
      setEmail(response.data.data.email)
      setGender(response.data.data.gender ? response.data.data.gender : "Male")
      setProfession(response.data.data.profession)
      setFullname(response.data.data.fullname)
      setAge(response.data.data.age)
      setPhonenumber(response.data.data.phoneNumber)
      setGoogleId(response.data.data.googleId)
      setFacebookId(response.data.data.facebookId)
      setUserPhone(response.data.data.phoneNumber)
      setLoad(false);
      props.setFullName(response.data.data.fullname)
    }
    // return response.data.data

  }

  let handleGetUserImage = async () => {
    const response = await api.post(USER_IMAGE_URL,
      JSON.stringify({ username }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }
    );
    setUserprofileimage(response.data.data)
    // console.log('setUserprofileimage', response);
    if (response.data.result.status === 200) {
      setLoad(false)
    }

    else if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(() => { window.location.href = "/login"; })
      // navigate("/login")
      // window.location.href = "/login";
      // // console.log("removed sesssion")
    }
    // return response.data.data
  }

  useEffect(() => {
    handleGetUser();
    handleGetUserImage();
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setHasCameraPermission(false);
      }
    };

    checkCameraPermission();
  }, [])





  let handleUpdateUserProfile = async () => {
    const response = await api.post(UPDATE_USER_URL,
      JSON.stringify({ username, fullname, email, phonenumber, profession, age, gender }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }

    ).then((e) => {
      swal("Profile Updated!", "", "success")
    });
    setUserInfo(response.data.data)
    setProfession(userInfo.profession)
    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(() => { window.location.href = "/login"; })
      // navigate("/login")
      // window.location.href = "/login";
      // console.log("removed sesssion")
    }
    // setGender(userInfo.gender)
    // // console.log("HONULULULUASDHASDHHASDHASDH",userInfo)
    // return response.data.data

  }


  const handleChange = async (e) => {
    const file = e.target.files[0];
    // setImage(e.target.files[0])
    setWebImage('')
    //// console.log(image)
    const base64 = await convertToBase64(file);
    setWebImage(base64);
    // setImage(base64);
  }
  // const handleApi = () => {
  //   //call the api
  //   const url = `${process.env.REACT_APP_API_URL}/api/uploadimage`

  //   const formData = new FormData()
  //   formData.append('image', image)
  //   //// console.log("form data",image)
  //   axios.post(url, formData).then(result => {
  //     //// console.log(result.data)
  //     alert('success')
  //   })
  //     .catch(error => {
  //       alert('service error')
  //       //// console.log(error)
  //     })
  //     setOpen(false)
  // }
  const handleApiWeb = (event) => {
    //call the api
    const url = `${process.env.REACT_APP_API_URL}/api/uploadimage`

    if (image) {
      let webimage = image
      api.post(url,
        JSON.stringify({ username, webimage }),
        {
          headers: { 'Content-Type': 'application/json' },
          'Access-Control-Allow-Credentials': true,
        }).then((e) => {
          // //// console.log(e.data.data.result.status)
          swal("Profile Photo Uploaded!", "", "success")
          window.reload("/")
        })

    }
    else {

      api.post(url,
        JSON.stringify({ username, webimage }),
        {
          headers: { 'Content-Type': 'application/json' },
          'Access-Control-Allow-Credentials': true,
        }).then((e) => {
          // console.log(e, 'photo up')
          swal("Profile Photo Uploaded!", "", "success")
          handleGetUserImage();

        })
    }
    setOpen(false)
    // window.location.href='/courses'
  }


  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px white inset", WebkitTextFillColor:"black" };  
  const inputDarkStyle = { WebkitBoxShadow: "0 0 0 1000px #002054 inset", WebkitTextFillColor:"#F8B100" };

  return (
    <>
    {/* <>
    {hasCameraPermission ? (
        <p>Camera permission granted.</p>
      ) : (
        <p>Camera permission denied.</p>
      )}
    </> */}
      {load ? (
        <Box sx={{ width: "100%" }}>
          <Container sx={{

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
            marginLeft: "12vw"
          }}>
            <CircularProgress sx={{
              color: "primary.main"
            }} />
          </Container>
        </Box>
      ) : (
        <Box>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >
            User Profile
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              display: {
                xs: "flex",
                sm: "flex",
                md: "flex",
              },
              flexDirection: {
                xs: "column-reverse",
                sm: "column-reverse",
                md: "row",
              },
              // alignContent: "center",
              alignItems: "center"
            }}
          >
            <Grid item xs={9} md={8}>
              <Box>
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      // required
                      focused
                      fullWidth
                      id="name"
                      label="Name"
                      value={fullname}
                      onChange={(e) => { setFullname(e.target.value) }}
                      name="name"
                      autoComplete="name"
                      inputProps={{
                        maxLength: 320,
                        style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                       
                      }}
                    // autoFocus
                    />
                    <TextField
                      margin="normal"
                      // required
                      // color="success"
                      focused
                      fullWidth
                      name="email"
                      label="Email"
                      id="email"
                      value={email}
                      inputProps={{
                        style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                      }}
                      onFocus={() => setEmailFocus(true)}
                      error={
                        emailFocus && !validEmail ?
                          true :
                          false
                      }
                      helperText={emailFocus && !validEmail ?
                        "Enter valid Email"
                        : false
                      }
                      onChange={(e) => { setEmail(e.target.value) }}
                    />
                    {userPhone ?
                      <TextField
                        margin="normal"
                        focused
                        fullWidth
                        id="name"
                        // type="number"
                        label="Phone Number"
                        onChange={(e) => { setPhonenumber(e.target.value) }}
                        value={phonenumber}
                        name="name"
                        autoComplete="name"
                        InputProps={{
                          disableUnderline: true,
                          readOnly: true
                        }}
                        inputProps={{
                          maxLength: 14,
                          style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                        }}
                        autoFocus
                      /> :
                      <TextField
                        margin="normal"
                        focused
                        fullWidth
                        id="name"
                        
                        label="Phone Number"
                        onChange={(e) => { setPhonenumber(e.target.value) }}
                        value={phonenumber}
                        name="name"
                        autoComplete="name"
                        inputProps={{
                          maxLength: 14,
                          style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                        }}
                        helperText="Phone number can be added only once"

                        // autoFocus
                        onFocus={() => setPhoneFocus(true)}
                        error={
                          phoneFocus && !validPhone ?
                            true :
                            false
                        }


                      />}
                    <TextField
                      margin="normal"
                      fullWidth
                      name="profession"
                      label="Profession"
                      id="profession"
                      focused
                      value={profession}
                      inputProps={{
                        style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                      }}
                      // value={userInfo.profession?userInfo.profession:""}
                      // defaultValue={profession}
                      onChange={(e) => { setProfession(e.target.value) }}
                    />
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }, justifyContent: "space-between", alignItems: "center" }}>
                      <TextField
                        margin="normal"
                        name="age"
                        label="Age"
                        focused
                        inputProps={{
                          maxLength: 2,
                          style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                        }}
                        

                        id="age"
                        // width="16rem"
                        sx={{ width: { xs: "100%", sm: "48%", md: "48%", lg: "48%", xl: "48%" } }}
                        value={age}
                        onChange={(e) => { setAge(e.target.value) }}
                        onFocus={() => setAgeFocus(true)}
                        error={
                          ageFocus && !validAge ?
                            true :
                            false
                        }
                        helperText={ageFocus && !validAge ?
                          "Enter valid Age"
                          : false
                        }
                      />

                      <TextField
                        id="outlined-select-currency"
                        select
                        focused
                        label="Select"
                        value={gender}
                        inputProps={{
                          style: (localStorage.getItem("theme") === "theme"?inputDarkStyle:inputStyle),
                        }}
                        sx={{ width: { xs: "100%", sm: "48%", md: "48%", lg: "48%", xl: "48%" }, marginTop: ".4rem" }}
                        onChange={(e) => {
                          // setGender(e.target.value)
                          setGender(e.target.value)
                        }}
                      >
                        {genders.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <>
                    </>
                    <Button
                      // type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, fontSize: "1rem" }}
                      onClick={handleUpdateUserProfile}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              {/* {load ? (
            <CircularProgress sx={{
              color:"primary.main"
            }} />
          ) : ( */}
              <>
                {userprofileimage ?
                  <>                   
                    <img src={userprofileimage} alt="user profile" width={200} height={200}
                    />
                  </>
                  :
                  <Avatar
                    alt="ss"
                    sx={{ width: 200, height: 200, objectFit: "cover" }}
                  />
                }
              </>


              <Box>

                {!webimage && !userInfo.profilephoto ?
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ marginTop: "1rem" }}
                      onClick={()=>{handleOpen()
                        }}
                    >

                      Select Photo
                    </Button>
                  </>
                  :
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ marginTop: "1rem" }}
                    onClick={handleOpen}
                  >

                    Change Photo
                  </Button>}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" sx={{ fontSize: "1.5rem", fontWeight: "800", color: "primary.main", textAlign: "center" }}>
                      Please upload your image
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <Box>
                        <Box >
                          <input name="myFile" accept="image/*" type="file" onChange={handleChange} />

                        </Box>

                        <Typography sx={{ fontSize: "1.5rem", fontWeight: "800", color: "primary.main", textAlign: "center" }}>
                          Or
                        </Typography>
                        <Box >
                          {/* <Grid sx={{display:"flex", flexDirection:"row"}}> */}
                          <Grid sx={{
                            display: "flex",
                            flexDirection: { md: "row", lg: "row", sm: "column", xs: "column" }
                          }}>
                            <Grid xs={4} md={4}>
                              {hasCameraPermission?
                              <Webcam
                                audio={false}
                                height={200}
                                ref={webcamRef}
                                mirrored={true}
                                screenshotFormat="image/webp"
                                width={220}
                                videoConstraints={videoConstraints}
                                sx={{ margin: "1rem" }}
                              />:
                              <>
                                <Container sx={{
                        
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  marginTop:"5rem"
                                }}>
                                  <CircularProgress sx={{
                                  color: "primary.main"
                                }} />
                                </Container>
                              </>}
                            </Grid>
                            <Grid xs={8} md={8} sx={{ marginLeft: { xs: "0rem", md: "8rem", lg: "8rem" } }}>
                              {webimage ?
                                <>
                                  {webimage.length < 2048000 ?
                                    <img src={webimage} alt=""
                                      style={{
                                        //  width: {md:"200",lg:"200", sm:"100" ,xs:"100"}, 
                                        //  height: {md:"200",lg:"200", sm:"100" ,xs:"100"},
                                        height: "200px",
                                        width: "200px",
                                        objectFit: "contain"
                                      }} /> : <Typography sx={{ color: "red" }}>Image is too big, try an image smaller than 2MB</Typography>}

                                </> :
                                <>{image ? <img src={(image)} alt=""
                                // style={{maxWidth: "100%", height:"auto"
                                //  }}
                                /> :
                                  <Avatar
                                    alt="ss"
                                    sx={{ width: 200, height: 200, objectFit: "cover" }}
                                  />}</>
                              }
                            </Grid>
                          </Grid>

                          <br />
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            {webimage !== '' ?

                              <Button onClick={(e) => {
                                e.preventDefault();

                                setWebImage('')

                              }}
                                variant="outlined"
                                component="label"
                              >
                                Retake Image
                              </Button> :
                              <>
                              {hasCameraPermission?
                                <Button onClick={(e) => {
                                e.preventDefault();
                                capture();
                                setImage('')

                              }}
                                variant="outlined"
                                component="label"
                                
                              >
                                Capture
                              </Button>:
                              <Button onClick={(e) => {
                                e.preventDefault();
                                capture();
                                setImage('')

                              }}
                                variant="outlined"
                                component="label"
                                disabled
                              >
                                Capture
                              </Button>}
                              </>}
                            <Button
                              variant="outlined"
                              component="label"
                              disabled={image === '' && webimage === '' || webimage.length > 2048000 ? true : false}
                              onClick={handleApiWeb}

                            >
                              Upload
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Typography>
                  </Box>
                </Modal>
              </Box>
            </Grid>
          </Grid>
        </Box>)}
    </>


  );
};

export default UserProfile;