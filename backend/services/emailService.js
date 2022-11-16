const nodemailer = require('nodemailer');
const { MAIL_SETTINGS } = require('../constants/constants');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMail = async (params) => {
try {
    let info = await transporter.sendMail({
    from: MAIL_SETTINGS.auth.user,
    to: params.to, 
    subject: 'Verification email',
    html: `
    <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
    >
        <h2>Welcome!</h2>
        <h4>Thank you for registering.</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
    </div>
    `,
    });
    console.log("Email is sent");
    return info;
} catch (error) {
    console.log(error);
    return false;
}
};