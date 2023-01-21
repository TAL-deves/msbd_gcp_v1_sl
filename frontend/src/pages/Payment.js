
import {
  Box,
  Button,
  Container,
 
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import api from "../api/Axios";

import swal from "sweetalert";

import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";






const USER_URL = "/api/userprofile"
const UPDATE_USER_URL = "/api/updateuserprofile"

const Payment = () => {
  const location = useLocation();
  const total = location.state.total;
  const singleCourse = location.state.singleCourse;
  // // console.log(discountedPrice,"discountedPrice")
  // const [userprofileimage, setUserprofileimage] = useState("")
  // const [image, setImage] = useState("")
  // const [webimage, setWebImage] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('user'))
  const [userInfo, setUserInfo] = useState({})
  const [fullname, setFullname] = useState()
  const [phonenumber, setPhonenumber] = useState()
  // const [profession, setProfession] = useState(userInfo.profession)
  // const [age, setAge] = useState()
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = useState(true);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const [staddress, setStAddress] = useState();
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [email, setEmail] = useState("");
  const [developer, setDeveloper] = useState();
  // const[user, setUsername]=useState("")





  let handleGetUser = async () => {
    const response = await api.post(USER_URL,
      JSON.stringify({ username }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }
    );

    if (response.data.result.status === 401 || response.data.result.status === 400 || response.data.result.status === 404) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
      // navigate("/login")
      // console.log("removed sesssion")
    }
    else {
      setUserInfo(response.data.data)
      setEmail(response.data.data.email)
      setFullname(response.data.data.fullname)
      setCity(response.data.data.city)
      setStAddress(response.data.data.streetAddress)
      setPostcode(response.data.data.postCode)
      setPhonenumber(response.data.data.phoneNumber)
      setDeveloper(response.data.data.developer)
    }
    setLoad(false);
    // return response.data.data
    // // console.log(response.data.data.email, "userinfo")
  }


  useEffect(() => {
    handleGetUser();

  }, [email])


  //payment api

  const courses = useSelector(state => state.cart)

  //  course list for api 
  let courseList = [];
  for (let i = 0; i < courses.length; i++) {
    courseList.push(courses[i].id);
  }

  // console.log("console log data --------", fullname, username, phonenumber, email, courseList, staddress, city, postcode, country, total, singleCourse

  // console.log(typeof (singleCourse), "single course"

  // let price = 0;
  // for (let i = 0; i < courses.length; i++) {
  //   price = price + parseInt(courses[i].price);
  // }
  // // console.log(courses, "courses")


  //  // console.log(userInfo)
  // let newEmail=(userInfo.email);
  //  setFullname(userInfo.fullname)
  let payment = async () => {
    let courses

    {
      !singleCourse ?
        (courses = courseList) : (courses = [singleCourse])
    }
    let phonenumber = userInfo.username;
    let price = total
    await api
      .post(
        `${process.env.REACT_APP_API_URL}/api/buy`,
        JSON.stringify({
          fullname, username, phonenumber, email, courses, staddress, city, postcode, country, price
        }),
        {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        }
      )
      .then((data) => {
        // // console.log(" Testing data ----- ", data.data.data.redirectGatewayURL);
        // window.open(`${data.data.data.redirectGatewayURL}`, "_self")
        // console.log("payment loader ---------", data)
        var w = 620;
        var h = 575;
        // console.log(typeof (total), "total type")
        var left = (window.screen.width - w) / 2;
        var top = (window.screen.height - h) / 2;
        // console.log("redirect", data)
        window.open(
          `${data.data.data.redirectGatewayURL}`,
          "_self",
          // `width=${w}, 
          // height=${h}, 
          // top=${top}, 
          // left=${left}`
        );


        if (data.data.result.status === 401 || data.data.result.status === 400 || data.data.result.status === 404) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          swal("You are logged out", "Your session ended, Please login again", "info").then(()=>{window.location.href = "/login";})
          // navigate("/login")
          // console.log("removed sesssion")
        }
        if (data.data === null) {
          swal("Failed", "Payment Service is Down, Try Again Later", "error")

        }
        setLoad(true);
        // swal("successful!", "This is here", "success")
      });
  };
  let sanboxpayment = async () => {
    let courses

    {
      !singleCourse ?
        (courses = courseList) : (courses = [singleCourse])
    }
    let phonenumber = userInfo.username;
    let price = total
    await api
      .post(
        `${process.env.REACT_APP_API_URL}/api/sandboxbuy`,
        JSON.stringify({
          fullname, username, phonenumber, email, courses, staddress, city, postcode, country, price
        }),
        {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        }
      )
      .then((data) => {
        // // console.log(" Testing data ----- ", data.data.data.redirectGatewayURL);
        // window.open(`${data.data.data.redirectGatewayURL}`, "_self")
        var w = 620;
        var h = 575;
        // console.log(typeof (total), "total type")
        var left = (window.screen.width - w) / 2;
        var top = (window.screen.height - h) / 2;
        // console.log("redirect", data)
        window.open(
          `${data.data.data.redirectGatewayURL}`,
          "_self",
          // `width=${w}, 
          // height=${h}, 
          // top=${top}, 
          // left=${left}`
        );

        // swal("successful!", "This is here", "success")
      });
  };

  // update profile 
  let handleUpdateUserProfile = async () => {
    let phonenumber = userInfo.username;
    const response = await api.post(UPDATE_USER_URL,
      JSON.stringify({ fullname, username, phonenumber, email, staddress, city, postcode, country }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }

    ).then((e) => {
      // swal("Profile Updated!", "", "success")
    });
    setUserInfo(response.data.data)
    // setProfession(userInfo.profession)
    //// console.log("HONULULULUASDHASDHHASDHASDH",userInfo)
    // return response.data.data

  }


  return (
    <>
      {load ? (
        <Container sx={{

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem"
        }}>
          <CircularProgress sx={{
            color: "primary.main"
          }} />
        </Container>
      ) : (
        <Container sx={{

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <Container>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                }}
              >
                Personal Information
              </Typography>

              <Box
              >

                {/* <Container> */}
                <Box
                  sx={{
                    marginTop: 3,
                    // display: "flex",
                    // flexDirection: "column",
                    // alignItems: "center",
                  }}
                >
                  <Box sx={{ mt: 1 }}>
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
                      }}
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true
                      }}
                    // autoFocus
                    />
                    {phonenumber ?
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

                        InputProps={{
                          disableUnderline: true,
                          readOnly: true
                        }}
                        inputProps={{
                          maxLength: 320,
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

                        InputProps={{
                          disableUnderline: true,
                          readOnly: true
                        }}
                        inputProps={{
                          maxLength: 320,
                        }}
                        autoFocus
                      />}
                    <TextField
                      margin="normal"
                      // required
                      // color="success"
                      fullWidth
                      focused
                      name="email"
                      label="Email"
                      id="email"
                      onChange={(e) => { setEmail(e.target.value) }}
                      value={email}
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true
                      }}
                    />


                  </Box>
                </Box>
                {/* </Container> */}


              </Box>
            </Box>
          </Container>
          <Container>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  mt: "1rem"
                }}
              >
                Billing Address
              </Typography>

              <Box

              >

                {/* <Container> */}
                <Box
                  sx={{
                    marginTop: 3,
                    //  display: "flex",
                    //  flexDirection: "column",
                    // alignItems: "center",
                  }}
                >
                  <Box sx={{ mt: 1 }}>


                    <TextField
                      margin="normal"
                      required
                      focused
                      fullWidth
                      id="stadress"
                      label="Street Address"
                      inputProps={{
                        maxLength: 420,
                      }}
                      value={staddress}
                      onChange={(e) => {
                        setStAddress(e.target.value);
                        // console.log(staddress)
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      focused
                      id="postcode"
                      label="Post Code"
                      value={postcode}
                      inputProps={{
                        maxLength: 5,
                      }}
                      onChange={(e) => {
                        setPostcode(e.target.value);
                        // console.log(postcode)
                      }}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="city"
                      focused
                      label="City"
                      value={city}
                      inputProps={{
                        maxLength: 420,
                      }}
                      onChange={(e) => {
                        setCity(e.target.value);
                        // console.log(city)
                      }}
                    />

                    <TextField
                      margin="normal"
                      fullWidth
                      id="country"
                      label="Country"
                      name="country"
                      value={country}
                      autoComplete="email"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        maxLength: 320,
                      }}
                    />


                  </Box>

                </Box>
                {/* </Container> */}


              </Box>
            </Box>
          </Container>
          {/* uncomment after testing  */}
          <Button
            // type="submit" 
            // fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: "1rem", justifyContent: "center" }}
            onClick={
              () => {
                payment();
                handleUpdateUserProfile();
                setLoad(true);
              }}
            
            disabled={!postcode || !staddress || !city || !email || !fullname}
          >
            Checkout
          </Button>
   {/* comment this button later  */}
          {/* <Button
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: "1rem", justifyContent: "center" }}
            onClick={
              () => {
                // payment();
                // handleUpdateUserProfile();
                // setLoad(true);
                swal("We will be available soon","", "info")
              }}
          >
            Checkout
          </Button> */}


          {/* only for devs  */}
          {developer ?
            <Button
              // type="submit" 
              // fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: "1rem", justifyContent: "center" }}
              onClick={
                () => {
                  sanboxpayment();
                  handleUpdateUserProfile();
                  setLoad(true);
                }}
              // disabled={!postcode || !staddress || !city || !email }
              disabled={!postcode || !staddress || !city || !email || !fullname}
            >
              Checkout for Sandbox
            </Button> : ""}

        </Container>)
      }</>
  );
};

export default Payment;
