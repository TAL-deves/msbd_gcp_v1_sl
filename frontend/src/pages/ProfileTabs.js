import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import swal from "sweetalert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserProfile from "./UserProfile";
import MyCourses from "./MyCourses";
import api from "../api/Axios";
import MyFeedbacks from "./MyFeedbacks";
import PaymentHistory from "./PaymentHistory";
import { Button, Link } from "@mui/material";
import { Container } from "@mui/system";
import DataEntry from "../components/dataEntry/DataEntry";
import PushNotification from "../components/PushNotification/PushNotification";
import { motion } from "framer-motion";
import UserMessages from "./UserMessages";
import SubscriberList from "./SubscriberList";
import googlebtn from "../components/downloadApp/playstore.png";
import applebtn from "../components/downloadApp/applestore.png";

import Lottie from "lottie-react";
import appimage_dark from "../components/downloadApp/downloadappanimation.json";

const DEV_CHECK_URL = "/api/userprofile"
function TabPanel(props) {
  const { children, value, index, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function ProfileTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [fullName, setFullName] = React.useState("")
  const [isAndroid, setIsAndroid] = React.useState()
  const [isDev, setIsDev] = React.useState()

  const style = {
    height: { xs: 320 },
    width: { xs: 320 },
    borderRadius: "50px",
    margin: "5px",

  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let username = localStorage.getItem('user')
  let handleGetUser = async () => {
    const response = await api.post(DEV_CHECK_URL,
      JSON.stringify({ username }),
      {
        headers: { 'Content-Type': 'application/json' },
        'Access-Control-Allow-Credentials': true
      }
    )
    setIsDev(response.data.data.developer)

  }

  React.useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <Box>
      <Box sx={{ bgcolor: "background.paper", display: { lg: "none" } }}>
        {isDev ?
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="User Profile" {...a11yProps(0)} />
            <Tab label="My Courses" {...a11yProps(1)} />
            <Tab label="Payment" {...a11yProps(2)} />
            <Tab label="Feedbacks" {...a11yProps(3)} />
            {/* <Tab label="Data Entry" {...a11yProps(4)} /> */}
            <Tab label="Push Notification" {...a11yProps(4)} />
            <Tab label="Messages" {...a11yProps(5)} />
            <Tab label="Subscribers" {...a11yProps(6)} />
          </Tabs>
          :
          <Tabs
            // orientation="vartical"
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="User Profile" {...a11yProps(0)} />
            <Tab label="My Courses" {...a11yProps(1)} />
            <Tab label="Payment" {...a11yProps(2)} />
            <Tab label="Feedbacks" {...a11yProps(3)} />
          </Tabs>}
        <TabPanel value={value} index={0}>
          <UserProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isAndroid === "Android" || isAndroid === "iPhone" || isAndroid === "Linux" ?
            <Box>
              <Container
                // data-aos="fade-up"
                sx={{
                  color: "primary.main",
                  alignContent: "center"
                }}
              >
                <Box>
                  <Typography
                    gutterBottom
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {/* {t("download_app")} */}
                    You need to download our app to run the course
                  </Typography>
                  {/* <Typography
                    gutterBottom
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "5400",
                      textAlign: "center",
                    }}
                  >
                    To run the courses on mobile devices
                  </Typography>  */}
                  {isAndroid === "Android" || isAndroid === "Linux" ?
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <Link href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school" target="new">
                        <Box
                          // onClick={()=>{swal("","App Coming Soon","");}}
                          sx={{
                            backgroundColor: "other.footercolor",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                            borderRadius: "20px",
                            boxShadow: "4",
                            "&:hover": { boxShadow: "5" },
                            width:"50%",
                            marginLeft:"25%"
                          }}
                        >
                          <img src={googlebtn} alt="google" width="72%" />
                        </Box>
                      </Link>
                    </motion.div> :

                    <motion.div whileHover={{ scale: 1.03 }}>
                      {/* <Link href="https://techanalyticaltd.com/" target="new"> */}
                      <Box
                        onClick={() => { swal("iOS App Coming Soon", "Thank You", ""); }}
                        sx={{
                          // backgroundColor: "secondary.main",
                          backgroundColor: "other.footercolor",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "20px",
                          boxShadow: "4",
                          "&:hover": { boxShadow: "5" }
                        }}
                      >
                        <img src={applebtn} alt="google" width="60%" />
                      </Box>
                      {/* </Link> */}
                    </motion.div>}
                  <Lottie
                    animationData={appimage_dark}
                    style={style}
                  />
                </Box>
                {/* </Grid> */}
              </Container>
            </Box> :
            <Box >
              <MyCourses fullName={fullName} setIsAndroid={setIsAndroid} />
            </Box>}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Box sx={{width:"10rem"}}> */}
          <PaymentHistory />
          {/* </Box> */}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MyFeedbacks />
        </TabPanel>
        {/* <TabPanel value={value} index={4}>
          <DataEntry />
        </TabPanel> */}
        <TabPanel value={value} index={4}>
          <PushNotification />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <UserMessages />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <SubscriberList />
        </TabPanel>
      </Box>

      <Box
        sx={{
          bgcolor: "background.paper",
          display: {
            xs: "none",
            sm: "none",
            md: "none",
            lg: "flex",
            xl: "flex",
          },
          width: "auto",
        }}
      >
        {isDev ?
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", width: "20vw" }}
          >
            <Tab label="User Profile" {...a11yProps(0)} />
            <Tab label="My Courses" {...a11yProps(1)} />
            <Tab label="Payment" {...a11yProps(2)} />
            <Tab label="Feedbacks" {...a11yProps(3)} />
            {/* <Tab label="Data Entry" {...a11yProps(4)} /> */}
            <Tab label="Push Notification" {...a11yProps(4)} />
            <Tab label="Messages" {...a11yProps(5)} />
            <Tab label="Subscribers" {...a11yProps(6)} />
          </Tabs> :
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", width: "20vw" }}
          >
            <Tab label="User Profile" {...a11yProps(0)} />
            <Tab label="My Courses" {...a11yProps(1)} />
            <Tab label="Payment" {...a11yProps(2)} />
            <Tab label="Feedbacks" {...a11yProps(3)} />
          </Tabs>}
        <TabPanel value={value} index={0}>
          <UserProfile setFullName={setFullName} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isAndroid === "Android" || isAndroid === "iPhone" || isAndroid === "Linux" ?
            <Box>
              {/* <MyCourses /> */}
              <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ paddingLeft: "10%", paddingRight: "10%", border: "1rem" }}>
                  <Typography sx={{ fontSize: "1.3rem", textAlign: "center" }}>Please download the app to continue on mobile device.</Typography>
                </Box>
                {isAndroid === "iPhone" ?

                  <Button variant="contained" onClick={() => { swal("iOS app is coming soon", "Thank You", "info") }} sx={{ textDecoration: "none", margin: "2rem" }}>
                    Download App
                  </Button> :
                  <Link target="_blank" href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school&pli=1">

                    <Button variant="contained" sx={{ textDecoration: "none", margin: "2rem" }}>
                      Download App
                    </Button>
                  </Link>
                }
              </Container>
            </Box> :
            <Box >
              <MyCourses fullName={fullName} setIsAndroid={setIsAndroid} />
            </Box>}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <PaymentHistory />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MyFeedbacks />
        </TabPanel>
        {/* <TabPanel value={value} index={4}>
          <DataEntry />
        </TabPanel> */}
        <TabPanel value={value} index={4}>
          <PushNotification />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <UserMessages />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <SubscriberList />
        </TabPanel>
      </Box>
    </Box>
  );
}
