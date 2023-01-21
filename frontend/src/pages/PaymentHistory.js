import * as React from "react";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import api from "../api/Axios";
import swal from "sweetalert";
import { CircularProgress, Container } from "@mui/material";


let PAYMENT_HISTORY_URL = "/api/paymenthistory";

const PaymentHistory = () => {
  const date = new Date();
  const [startvalue, setStartValue] = React.useState(dayjs(date));
  const [endvalue, setEndValue] = React.useState(dayjs(date));
  const [username, setUsername] = useState(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  // const handleChangeStartValue = (newStartValue) => {
  //   setStartValue(newStartValue);
  // };
  // const handleChangeEndValue = (newEndValue) => {
  //   setEndValue(newEndValue);
  // };

  // data show
  function createData(courseName, date, price, transactionId, status) {
    return { courseName, date, price, transactionId, status };
  }

  

  let handleGetPaymentHistory = async () => {
    const response = await api.post(
      PAYMENT_HISTORY_URL,
      JSON.stringify({ username }),
      {
        headers: { "Content-Type": "application/json" },
        "Access-Control-Allow-Credentials": true,
      }
    );
    
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
      ).then(()=>{window.location.href = "/login";});
      // navigate("/login")
      setLoad(false);
       
    } else {
      // setUserInfo(response.data.data)
      // setEmail(response.data.data.email)
      // setGender(response.data.data.gender ? response.data.data.gender : "male")
      // setProfession(response.data.data.profession)
      // setFullname(response.data.data.fullname)
      // setAge(response.data.data.age)
      // setPhonenumber(response.data.data.phoneNumber)\
      // console.log("removed sesssion", response);
      setData(response.data.data);
      // console.log(response.data.data)
      setLoad(false);
    }
    // return response.data.data
  };

  useEffect(() => {
    handleGetPaymentHistory();
  }, []);



  return (
    <>
      {/* <Box
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
      </Box> */}

      {/* data show */}

      {load ? (
        <Container sx={{
          marginLeft: "12vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem"
        }}>
          <CircularProgress sx={{
            color: "primary.main"
          }} />
        </Container>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: "2rem", width: { xs: "100%", sm: 600, md: "100%", lg: "100%", xl: 650 } }}>
          <Table sx={{ minWidth: { xs: "100%", sm: 250, md: 100, lg: 650, xl: 650 } }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Course ID</TableCell>
                <TableCell align="left">Purchase Date</TableCell>
                <TableCell align="left">Expiry Date</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Transaction ID</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.reverse().map((row) =>
              // setPurchaseDate((row.dateOfPurchase).setHours((row.dateOfPurchase).getHours()+2))
              // (console.log("purchaseDate--------",purchaseDate))
              // console.log(new Date(row.dateOfPurchase))
              // (`${row.dateOfPurchase}`)
              // setDateFormat(`${row.dateOfPurchase.getDate()}-${row.dateOfPurchase.getMonth() + 1}-${row.dateOfPurchase.getFullYear()}`)
              //  setDateFormat(new Date(row.dateOfPurchase).toLocaleDateString("en-US", {
              //   month: "long",
              //   day: "numeric",
              //   year: "numeric",
              // }))
            
              (
                <TableRow
                  key={row.courseName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {JSON.stringify(row.coursesList).replace("[","").replace("]","")}
                  </TableCell>
                  {/* <TableCell align="right">{new Date(row.dateOfPurchase).toJSON().slice(0,10)}</TableCell> */}
                  {/* <TableCell align="right">{purchaseDate}</TableCell> */}
                  <TableCell align="right">{
                  (new Date(row.dateOfPurchase).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  }))
                  }</TableCell>
                  <TableCell align="right">
                    {(new Date(row.expirationDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",

                  }))}
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right" sx={{ wordBreak: "break-word" }}>{row.tran_id}</TableCell>
                  {`${row.status}` === "VALID" ?
                    <TableCell align="right" sx={{ color: "green", fontWeight: "800" }}>{row.status}</TableCell> :
                    <TableCell align="right" sx={{ color: "red", fontWeight: "800" }}>{row.status}</TableCell>}
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </TableContainer>)}
    </>
  );
};

export default PaymentHistory;