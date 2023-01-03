import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import RegisterForm from '../register/RegisterForm';

const style = {
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
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    return () => {
        handleOpen();
    };
  }, []);

  return (
    <Box>
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
    </Modal>
    </Box>
  )
}

export default PopWindow