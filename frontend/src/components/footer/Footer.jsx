// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box'; 
// import Container from '@mui/material/Container'; 
// import { Button, CardMedia, makeStyles, Paper, Typography } from '@mui/material';
// import googlebtn from "../downloadApp/playstore.png"
// import applebtn from "../downloadApp/applestore.png";
// import logo from "../navbar/msbdlogo.png";
// import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import InstagramIcon from '@mui/icons-material/Instagram';

// // const myLink = makeStyles(Link){}

// export default function Footer() {
//   return (
//     <Paper sx={{marginTop: 'calc(10% + 60px)',
//     width: '100%',
    
//     bottom: 0,

//     }} component="footer" >
//     <footer >
//       <Box
//         px={{ xs: 3, sm: 10 }}
//         py={{ xs: 5, sm: 10 }}
        
//         sx={{backgroundColor:"other.footercolor",
//         color:"other.white"}}
//       >
//         <Container maxWidth="lg" >
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={3} 
//             // sx={{
//             //   display:"flex",
//             //   alignItems:"center"}}
//               >
             
//               <Box sx={{display:"flex", flexDirection:"column",
//               padding:"2rem", alignItems:"center"}}>
//               <Typography variant='h5' sx={{
//                 color:"other.white"
//               }}>Contact with Us</Typography>
//               <Box sx={{display:"flex"}}>
//                 <Link href='https://google.com'>
//               <FacebookOutlinedIcon sx={{fontSize: '2rem', margin:"1rem", color:"other.white"}}/>
//               </Link>
//               <Link href='https://google.com'>
//               <LocalPhoneOutlinedIcon sx={{fontSize: '2rem', margin:"1rem", color:"other.white"}}/>
//               </Link>
//               <Link href='https://google.com'>
//               <YouTubeIcon sx={{fontSize: '2rem', margin:"1rem", color:"other.white"}}/>
//               </Link>
//               <Link href='https://google.com'>
//               <InstagramIcon sx={{fontSize: '2rem', margin:"1rem", color:"other.white"}}/>
//               </Link>
//               </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sm={3} sx={{
//               color:"other.white"
//             }}>
//               <Box borderBottom={1}>Pages</Box>
//               <Box>
//                 <Link href="/login" sx={{textDecoration:"none"}} color="inherit">
//                   Login
//                 </Link>
//               </Box>
//               <Box>
//                 <Link href="/registration" sx={{textDecoration:"none"}} color="inherit">
//                   Signup
//                 </Link>
//               </Box>
//               <Box>
//                 <Link href="/courses" sx={{textDecoration:"none"}} color="inherit">
//                   Courses
//                 </Link>
//               </Box>
//               <Box>
//                 <Link href="/store" sx={{textDecoration:"none"}} color="inherit">
//                   Store
//                 </Link>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sx={{textDecoration:"none"}} sm={3}>
//               <Box borderBottom={1}>Mind School BD</Box>
//               <Box>
//                 <Link href="/about" sx={{textDecoration:"none"}} color="inherit">
//                   About
//                 </Link>
//               </Box>
//               <Box>
//                 <Link href="/" sx={{textDecoration:"none"}} color="inherit">
//                   Privacy Policy
//                 </Link>
//               </Box>
//               <Box>
//                 <Link href="/" sx={{textDecoration:"none"}} color="inherit">
//                   Refund Policy
//                 </Link>
//               </Box>
//               <Box>
//                 <Link href="/terms-and-conditions" sx={{textDecoration:"none"}} color="inherit">
//                   Terms & Conditions
//                 </Link>
//               </Box>
//             </Grid>
//             <Grid item xs={12} sx={{textDecoration:"none", display:"flex",
//             flexDirection:"column", alignItems:"center"}} sm={3}>
              
//                <Box sx={{
//               display: { xs: "flex" }
//             }}>
//             <img src={logo} alt="logo"
//              width="50" />
//             </Box>
//           <Typography
//             noWrap
//             component="a"
//             href="/"
//             sx={{
//               mr: 0,
//               display: { xs: "flex"},
//               fontSize: "2rem",
//               flexGrow: 1,
//               color: "inherit",
//               textDecoration: "none",
//             }}
//           >
//             {/* //!  This is mobile view */}
//             <Typography
             
//               variant='h5'
//             >
//               Mind School
//             </Typography>
//           </Typography>
//           <Typography>
//             Download Our Mobile App
//           </Typography>
//           {/* app */}
//           <Box sx={{display:"flex"}}>
//           <Link href="https://techanalyticaltd.com/" target="new">
//                 <Box
//                   sx={{
//                     backgroundColor: "other.logocolor",
//                     cursor: "pointer",
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     alignItems: "center",
//                     padding: "10px",
//                     borderRadius: "10px",
//                     margin:"2%"
//                   }}
//                 >
//                   <img src={googlebtn} alt="google" width="96%" />
//                 </Box>
//               </Link>
//               <Link href="https://techanalyticaltd.com/" target="new">
//                 <Box
//                   sx={{
//                     backgroundColor: "other.logocolor",
//                     cursor: "pointer",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     padding: "10px",
//                     borderRadius: "10px",
//                     margin:"2%"
//                   }}
//                 >
//                   <img src={applebtn} alt="google" width="80%" />
//                 </Box>
//               </Link>
//           </Box>
              
//             </Grid>
//           </Grid>
//           <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
//             <Link sx={{textDecoration:"none", color:"other.white"}} href="https://techanalyticaltd.com/" target="new">Powered By Tech Analytica Limited &reg; {new Date().getFullYear()} || Version 1.0</Link>
//           </Box>
//         </Container>
//       </Box>
//     </footer>
//     </Paper>
//   );
// }