import { Button, Container, DialogContentText, Fab, Modal, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useEffect } from 'react';
import image from "../../assets/loadingAnimation.json";
import CancelIcon from '@mui/icons-material/Cancel';
import ReactPlayer from 'react-player';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


export default function PopWindow(props) {
  // const [open, setOpen] = useState(true);
  // const videoRef = React.useRef(null);


  // const handleOpen = () => setOpen(true);
  // const handleClose = () => {
  //   setOpen(false)
  // };

  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    // <Box>
    

    //   <Modal
    //     open={open}
    //     onClose={handleClose}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //     sx={{overflow:"auto",
    //     maxHeight:"100vh",
    //     display:"flex"}}
    //   >
    //     <Box >

    //       <Box sx={{
    //         position: 'absolute',
    //         top: '50%',
    //         left: '50%',
    //         transform: 'translate(-50%, -50%)',
    //         width: "80%",
    //         // height: {xs:"85%", sm:"55%", md:"60%", lg:"75%", xl:"50%"},
    //         height: "auto",
    //         bgcolor: 'background.paper',
    //         border: '2px solid #000',
    //         boxShadow: 24,
    //         p: 4
    //       }}>
    //         <CancelIcon onClick={handleClose} sx={{ position: 'absolute', cursor: "pointer", color: "white", top: "-7%", right: { xs: "-7%", sm: "-5%", md: "-5%", lg: "-3%", xl: "-3%" }, fontSize: "2rem" }} />
    //         {/* <Container sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: "1rem" }}>
    //                   <Typography sx={{ fontSize: "2rem" }} >Leave a Message</Typography>

    //                   <Box sx={{ marginLeft: "5%", marginRight: "5%" }}>
    //                     <TextField
    //                       margin="normal"
    //                       focused
    //                       fullWidth
    //                       required
    //                       id="name"
    //                       label="Phone Number"
    //                       // onChange={(e) => { setPhonenumber(e.target.value) }}
    //                       // value={phonenumber}
    //                       name="name"
    //                       autoComplete="name"
    //                       inputProps={{
    //                         maxLength: 320,
    //                       }}
    //                       autoFocus
    //                     />

    //                     <TextField
    //                       margin="normal"
    //                       // required
    //                       // color="success"
    //                       focused
    //                       fullWidth
    //                       name="email"
    //                       label="Email"
    //                       id="email"
    //                       // value={email}
    //                       // onFocus={() => setEmailFocus(true)}
    //                       // error={
    //                       //   emailFocus && !validEmail ?
    //                       //     true :
    //                       //     false
    //                       // }
    //                       // helperText={emailFocus && !validEmail ?
    //                       //   "Enter valid Email"
    //                       //   : false
    //                       // }
    //                       // onChange={(e) => { setEmail(e.target.value) }}
    //                     />

    //                     <TextField
    //                       margin="normal"
    //                       // required
    //                       focused
    //                       fullWidth
    //                       id="name"

    //                       label="Name"
    //                       // value={fullname}
    //                       // onChange={(e) => { setFullname(e.target.value) }}
    //                       name="name"
    //                       autoComplete="name"
    //                       inputProps={{
    //                         maxLength: 320,
    //                       }}
    //                     // autoFocus
    //                     />
    //                     <TextField
    //                       sx={{ marginTop: "1.5%", width: "100%" }}
    //                       id="outlined-basic"
    //                       focused
    //                       multiline
    //                       rows={3}
    //                       label="Message"
    //                       variant="outlined"
    //                       // onChange={(e) => setLeaveMessage(e.target.value)}
    //                     />
    //                   </Box>
    //                   <Button
    //                     sx={{ margin: "2%" }}
    //                     variant="contained"
                        
    //                   >
    //                     Send
    //                   </Button>
    //                 </Container> */}

    //         <Container sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: "1rem" }}>
    //           <Typography sx={{ fontSize: "2rem", textTransform:"uppercase" }} >{props.webNotificationData.title}</Typography>
    //           {props.webNotificationData.imageLink?
    //           <img height="100%" width="100%" src={props.webNotificationData.imageLink} alt="" />:<></>}
    //           <br/>
    //           {props.webNotificationData.videoLink?
    //           <Box sx={{width:"100%"}}>
    //            <ReactPlayer width='100%'
    //       height='100%' controls="true" url={props.webNotificationData.videoLink}/>
    //            </Box>
    //           :<></>}
    //           <Typography sx={{ fontSize: "1.5rem" }} >{props.webNotificationData.body}</Typography>
    //         </Container>
    //       </Box>
    //     </Box>
    //   </Modal>


    // </Box>

    <Box>
     
        <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
         <CancelIcon onClick={handleClose} sx={{ position: 'absolute', cursor: "pointer", color: "white", top: "-7%", right: { xs: "-7%", sm: "-5%", md: "-5%", lg: "-3%", xl: "-3%" }, fontSize: "2rem" }} />
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Container sx={{ display: "flex", alignItems: "center", flexDirection: "column", mt: "1rem" }}>
               <Typography sx={{ fontSize: "2rem", textTransform:"uppercase" }} >{props.webNotificationData.title}</Typography>
               {props.webNotificationData.imageLink?
             <img height="100%" width="100%" src={props.webNotificationData.imageLink} alt="" />:<></>}
               <br/>
               {props.webNotificationData.videoLink?
              <Box sx={{width:"100%"}}>
                <ReactPlayer width='100%'
           height='100%' controls="true" url={props.webNotificationData.videoLink}/>
                </Box>
               :<></>}
              <Typography sx={{ fontSize: "1.5rem", textAlign:"justify" }} >{props.webNotificationData.body}</Typography>
           </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={()=>
            {handleClose()
              props.setN(props.n+1)
            }} variant="contained" sx={{"&:hover": {
                        backgroundColor: "secondary.main",
                        color: "primary.main", fontWeight:"800"
                      }}}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>

  )
}
