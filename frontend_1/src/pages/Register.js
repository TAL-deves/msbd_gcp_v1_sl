import { Container, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import RegisterForm from '../components/register/RegisterForm';
import StepContext from './StepContext';

const Register = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Container>
      {/* <StepContext> */}
      <RegisterForm/>      
      {/* </StepContext> */}
    </Container>
  );
};

export default Register;