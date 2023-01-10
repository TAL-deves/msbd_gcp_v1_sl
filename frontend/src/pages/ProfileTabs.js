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
  const [fullName, setFullName]= React.useState("")
  const [isAndroid, setIsAndroid]=React.useState()
  console.log("isAndroid",isAndroid)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // let checkAndroid = async () => {
  //   const response = await api.post(USER_URL,
  //     JSON.stringify({ username }),
  //     {
  //       headers: { 'Content-Type': 'application/json' },
  //       'Access-Control-Allow-Credentials': true
  //     }
  //   )}

  

  return (
    <Box>
      <Box sx={{ bgcolor: "background.paper", display:{sm:"none",md:"none",lg:"none"} }}>
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
          {/* <Tab label="Data Entry" {...a11yProps(4)} /> */}
          
        </Tabs>
        <TabPanel value={value} index={0}>
          <UserProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
        {isAndroid==="Android" || isAndroid==="iPhone" ||isAndroid==="Linux"?          
          <Box>
          <Container sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Box sx={{paddingLeft:"10%", paddingRight:"10%", border:"1rem"}}>
              <Typography sx={{fontSize:"1.3rem", textAlign:"center"}}>Please download the app to continue on mobile device.</Typography>
            </Box>
            {isAndroid==="iPhone"?
            
            <Button variant="contained" onClick={()=>{swal("iOS app is coming soon","Thank You", "info")}} sx={{textDecoration:"none", margin:"2rem"}}>
            Download App
         </Button>:
            <Link target="_blank" href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school&pli=1">
            
            <Button variant="contained" sx={{textDecoration:"none", margin:"2rem"}}>
               Download App
            </Button>
          </Link>
          }
          </Container>  
          </Box>:
          <Box >
          <MyCourses fullName={fullName} setIsAndroid={setIsAndroid}/>
          </Box>}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Box sx={{width:"10rem"}}> */}
          <PaymentHistory/>
          {/* </Box> */}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MyFeedbacks />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <DataEntry />
        </TabPanel>
      </Box>

      <Box
        sx={{
          bgcolor: "background.paper",
          display: {
             xs:"none",
            sm:"flex",
            md:"flex",
            lg:"flex",
            xl:"flex",
        },
          width: "auto",       
        }}
      >
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
        </Tabs>
        <TabPanel value={value} index={0}>
          <UserProfile setFullName={setFullName}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {isAndroid==="Android" || isAndroid==="iPhone" || isAndroid==="Linux"? 
          <Box>
          {/* <MyCourses /> */}
          <Container sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Box sx={{paddingLeft:"10%", paddingRight:"10%", border:"1rem"}}>
              <Typography sx={{fontSize:"1.3rem", textAlign:"center"}}>Please download the app to continue on mobile device.</Typography>
            </Box>
            {isAndroid==="iPhone"?
            
            <Button variant="contained" onClick={()=>{swal("iOS app is coming soon","Thank You", "info")}} sx={{textDecoration:"none", margin:"2rem"}}>
            Download App
         </Button>:
            <Link target="_blank" href="https://play.google.com/store/apps/details?id=com.tal.mindschool.mind_school&pli=1">
            
            <Button variant="contained" sx={{textDecoration:"none", margin:"2rem"}}>
               Download App
            </Button>
          </Link>
          }
          </Container>  
          </Box>:
          <Box >
          <MyCourses fullName={fullName} setIsAndroid={setIsAndroid}/>
          </Box>}
        </TabPanel>
        <TabPanel value={value} index={2}>          
          <PaymentHistory/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MyFeedbacks />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <DataEntry />
        </TabPanel>
      </Box>
    </Box>
  );
}
