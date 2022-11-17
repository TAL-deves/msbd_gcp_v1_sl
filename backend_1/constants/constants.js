require('dotenv').config();
module.exports = {
//   allowedOrigins: ['http://localhost:3000/'],
//   SERVER_PORT: process.env.PORT || 3000,
//   SERVER_DB_URI: process.env.DB_URI,
  OTP_LENGTH: 5,
  OTP_CONFIG: {
    digits: 5,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  },
  MAIL_SETTINGS: {
    // host: 'app.debugmail.io',
    // port: 25,
    service: "hotmail",

    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }

  },
};
