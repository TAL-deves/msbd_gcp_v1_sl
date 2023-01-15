import { Box, Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import swal from 'sweetalert'
import api from '../../api/Axios'
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom';


let VERIFY_CERTIFICATE_URL="/api/verifycertificate";

export default function VerifyCertificate() {
    let [certificateID, setCertificateID] = useState()
    let [checkCertificateID, setCheckCertificateID] = useState()
    let [load, setLoad] = useState(true)
    let [validKey, setValidKey]= useState(false)
    let[fullName, setFullName]= useState()
    let [certificateDate, setCertificateDate]= useState()
    let[courseName, setCourseName]= useState()
    let [verificationStatus, setVerificationStatus]=useState()
    const [certificateIDparam, setCertificateIDparam] = useSearchParams();


  
    let verifyCertificate = async (e) => {
        let response = await api
        .post(VERIFY_CERTIFICATE_URL, JSON.stringify({ certificateID}), {
          headers: { "Content-Type": "application/json" },
          "Access-Control-Allow-Credentials": true,
        }).then((data)=>{
            if(data.data.result.status===200){
              // console.log(data)
                setLoad(false)
            setCertificateDate(data.data.data.certificateDate)
            setFullName(data.data.data.fullName)
            setCertificateDate(data.data.data.certificateDate)
            setCourseName(data.data.data.courseName)
            setCheckCertificateID(data.data.data.certificateID)
            setVerificationStatus(data.data.data.certificate)
            if(data.data.data.certificateID===certificateID){
            //     console.log(data.data.data.certificateID)
            // console.log(certificateID)
            setValidKey(true)
            // console.log(validKey)

            }

            if(data.data.data.certificateID===certificateIDparam.get("certificateIDparam")){
              // console.log(certificateIDparam.get("certificateIDparam"))
            setValidKey(true)
            }
        }
            else{
                swal("Certficate Code is not valid","Try again with a valid code","error")
                setValidKey(false)
                // console.log(data)
            }
            
        })

    };


    let verifyCertificateWithParam = async (e) => {
      let certificateID=certificateIDparam.get("certificateIDparam")
      let response = await api
      .post(VERIFY_CERTIFICATE_URL, JSON.stringify({ certificateID}), {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      }).then((data)=>{
          if(data.data.result.status===200){
            // console.log(data)
              setLoad(false)
          setCertificateDate(data.data.data.certificateDate)
          setFullName(data.data.data.fullName)
          setCertificateDate(data.data.data.certificateDate)
          setCourseName(data.data.data.courseName)
          setCheckCertificateID(data.data.data.certificateID)
          setVerificationStatus(data.data.data.certificate)
          if(data.data.data.certificateID===certificateID){
          //     console.log(data.data.data.certificateID)
          // console.log(certificateID)
          setValidKey(true)
          // console.log(validKey)

          }

          if(data.data.data.certificateID===certificateIDparam.get("certificateIDparam")){
            // console.log(certificateIDparam.get("certificateIDparam"))
          setValidKey(true)
          }
      }
          else{
              swal("Certficate Code is not valid","Try again with a valid code","error")
              setValidKey(false)
              // console.log(data)
          }
          
      })

  };

    if(certificateIDparam.get("certificateIDparam")){
       verifyCertificateWithParam()
    }
   
    return (
        <Box>
            <Container sx={{ height: {xs:"auto", sm:"70vh"} }}>
                <Box sx={{
                    display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10%", border: "1px solid #f7eed7", borderRadius: "10px",boxShadow:"1px 1px 14px 1px rgba(102,102,102,0.83);"
                }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: "800", textDecoration: "underline", color:"primary.main", marginTop:"3rem" }}>Unique Certificate ID - Search</Typography>
                    <Typography sx={{ fontSize: "1.2rem", margin: "1rem", color:"primary.main" }}>Unique Certificate ID: *</Typography>
              {certificateIDparam.get("certificateIDparam")?
                   <TextField id="outlined-basic" label="Enter Certificate ID" variant="outlined"
                   width="20rem" 
                  // halfWidth
                   sx={{width:"20rem"}}
                  //  onInput={verifyCertificate}
                  //  setCertificateID(e.target.value) 
                  value={certificateIDparam.get("certificateIDparam")
                  }
                  // onBlur={verifyCertificate} 
                  
                   />:
                    <TextField id="outlined-basic" label="Enter Certificate ID" variant="outlined" 
                    onChange={(e) => {setCertificateID(e.target.value)
                    // console.log(certificateID)
                  }} 
                    />
              }
                  {certificateIDparam.get("certificateIDparam")?<></>:
                    <Button sx={{ margin: "1rem" }} variant="contained" onClick={verifyCertificate}
                  >Search</Button>}

                    {validKey?
                    <>
                    {load ? (
            <Container sx={{

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop:"5rem"
            }}>
              <CircularProgress sx={{
              color: "primary.main"
            }} />
            </Container>
          ) : (
            <Box sx={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%"}}>
                    <TableContainer component={Paper} sx={{ marginTop: "2rem", width: { xs: "100%", sm: 600, md: "60%", lg: "60%", xl: 650 }, margin:"1rem" }}>
          <Table sx={{ minWidth: { xs: "100%", sm: 250, md: 100, lg: 650, xl: 650 } }} aria-label="simple table">
            
            <TableBody>
                  
                  <TableCell align="left" sx={{color:"primary.main"}}>Name</TableCell>
                  <TableCell align="left" sx={{ wordBreak: "break-word",color:"primary.main" }}>{fullName}
                  </TableCell>
                  
                
            </TableBody>
            <TableBody>
                  
                  <TableCell align="left" sx={{color:"primary.main"}}>Course Name</TableCell>
                  <TableCell align="left" sx={{ wordBreak: "break-word", color:"primary.main" }}>{courseName}
                  </TableCell>
                  
                
            </TableBody>
            <TableBody>
                  
                  <TableCell align="left" sx={{color:"primary.main"}}>Certificate ID</TableCell>
                  <TableCell align="left" sx={{ wordBreak: "break-word", color:"primary.main" }}>{checkCertificateID}
                  </TableCell>
                  
                
            </TableBody>
            <TableBody>
                  
                  <TableCell align="left" sx={{color:"primary.main"}}>Date of Certificate</TableCell>
                  <TableCell align="left" sx={{ wordBreak: "break-word", color:"primary.main" }}>{certificateDate}
                  </TableCell>
                  
                
            </TableBody>
            <TableBody>
                  
                  <TableCell align="left" sx={{color:"primary.main"}}>Status</TableCell>
                  {verificationStatus?
                  <TableCell align="left" sx={{ wordBreak: "break-word", color:"green" }}>Verified
                  </TableCell>:
                  <TableCell align="left" sx={{ wordBreak: "break-word" }}>Not Verified
                  </TableCell>
                  }
                  
                
            </TableBody>
            
          </Table>
        </TableContainer>
        {/* <img height="200" width="200" src="https://baltimoreaircoil.com/sites/default/files/2020-03/FXV_CXVB_slider_1080x780.png" alt="" /> */}
        </Box>
        )}
        </>:
        <></>
                    }

                </Box>

            </Container>
        </Box>
    )
}
