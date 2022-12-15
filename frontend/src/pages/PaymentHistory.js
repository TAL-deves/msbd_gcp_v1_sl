import * as React from "react";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Box } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import api from "../api/Axios";
import swal from "sweetalert";

let PAYMENT_HISTORY_URL = "/api/paymenthistory";

const PaymentHistory = () => {
  const date = new Date();
  const [startvalue, setStartValue] = React.useState(dayjs(date));
  const [endvalue, setEndValue] = React.useState(dayjs(date));
  const [username, setUsername] = useState(localStorage.getItem("user"));
  const [data, setData] = useState([]);

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
    createData("Purify with yahia amin", "11/1/2022", 2500, 24, "Success"),
    createData(
      "Learn Mindfulness Meditation for a Calmer and Clearer mind",
      "11/1/2022",
      4000,
      24,
      "Success"
    ),
  ];

  let handleGetUser = async () => {
    const response = await api.post(
      PAYMENT_HISTORY_URL,
      JSON.stringify({ username }),
      {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      }
    );
    // // console.log("response data", response.data.result.status)

    if (
      response.data.result.status === 401 ||
      response.data.result.status === 400 ||
      response.data.result.status === 404
    ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      swal(
        "You are logged out",
        "Your session ended, Please login again",
        "info"
      );
      // navigate("/login")
      window.location.href = "/login";
      // console.log("removed sesssion");
    } else {
      // setUserInfo(response.data.data)
      // setEmail(response.data.data.email)
      // setGender(response.data.data.gender ? response.data.data.gender : "male")
      // setProfession(response.data.data.profession)
      // setFullname(response.data.data.fullname)
      // setAge(response.data.data.age)
      // setPhonenumber(response.data.data.phoneNumber)\
      // console.log("payment data ---", response.data.data);
      setData(response.data.data);
    }
    // return response.data.data
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  //// console.log("first date", date)
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "3rem",
        }}
      >
        <Box sx={{ marginLeft: "1rem" }}>
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
        <Box sx={{ marginLeft: "1rem" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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

      <TableContainer component={Paper} sx={{ marginTop: "6rem" }}>
        <Table sx={{ minWidth: {xs:"100%",sm:250,md:100, lg:650, xl:650 } }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell align="right">Purchase Date</TableCell>
              <TableCell align="right">Expiry Date</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Transaction ID</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.courseName}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.coursesList}
                </TableCell>
                {/* <TableCell align="right">{new Date(row.dateOfPurchase).toJSON().slice(0,10)}</TableCell> */}
                <TableCell align="right">{row.dateOfPurchase}</TableCell>
                <TableCell align="right">{row.expirationDate}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.tran_id}</TableCell>
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


