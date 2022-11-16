import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import React, { useEffect } from 'react';
import vdoimage from '../components/downloadApp/Y tr.jpg';
import instructorData from '../data/instructorData';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
//   width: "50%",
width:"560", height:"315",
  bgcolor: 'background.paper',
  border: '1px solid white',
  borderRadius:"10px",
  boxShadow: 24,
  p: 4,
};

const AboutUs = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [teamMembers, setTeamMembers]=React.useState([
  {name:"Alim Al Razi", position:"Managing Director",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/alim.png"},
  {name:"Mostafizur Rahman", position:"Chairman",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/mostafizurRahman.png"},
  {name:"Shafayet Jefreey Al Mehdi", position:"CEO and Director",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/mehdi.png"},
  {name:"Moin Mostakim", position:"CTO and Director",image:"https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/managementTeam/moin.png"}])
  

    return (
       <Box>
        {/* <Container> */}
          <Box >
            <Container sx={{display:"flex",flexDirection:{xs:"column", sm:"row",md:"row", lg:"row", xl:"row"},align:"center", p:"2rem", justifyContent:"space-between",alignItems:"center"}}>
            <Box >
                <Typography sx={{fontSize:"2rem", fontWeight:"800", color:"primary.main"}}>
                Mind <span style={{color:"#f8b100"}}>School</span>
                </Typography>
                <Box sx={{width:"70%"}}>
                <Typography sx={{fontSize:"1.3rem", fontWeight:"500", color:"primary.main"}}>
                A <span style={{color:"#f8b100", fontWeight:"800"}}>powerful </span><span style={{ fontWeight:"800"}}>platform</span> where you learn how to live a satisfying, miraculous and blissful life
                </Typography>
               
                </Box>
               
            </Box>
            <Box>
            <img onClick={handleOpen} width={500} src={vdoimage} alt='' />

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/_B6T8O15Ohk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
                <iframe width="560" height="315" src="https://www.youtube.com/embed/XP6BvzptxR8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </Box>
            </Modal>
            </Box>
            </Container>
          </Box>

          <Box>
          <Container>
            <Box sx={{ m: "3rem", textAlign:"justify" }}>
            <Typography sx={{fontSize:"2rem", fontWeight:"800",textAlign:"center"}}>
            About Us
            </Typography>
            <Typography>
            A healthy mind is the mantra of a healthy life, healthy physic, and healthy relationship. Mental Health is at top concerns in present era and improving the quality of our life experience is pre-eminent. Mind School is the platform where we aim to teach and train people how to develop your relationship, health, career, mindset and mental wellbeing by illuminating on your own inner intellectual strength and capacity. Here you can learn the prime lessons of your life that matters the most.
            </Typography>
            <Typography sx={{mt:"1rem"}}>
            We desire to bring joy, love and fulfilment in people’s life by sharing this unique gift brought forward by our incredibly talented mind trainers. With the ease of access to internet and technological enhancement, backed by cutting edge IT solutions, we present contents and courses through this powerful platform that can transform you radically. We welcome you to grab this life changing opportunity and surround yourself with positive affirmation.
            </Typography>
            </Box>
            <Box  sx={{display:"flex", flexDirection:"row"}}>
            {
                    teamMembers.map(member=>
                    // <SingleMember
                    // // key={member.key}
                    // // name={member.name}
                    // // image={member.image}
                    // key={member.key}
                    // member={member}
                    // handleAddMember={handleAddMember}
                    // >
                    // </SingleMember>
    //                 sx={{ margin: "0" ,width:"100%", 
    // "&:hover":{boxShadow:"5"}}}
                    <Box sx={{width:"50%", boxShadow:"5",borderRadius:"10px",display:"flex",
                    flexDirection:"column", justifyContent:"center", alignItems:"center", margin:"1rem", py:"1rem"}}>  
                        <Box>  
                        <img width={100} src={member.image} alt={member.name} />
                        </Box>                
                    <Typography>
                       {member.name}                      
                    </Typography>
                    <Typography>
                       {member.position}                      
                    </Typography>
                    <Typography>
                       Tech Analytica Limited                      
                    </Typography>
                    </Box>
                    )
                } 
            </Box>
        </Container>
          </Box>
        {/* </Container> */}
       </Box>
    );
};

export default AboutUs;