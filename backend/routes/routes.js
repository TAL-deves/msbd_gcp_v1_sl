// const express = require('express');
// const router = express.Router();
// const signUpTemplateCopy = require('../Database/models/SignUpModels');
// const logger = require("../logger/logger");
// const { sendMail } = require('../services/emailService');
// const { generateOTP } = require('../services/OTP');
// const { getCertificate } = require('../services/certificateGenerator');
// const moment = require("moment");
// const PDFDocument = require("pdfkit");

// const OAuth2Server = require('oauth2-server');
// const Request = OAuth2Server.Request;
// const Response = OAuth2Server.Response;






// router.post('/signup', async (req, res) =>{
//     const user = await signUpTemplateCopy.findOne({
//         username: req.body.username,
//         email: req.body.email
//     })
//     if(user){
//         res.status(409).send({
//             message: 'Email exists!'
//          });
//         logger.log("error","user already exists");
//     }else{
//     const otpGenerated = generateOTP();
//     const signUpUser = new signUpTemplateCopy({
//         fullname:req.body.fullname,
//         username:req.body.username,
//         email:req.body.email,
//         password:req.body.password,
//         otp: otpGenerated
//     });
//     sendMail({
//         to: signUpUser.email,
//         OTP: otpGenerated,
//       });
//     signUpUser.save()
//     .then(data => {
//         res.json(data);
//         logger.log("info","user registered to database");
        
//     })
//     .catch(error =>{
//         res.json(error);
//         logger.log("error","failed to register user");
//     })
//     }
    
// });


// router.post('/login', async (req,res)=>{
//     const user = await signUpTemplateCopy.findOne({
//         email: req.body.email,
//         password: req.body.password
//     })
//     if(user){
//         res.status(200).send({
//             message: `Welcome ${user.username}`
//          });
//     }else{
//         res.status(404).send({
//             message: 'User not found!'
//          });
//     }
// })


// router.get('/user', (req, res) =>{
//     signUpTemplateCopy.find(req, (err, data)=>{
//         if(err){
//             res.sendStatus("there was a server side error!");
//             logger.log("error", "failed to load data");
//         }else{
//             res.send(data);
//             logger.log("info","server data fetched!");
//         }
//     });
// });

// router.post('/verify', async (req, res) => {
//     const { email, otp } = req.body;
//     const user = await validateUserSignUp(email, otp);
//     res.send(user);
// })

// router.post('/videologdata', async (req, res) => {
//     logger.log("info","Video log data!");
//     console.log("triggered video log");
// })

// router.get("/certificate", (req, res) => {

//         username= "Username here"
//         const doc = new PDFDocument({
//             layout: "landscape",
//             size: "A4",
//         });
        
//         // The name
//         // const name = req.body.name;
//         const name = username;
        
//         // Pipe the PDF into an name.pdf file
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", `attachment; filename=${name}.pdf`);
//         doc.pipe(res);
//         // Draw the certificate image
//         doc.image("./images/certificate.png", 0, 0, { width: 842 });
        
//         // Set the font to Dancing Script
//         doc.font("./fonts/DancingScript-VariableFont_wght.ttf");
        
//         // Draw the name
//         doc.fontSize(60).text(name, 20, 265, {
//             align: "center"
//         });
        
//         // Draw the date
//         doc.fontSize(17).text(moment().format("MMMM Do YYYY"),-450, 470,  {
//             align: "center"
//         });
        
//         // Finalize the PDF and end the stream
//         doc.end();
//         // getCertificate("shishir");
//         console.log("certificate is here");
    
// });


  
// const validateUserSignUp = async (email, otp) => {
// const user = await signUpTemplateCopy.findOne({
//     email,
// });
// if (!user) {
//     logger.log("error", "User not found");
//     return ['User not found'];
// }
// else if(user && user.otp !== otp) {
//     logger.log("error", "Invalid OTP");
//     return ['Invalid OTP'];
// }else{
// const updatedUser = await signUpTemplateCopy.findByIdAndUpdate(user._id, {
//     $set: { active: true },
// });
// logger.log("info", `${updatedUser.email} is now active!`);
// return (`${updatedUser.email} is now active!`);
// }
// };




// module.exports = router