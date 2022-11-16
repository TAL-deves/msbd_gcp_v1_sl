import React from 'react';
import ForgotPassword from '../components/Forgotpassword/ForgotPassword';
import ForgotContext from './ForgotContext';

const ForgotPass = () => {
    return (
        <div>
            <ForgotContext>
            <ForgotPassword/> 
            </ForgotContext>
           
        </div>
    );
};

export default ForgotPass;
