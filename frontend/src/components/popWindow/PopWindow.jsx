import * as React from 'react';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import RegisterForm from '../register/RegisterForm';

const style = {
    
    bgcolor: 'background.paper',
    width:'70%',
    boxShadow: 24,
    p: 4,
    marginTop:'20%'
  };
const containerStyle = {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
}

  

const PopWindow = () => {
    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    return () => {
        handleOpen();
    };
  }, []);

  return (
    <div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={containerStyle}
    >
      <Box sx={style}>
        <RegisterForm />
      </Box>
    </Modal></div>
  )
}

export default PopWindow