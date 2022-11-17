const otpGenerator = require('otp-generator');
const { OTP_LENGTH, OTP_CONFIG } = require('../constants/constants');

module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};

// The OTP_LENGTH is a number, For my app i selected 10.
// The OTP_CONFIG is an object that looks like 
// OTP_LENGTH: 5;
// OTP_CONFIG: {
//     digits: 5,
//     lowerCaseAlphabets: false, 
//     upperCaseAlphabets: false,
//     specialChars: false
// };