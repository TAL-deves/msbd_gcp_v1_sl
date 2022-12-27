import { Container} from '@mui/material';

import React from 'react';
import RegisterForm from '../components/register/RegisterForm';


const Register = () => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Container>
      {/* <StepContext> */}
      <RegisterForm/>      
      {/* </StepContext> */}
    </Container>
  );
};

export default Register;