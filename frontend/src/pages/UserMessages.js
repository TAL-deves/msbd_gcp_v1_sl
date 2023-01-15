import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import api from '../api/Axios'
import Paper from "@mui/material/Paper";

let USER_MESSAGES_URL="/api/getusermessages"

export default function UserMessages() {
    const [data, setData] =useState([])

    const username = localStorage.getItem('user')
    let handleUserMessage = async () => {       
        await api.post(USER_MESSAGES_URL, JSON.stringify({ username }), {
            headers: { "Content-Type": "application/json" },
            "Access-Control-Allow-Credentials": true,
          })
          .then((data) => {
            console.log("handleUserMessage",data.data.data.messages)
            setData(data.data.data.messages)
          });         
      };

      useEffect(()=>{
        handleUserMessage()
      },[])
  return (
    <Box>
          <TableContainer component={Paper} sx={{ marginTop: "2rem", width: { xs: "100%", sm: 600, md: "100%", lg: "100%", xl: 650 } }}>
          <Table sx={{ minWidth: { xs: "100%", sm: 250, md: 100, lg: 650, xl: 650 } }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Phone Number</TableCell>
                <TableCell align="left">Full Name</TableCell>
                <TableCell align="left">Message</TableCell>                
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) =>
            
              (
                <TableRow
                  key={row.email}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.email}
                  </TableCell>
                  
                  <TableCell align="left">
                  {row.phonenumber}
                  </TableCell>
                  <TableCell align="left">
                  {row.fullname}
                  </TableCell>
                  <TableCell align="left">
                  {row.leaveMessage}
                  </TableCell>
                 
                 
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  )
}
