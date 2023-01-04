import React, { useContext } from "react";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { globalContext } from "../../../pages/GlobalContext";
import {motion} from "framer-motion";

const Achievement = (props) => {
  const {t}= useContext(globalContext)
    let picture = props.picture;
    let text = props.text;
    let count = props.count;
  return (
    <motion.div whileHover={{scale:1.03}}>
    <Box sx={{
        display:"flex",
        justifyContent:"space-evenly",
        alignItems:"center",
        marginBottom:"20px"
    }}>
      
        {/* <VideoLibraryIcon sx={{ fontSize: 50, marginRight: "15px" }} /> */}
        <img src={picture} alt="test" width="30%" style={{
                    objectFit:"contain"
                  }}/>
      
      <Box sx={{
        ml:"1rem"
      }}>
        <Typography sx={{
            fontSize:"2rem",
            fontWeight:'500',
            color:"primary.main",textAlign:"center"
        }}>{count}+</Typography>
        <Typography sx={{
            fontSize:".8rem",
            textAlign:"center"
        }}>{text}</Typography>
      </Box>
      
    </Box>
    </motion.div>
  );
};

export default Achievement;
