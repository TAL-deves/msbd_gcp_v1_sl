import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Box } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const PaymentHistory = () => {
  const date = new Date();
  const [startvalue, setStartValue] = React.useState(dayjs(date));
  const [endvalue, setEndValue] = React.useState(dayjs(date));

  const handleChangeStartValue = (newStartValue) => {
    setStartValue(newStartValue);
  }; 
  const handleChangeEndValue = (newEndValue) => {
    setEndValue(newEndValue);
  }; 

  // data show 
  function createData(courseName, date, price, transactionId, status) {
    return { courseName, date, price, transactionId, status };
  }
  
  const rows = [
    createData('Purify with yahia amin', "11/1/2022", 2500, 24, "Success"),
    createData('Learn Mindfulness Meditation for a Calmer and Clearer mind', "11/1/2022", 4000, 24, "Success"),
  
  ];
  
  //console.log("first date", date)
    return (
      <>
      <Box sx={{display:"flex",justifyContent:"space-evenly", marginTop:"3rem"}}>
        <Box sx={{marginLeft:"1rem"}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/DD/YYYY"
          value={startvalue}
          onChange={handleChangeStartValue}
          renderInput={(params) => <TextField {...params} />}
        />
        
      </Stack>
    </LocalizationProvider>
    </Box>
    <Box sx={{marginLeft:"1rem"}}>
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <Stack spacing={3}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/DD/YYYY"
          value={endvalue}
          onChange={handleChangeEndValue}
          renderInput={(params) => <TextField {...params} />}
        />
        
      </Stack>
    </LocalizationProvider>
    </Box>
    </Box>


    {/* data show */}

    <TableContainer component={Paper} sx={{marginTop:"4rem"}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Transaction ID</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.courseName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.courseName}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.transactionId}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
    );
    
};

export default PaymentHistory;