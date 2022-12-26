import * as React from "react";
import PropTypes from "prop-types";

import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserProfile from "./UserProfile";
import MyCourses from "./MyCourses";
import Payment from "./Payment";
import MyFeedbacks from "./MyFeedbacks";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import PaymentHistory from "./PaymentHistory";

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        </Tabs>
        <TabPanel value={value} index={0}>
          <UserProfile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MyCourses />
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Box sx={{width:"10rem"}}> */}
          <PaymentHistory/>
          {/* </Box> */}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MyFeedbacks />
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
        </Tabs>
        <TabPanel value={value} index={0}>
          <UserProfile setFullName={setFullName}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MyCourses fullName={fullName}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          
          <PaymentHistory/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MyFeedbacks />
        </TabPanel>
      </Box>
    </Box>
  );
}
