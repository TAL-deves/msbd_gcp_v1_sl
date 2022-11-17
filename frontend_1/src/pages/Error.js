import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";

import errorimage from "../data/images/errorimage.png";

const Error = () => {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={errorimage} width="50%" alt="Error"/>
      <Typography
        variant="h4"
        sx={{
          color: "primary.main",
          mt: "2rem",
        }}
      >
        Page not found!
      </Typography>
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <Button variant="contained">Click here</Button>
      </Link>
      <Typography
        sx={{
          color: "secondary.main",
          mt: ".5rem",
        }}
      >
        to go back to the homepage
      </Typography>
    </Box>
  );
};

export default Error;
