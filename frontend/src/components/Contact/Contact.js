import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React from 'react';
import Divider from '@mui/material/Divider';

const Contact = () => {
  return (
    // <section id='contact' className='my-28 mt-36 '>
    //         <h3 className='font-bold text-4xl text-slate1 my-6'>CONTACT</h3>
    //         <div className='flex gap-8 mx-36'>
    //             <div className=' flex-1 w-500px h-400px text-justify bg-contact p-6 border-y-4 border-cayn'>
    //             <div className='flex m-6'>
    //             <div className='m-4'><i className="fa-solid fa-location-dot text-3xl"></i></div>
    //             <div>
    //             <h4 className='font-semibold text-2xl text-slate1'>Location</h4>
    //             <p>Progress Tower, 4th floor, House #01, Road #23, Gulshan 1, Dhaka 1212</p>
    //             </div>
    //             </div>
    //             <div className='flex m-6'>
    //             <div className='m-4'><i className="fa-solid fa-envelope text-3xl"></i></div>
    //             <div>
    //             <h4 className='font-semibold text-2xl text-slate1'>Email:</h4>
    //             <p><a href="mailto:info@techanalyticaltd.com">info@techanalyticaltd.com</a></p>
    //             </div>
    //             </div>
    //             <div className='flex m-6'>
    //             <div className='m-4'><i className="fa-solid fa-phone text-3xl"></i></div>
    //             <div>
    //             <h4 className='font-semibold text-2xl text-slate1'>Call:</h4>
    //             <p>+880248811161</p>
    //             <p>+880248811162</p>
    //             </div>
    //             </div>
    //             </div>
                
    //         </div>
    //         </section>
    <Container>
    <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", marginTop:"3rem", border:"1px solid #f7eed7",borderRadius:"10px", 
  }}>
       <Typography sx={{fontSize:"2rem", fontWeight:"bolder", border:"1px solid #f8b100",borderRadius:"10px", backgroundColor:"secondary.main", padding:"1rem", marginTop:".5rem", color:"primary.main"}}>Contact Us</Typography>
       <Typography sx={{fontSize:"1.2rem", fontWeight:"bold", marginTop:"1rem", color:"other.footercolor"}}>Address</Typography>
      <Typography sx={{ color:"other.footercolor"}}> Progress Tower(4th floor) House #01, Road #23, Gulshan 1, Dhaka 1212</Typography>
      
      <Typography sx={{fontSize:"1.2rem", fontWeight:"bold", marginTop:"1rem", color:"other.footercolor"}}>Email</Typography>
      <Typography sx={{color:"other.footercolor"}}>support@mindschoolbd.com</Typography>
      <Typography sx={{fontSize:"1.2rem", fontWeight:"bold",marginTop:"1rem", color:"other.footercolor"}}>Contact</Typography>
      <Typography sx={{color:"other.footercolor"}}>+880248811161</Typography>
      <Typography sx={{color:"other.footercolor"}}>+880248811161</Typography>
    </Box>
    
    </Container>
  )
}

export default Contact