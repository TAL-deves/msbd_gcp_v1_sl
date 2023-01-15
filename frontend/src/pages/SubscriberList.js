import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import api from '../api/Axios'
import Paper from "@mui/material/Paper"

let SUBSCRIBER_LIST_URL="/api/allsubscribers"

export default function SubscriberList() {
  const [data, setData] =useState([])
    const username = localStorage.getItem('user')
    let handleSubscriberList = async () => {      
        await api.post(SUBSCRIBER_LIST_URL, JSON.stringify({ username }), {
            headers: { "Content-Type": "application/json" },
            "Access-Control-Allow-Credentials": true,
          })
          .then((data) => {
            console.log("handleSubscriberList",data.data.data)
            setData(data.data.data)
          });         
      };

      useEffect(()=>{
        handleSubscriberList()
      },[])
  return (
    <Box>
          <TableContainer component={Paper} sx={{ marginTop: "2rem", width: { xs: "100%", sm: 600, md: "100%", lg: "100%", xl: 650 } }}>
          <Table sx={{ minWidth: { xs: "100%", sm: 250, md: 100, lg: 650, xl: 650 } }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Phone Number</TableCell>
                
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
                  {row.phoneNumber}
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
