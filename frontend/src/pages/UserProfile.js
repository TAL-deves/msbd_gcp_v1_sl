import { PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import api from "../api/Axios";
import WebCam from "../components/Webcam/WebCam";
import axios from "axios";
import Webcam from "react-webcam";
import swal from "sweetalert";
import { useForceUpdate } from "framer-motion";


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

const UserProfile = () => {
  const webcamRef = React.useRef(null);

  const [userprofileimage, setUserprofileimage] = useState("")
  const [image, setImage] = useState("")
  const [webimage, setWebImage] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('user'))
  const [userInfo, setUserInfo] = useState({})
  const [profession, setProfession] = useState(userInfo.profession)
  const [age, setAge] = useState()
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setWebImage(imageSrc)
      // //console.log(webimage.toString())

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
    );
    setUserInfo(response.data.data)

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
    //console.log('setUserprofileimage', response);

    // return response.data.data

  }

  useEffect(() => {
    handleGetUser();
    handleGetUserImage();

  }, [userprofileimage])





  let handleUpdateUserProfile = async () => {
    const response = await api.post(UPDATE_USER_URL,
      JSON.stringify({ username, profession, age }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }

    ).then((e) => {
      swal("Profile Updated!", "", "success")
    });
    setUserInfo(response.data.data)
    setProfession(userInfo.profession)
    //console.log("HONULULULUASDHASDHHASDHASDH",userInfo)
    // return response.data.data

  }


  const handleChange = async (e) => {
    const file = e.target.files[0];
    // setImage(e.target.files[0])
    setWebImage('')
    //console.log(image)
    const base64 = await convertToBase64(file);
    setWebImage(base64);
    // setImage(base64);
  }

  // const handleApi = () => {
  //   //call the api
  //   const url = `${process.env.REACT_APP_API_URL}/api/uploadimage`

  //   const formData = new FormData()
  //   formData.append('image', image)
  //   //console.log("form data",image)
  //   axios.post(url, formData).then(result => {
  //     //console.log(result.data)
  //     alert('success')
  //   })
  //     .catch(error => {
  //       alert('service error')
  //       //console.log(error)
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
          // //console.log(e.data.data.result.status)
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
          // //console.log(e.data.data.result.status)
          swal("Profile Photo Uploaded!", "", "success")
          handleGetUserImage();

        })
    }
    setOpen(false)
    // window.location.href='/courses'
  }




  return (
    <Container>
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
          alignContent: "center",
        }}
      >
        <Grid item xs={6} md={8}>
          <Container>
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
                  fullWidth
                  id="name"
                  label="Name"
                  value={userInfo.username ? userInfo.username : ""}
                  name="name"
                  autoComplete="name"
                  disabled
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{
                    maxLength: 320,
                  }}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  // required
                  // color="success"
                  fullWidth
                  disabled
                  name="email"
                  label="Email"
                  id="email"
                  value={userInfo.email ? userInfo.email : ""}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="profession"
                  label="Profession"
                  id="profession"
                  focused
                  value={profession ? profession : userInfo.profession}
                  // value={userInfo.profession?userInfo.profession:""}
                  // defaultValue={profession}
                  onChange={(e) => { setProfession(e.target.value) }}
                />
                <TextField
                  margin="normal"
                  name="age"
                  label="Age"
                  focused
                  id="age"
                  fullWidth
                  value={age ? age : userInfo.age}
                  onChange={(e) => { setAge(e.target.value) }}
                />


                <input
                  hidden
                  accept="image/*"
                  type="file"
                />
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
          </Container>
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

          {userprofileimage ?
            <img src={userprofileimage} alt="user profile" width={200} height={200}
            /> :
            <Avatar
              alt="ss"
              sx={{ width: 200, height: 200, objectFit: "cover" }}
            />
          }


          <Box>

            {!webimage && !userInfo.profilephoto ? <Button
              variant="outlined"
              component="label"
              sx={{ marginTop: "1rem" }}
              onClick={handleOpen}
            >

              Select Photo
            </Button> :
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
                <Typography id="modal-modal-title" sx={{fontSize:"1.5rem", fontWeight:"800", color:"primary.main", textAlign:"center"}}>
                  Please upload your image
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <Box>
                    <Box >
                      <input name="myFile" accept="image/*" type="file" onChange={handleChange} />

                    </Box>

                    <Typography sx={{ fontSize:"1.5rem", fontWeight:"800", color:"primary.main", textAlign:"center"}}>
                      Or
                    </Typography>
                    <Box >
                      {/* <Grid sx={{display:"flex", flexDirection:"row"}}> */}
                      <Grid sx={{
                        display: "flex",
                        flexDirection: { md: "row", lg: "row", sm: "column", xs: "column" }
                      }}>
                        <Grid xs={4} md={4}>
                          <Webcam
                            audio={false}
                            height={200}
                            ref={webcamRef}
                            mirrored={true}
                            screenshotFormat="image/webp"
                            width={220}
                            videoConstraints={videoConstraints}
                            sx={{ margin: "1rem" }}
                          />
                        </Grid>
                        <Grid xs={8} md={8} sx={{ marginLeft: { xs: "0rem", md: "8rem", lg: "8rem" } }}>
                          {webimage ? <img src={webimage} alt=""
                            style={{
                              //  width: {md:"200",lg:"200", sm:"100" ,xs:"100"}, 
                              //  height: {md:"200",lg:"200", sm:"100" ,xs:"100"},
                              height: "200px",
                              width: "200px",
                              objectFit: "contain"
                            }} /> :
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
                        {webimage != '' ?

                          <Button onClick={(e) => {
                            e.preventDefault();

                            setWebImage('')

                          }}
                            variant="outlined"
                            component="label"
                          >
                            Retake Image
                          </Button> :
                          <Button onClick={(e) => {
                            e.preventDefault();
                            capture();
                            setImage('')

                          }}
                            variant="outlined"
                            component="label"
                          >
                            Capture
                          </Button>}
                        <Button
                          variant="outlined"
                          component="label"
                          disabled={image === '' && webimage === '' ? true : false}
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
    </Container>
  );
};

export default UserProfile;