const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const routesURLs = require('./routes/routes');
const cors = require("cors");
const {
  logger,
  SMSlogger,
  SSLlogger,
  requestLogger,
  responseLogger,
} = require("./logger/logger");

const { loadExampleData, revokeToken } = require("./auth/model");

const bodyParser = require("body-parser");
const OAuth2Server = require("oauth2-server");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const router = express.Router();

const signUpTemplateCopy = require("./Database/models/SignUpModels");
const courseIdList = require("./Database/models/courses");

const { sendMail } = require("./services/emailService");
const { generateOTP } = require("./services/OTP");
const { getCertificate } = require("./services/certificateGenerator");
const moment = require("moment");
const PDFDocument = require("pdfkit");

const cookieSession = require("cookie-session");
const passport = require("passport");
const passportStrategy = require("./passport");
const expressSession = require("express-session");

const coursesData = require("./data/courses");
const allCourses = require("./data/allCourses");
const allInstructors = require("./data/instructors");

let tokenModel = require("./Database/models/token");

const { v4: uuidv4 } = require("uuid");

dotenv.config();

// ***** API docmentation  ***** //
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// import library and files
const swaggerDocument = require("./swagger.json");
const { response } = require("express");

const crypto = require("crypto");
var CryptoJS = require("crypto-js");

const { encyptMessage } = require("./encryptionService/encrypt");
const { decryptMessage } = require("./encryptionService/decrypt");
const { isError } = require("util");

const bcrypt = require("bcrypt");

const SSLCommerzPayment = require("sslcommerz-lts");
const { sendSms } = require("./services/smsService");
const reviews = require("./Database/models/reviews");
const multer = require("multer");

const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");
const { vdochiper } = require("./services/vdoChipher");
const axios = require("axios");

// const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
// let express to use this
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

mongoose.connect(process.env.DATABASE_CONNECT, function (err, res) {
  if (err) {
    return console.error("Error connecting to DB:", err);
  }
  console.log("Connected successfully to DB");
  // loadExampleData()
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    // origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const myLogger = function (req, res, next) {
  const headers = Object.entries(req.headers);
  let json = {};
  let data = headers.map((itm) => `${itm[0]}: ${itm[1]}`);
  json = { ...data };
  json = Object.assign({}, data);
  json = data.reduce((json, value, key) => {
    json[value.split(":")[0]] = value.split(":")[1];
    return json;
  }, {});
  json["ip"] = req.ip;
  json["url"] = req.url;
  json["method"] = req.method;
  logger.log("info", `${JSON.stringify(json)}`);
  next();
};

// Generate random 16 bytes to use as IV
var IV = CryptoJS.enc.Utf8.parse("1583288699248111");

var keyString = "thisIsAverySpecialSecretKey00000";
// finds the SHA-256 hash for the keyString
var Key = CryptoJS.enc.Utf8.parse(keyString);

var JsonFormatter = {
  stringify: function (cipherParams) {
    // create json object with ciphertext
    var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    // optionally add iv or salt
    if (cipherParams.iv) {
      jsonObj.iv = cipherParams.iv.toString();
    }
    if (cipherParams.salt) {
      jsonObj.s = cipherParams.salt.toString();
    }
    // stringify json object
    return jsonObj;
  },
  parse: function (jsonStr) {
    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: jsonStr,
    });

    return cipherParams;
  },
};

function encrypt(data) {
  var encryptedCP = CryptoJS.AES.encrypt(data, Key, { iv: IV });
  var cryptText = encryptedCP.toString();
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cryptText),
    formatter: JsonFormatter,
  });
  return cipherParams.toString();
}

//! Starting of  ***** Encryption and decryption *****

let decryptionOfData = (req, res) => {
  try {
    let resp;
    resp = req.body;
    const { request, passphase } = resp;

    var decryptedFromText = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(request) },
      Key,
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
      }
    );

    let obj = decryptedFromText.toString(CryptoJS.enc.Utf8);

    if (typeof obj === "string" && obj.startsWith("g")) {
      return obj;
    }
    return JSON.parse(obj);
  } catch (err) {
    console.log("Error log:     " + err.message);
    return err.message;
  }
};

let encryptionOfData = (data) => {
  let encryptionData = encrypt(JSON.stringify(data));

  let encryptedData = {
    request: encryptionData,
    passphase: IV.toString(),
  };

  return encryptedData;
};
//? Ending of ***** Encryption and decryption *****

//! Starting of ***** response *****
class sendResponseData {
  constructor(data, status, errMsg) {
    this.data = data;
    // this.isError = isError;
    this.status = status;
    this.errMsg = errMsg;
  }
  success() {
    return {
      data: this.data,
      result: {
        isError: false,
        status: this.status,
        errMsg: null,
      },
    };
  }
  successWithMessage() {
    return {
      data: this.data,
      result: {
        isError: false,
        status: this.status,
        errMsg: this.errMsg,
      },
    };
  }
  error() {
    return {
      data: null,
      result: {
        isError: true,
        status: this.status,
        errMsg: this.errMsg,
      },
    };
  }
}
//? Ending of ***** response *****

app.use(myLogger);

// ! ******* Social Login API *******/ (Encryption done)
app.get("/api/login/success", (req, res) => {
  if (req.session) {
    let setSendResponseData = new sendResponseData("Success", 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  } else {
    let setSendResponseData = new sendResponseData(null, 403, "Not Authorized");
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    res.send(responseToSend);
  }
});

app.get("/api/login/failed", (req, res) => {
  let setSendResponseData = new sendResponseData(null, 401, "Log in failure");
  let responseToSend = encryptionOfData(
    setSendResponseData.successWithMessage()
  );

  res.send(responseToSend);
});

app.get("/api/google", passport.authenticate("google", ["profile", "email"]));
app.get(
  "/api/facebook",
  passport.authenticate("facebook", ["profile", "email"])
);

app.get(
  "/api/google/callback",
  passport.authenticate("google", {
    // successRedirect: process.env.CLIENT_URL_DEVELOPMENT,
    failureRedirect: process.env.GOOGLE_FAILED_URL_DEVELOPMENT,
    // session: false,
  }),
  async function (req, res) {
    // res.redirect(process.env.CLIENT_URL_DEVELOPMENT);
    // res.redirect("/");
    // console.log(req)
    const userid = req.session.passport.user.googleId;
    const userinfo = req.session.passport.user.profilename;
    // console.log("userid : ", userid, userinfo);
    var options = {
      body: {
        grant_type: "password",
        username: userid,
        password: userid,
        loginMethod: "google",
        profileName: userinfo,
      },
      headers: {
        "user-agent": "Thunder Client (https://www.thunderclient.com)",
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded",
        authorization: "Basic YXBwbGljYXRpb246c2VjcmV0",
        "content-length": "81",
        "accept-encoding": "gzip, deflate, br",
        host: process.env.SERVER_URL_DEVELOPMENT,
        connection: "close",
      },
      method: "POST",
      query: {},
    };

    let token = await obtainToken(options);
    let foundtoken = token;

    let setSendResponseData = new sendResponseData(foundtoken);

    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    res.redirect(
      process.env.CLIENT_URL +
        `login?gusername=${userid}&gobject=${JSON.stringify(
          setSendResponseData
        )}&profilename=${userinfo}`
    );
  }
);
app.get(
  "/api/facebook/callback",
  passport.authenticate("facebook", {
    // successRedirect: process.env.CLIENT_URL_DEVELOPMENT+"/askdhkasd",
    failureRedirect: process.env.FACEBOOK_FAILED_URL,
  }),
  async function (req, res) {
    // console.log(req);
    // res.redirect('http://www.google.com');
    const userid = req.user.username;
    const profilename = req.user.profilename;
    // console.log("USER ID:   "+ req.user);
    // console.log(req.user.username);
    var options = {
      body: {
        grant_type: "password",
        username: userid,
        password: userid,
        loginMethod: "facebook",
      },
      headers: {
        "user-agent": "Thunder Client (https://www.thunderclient.com)",
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded",
        authorization: "Basic YXBwbGljYXRpb246c2VjcmV0",
        "content-length": "81",
        "accept-encoding": "gzip, deflate, br",
        host: process.env.SERVER_URL,
        connection: "close",
      },
      method: "POST",
      query: {},
    };

    let token = await obtainToken(options);
    let foundtoken = token;

    let setSendResponseData = new sendResponseData(foundtoken);

    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    res.redirect(
      process.env.CLIENT_URL +
        `login?fusername=${userid}&fobject=${JSON.stringify(
          setSendResponseData
        )}&fprofilename=${profilename}`
    );
  }
);

// ! ******* Clearing previous token data *******/ (Encryption done)
app.post("/api/clearalltoken", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;
  
    const { username } = req.body;
    await tokenModel
      .findOneAndDelete({
        username: username,
      })
      .then(async (data) => {
        await signUpTemplateCopy.findOneAndUpdate(
          {
            username: username,
          },
          {
            $set: {
              loggedinID: "",
            },
          }
        );
        let setSendResponseData = new sendResponseData(
          "All session is ended!",
          200,
          null
        );
        let responseToSend = encryptionOfData(setSendResponseData.success());

        res.send(responseToSend);
      })
      .catch((e) => {
        let setSendResponseData = new sendResponseData(
          null,
          404,
          "No data found!"
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );

        res.send(responseToSend);
      });
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

// ! ******* Email checking API *******/ (Encryption done)
app.post("/api/checkuser", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const user = await signUpTemplateCopy.findOne({
    email: req.body.email,
  });

  if (user) {
    let setSendResponseData = new sendResponseData(
      null,
      409,
      "Email exists in database"
    );
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );
    res.send(responseToSend);
  } else {
    let setSendResponseData = new sendResponseData("Success", 200, null);
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );
    res.send(responseToSend);
  }
});

// ! ******* Sign up API *******/ (Encryption done)
app.post("/api/signup", async (req, res, next) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const user = await signUpTemplateCopy.findOne({
    email: req.body.email,
  });

  if (user) {
    let setSendResponseData = new sendResponseData(
      null,
      409,
      "Email exists in database"
    );
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    res.send(responseToSend);
  } else {
    const otpGenerated = generateOTP();
    const signUpUser = new signUpTemplateCopy({
      fullname: req.body.fullname,
      username: req.body.email,
      email: req.body.email,
      password: req.body.password,
      otp: otpGenerated,
    });

    sendMail({
      to: signUpUser.email,
      OTP: otpGenerated,
    });

    // console.log(req.body);
    // let smssent = JSON.parse(await sendSms({
    //   reciever: req.body.phoneNumber,
    //   OTP: otpGenerated
    // }))
    // if(smssent.status_code === 200){
    signUpUser.save();
    //   if (signUpUser) {
    let setSendResponseData = new sendResponseData(
      "User registered!",
      202,
      null
    );
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    res.send(responseToSend);
  }
});

// ! ******* verification API *******/ (Encryption done)
app.post("/api/verify", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);
  // res.json(user);
  let setSendResponseData = new sendResponseData(
    user,
    user.result.status,
    user.result.errorMsg
  );
  let responseToSend = encryptionOfData(
    setSendResponseData.successWithMessage()
  );

  res.send(responseToSend);
});

//! ******* Resend OTP API *******/ (encryption done)
app.post("/api/resend-otp", async (req, res) => {
  // send email adderss to DB and generate an otp then send to that email

  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const user = await signUpTemplateCopy.findOne({
    email: req.body.email,
    active: false,
  });

  if (!user) {
    res.send({
      data: {
        message: "Account not found!",
        otp: null,
      },
      result: {
        isError: false,
        status: 401,
        errorMsg: "Unauthorized",
      },
    });
  } else {
    // Checking OPT try left in user DB
    let otpretrycount = user.otpretrycount;

    if (otpretrycount > 0 && otpretrycount <= 3) {
      otpretrycount--; // Decrementing by 1 for each try
      let OTPtryleft = otpretrycount;
      const otpGenerated = generateOTP(); // Gerenrating a otp

      //   console.log(otpGenerated + "  " + resetOtpCount); // Debugging console view

      let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
        {
          email: req.body.email,
          locked: false,
        },
        {
          $set: {
            otp: otpGenerated,
            otpretrycount: OTPtryleft,
            active: false,
            locked: false,
          },
        }
      ); // Updating user profile DB with new OTP and changing lock status to false

      sendMail({
        to: user.email,
        OTP: otpGenerated,
      }); // Sending OTP to email address

      // sendSms({
      //   reciever: user.email,
      //   OTP: otpGenerated,
      // });

      if (signUpUser) {
        let setSendResponseData = new sendResponseData(
          `${OTPtryleft}`,
          302,
          null
        );
        let responseToSend = encryptionOfData(setSendResponseData.success());

        res.send(responseToSend);
      } // Sending user information as response
      else {
        let setSendResponseData = new sendResponseData(
          null,
          500,
          "Internal Server Error"
        );
        let responseToSend = encryptionOfData(setSendResponseData.error());

        res.send(responseToSend);
      } // Sending Error as response
    } else {
      //   try {

      await signUpTemplateCopy
        .findOneAndDelete({
          email: req.body.email,
        })
        .then(() => {
          let setSendResponseData = new sendResponseData(
            "User account deleted!",
            406,
            "Not Acceptable"
          );
          let responseToSend = encryptionOfData(
            setSendResponseData.successWithMessage()
          );

          res.send(responseToSend);
        });
    }
  }
});

//! ******* users API *******/ (encryption done)
app.post("/api/user", async (req, res, next) => {
  let datas = await signUpTemplateCopy.find();
  try {
    // let allCoursesList = allCourses.coursesData
    let setSendResponseData = new sendResponseData(datas, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 404, error.message);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});
app.post("/api/userdetails", async (req, res, next) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;
  console.log(req.body.username);
  let datas = await tokenChecking(req);

  console.log("token checking status ----- ", datas);
  // try {
  let setSendResponseData = new sendResponseData(datas, 200, null);
  let responseToSend = encryptionOfData(setSendResponseData.success());

  res.send(responseToSend);
  // } catch (error) {
  //   let setSendResponseData = new sendResponseData(null, 404, error.message);
  //   let responseToSend = encryptionOfData(setSendResponseData.success());

  //   res.send(responseToSend);
  // }
});

//! ******* videologdata API *******/
app.post("/api/videologdata", async (req, res) => {
  // console.log("triggered video log");
  // console.log(req);
});

//! ******* certificate API *******/
app.get("/api/certificate", (req, res) => {
  username = "Username here";
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  // The name
  // const name = req.body.name;
  const name = username;

  // Pipe the PDF into an name.pdf file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${name}.pdf`);
  doc.pipe(res);
  // Draw the certificate image
  doc.image("./images/certificate.png", 0, 0, { width: 842 });

  // Set the font to Dancing Script
  doc.font("./fonts/DancingScript-VariableFont_wght.ttf");

  // Draw the name
  doc.fontSize(60).text(name, 20, 265, {
    align: "center",
  });

  // Draw the date
  doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -450, 470, {
    align: "center",
  });

  // Finalize the PDF and end the stream
  doc.end();
  // getCertificate("shishir");
  console.log("certificate is here");
});

//! ******* obtainToken/LOGIN API *******/
app.post("/api/oauth/token", async (req, res, next) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  req.headers["Content-type"] = "application/x-www-form-urlencoded";

  let object = req.body;

  let upObj = object.split("&");

  let jsonData = {};

  for (let i = 0; i < upObj.length; i++) {
    let upObject = upObj[i].split("=");
    jsonData[upObject[0]] = upObject[1];
  }

  req.body = jsonData;

  await signUpTemplateCopy
    .findOne({
      username: req.body.username,
    })
    .then(async (data) => {
      if (!data) {
        let setSendResponseData = new sendResponseData(
          null,
          401,
          "No user found!"
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );

        res.send(responseToSend);
      } else {
        // const inMatch = await bcrypt.compare(req.body.password, data.password)
        await bcrypt
          .compare(req.body.password, data.password)
          .then((result) => {
            if (result) {
              let token = obtainToken(req, res, async (obj) => {
                let userLoginInfo = await signUpTemplateCopy.findOne({
                  username: req.body.username,
                });

                if (!userLoginInfo.loggedinID) {
                  const newId = uuidv4();
                  await userLoginInfo.updateOne({
                    loggedinID: newId,
                  });
                  console.log("\ntrying to send response", obj);
                  let setSendResponseData = new sendResponseData(
                    obj,
                    200,
                    null
                  );
                  let responseToSend = encryptionOfData(
                    setSendResponseData.successWithMessage()
                  );
                  console.log("successfull login");
                  res.send(responseToSend);
                } else {
                  let setSendResponseData = new sendResponseData(
                    obj,
                    409,
                    "An active session found!"
                  );
                  let responseToSend = encryptionOfData(
                    setSendResponseData.error()
                  );

                  res.send(responseToSend);
                }
              });
            } else {
              let setSendResponseData = new sendResponseData(
                null,
                401,
                "Password incorrect!"
              );
              let responseToSend = encryptionOfData(
                setSendResponseData.error()
              );

              res.send(responseToSend);
            }
            // let token = obtainToken(req, res, async (obj) => {
            //   let userLoginInfo = await signUpTemplateCopy.findOne({
            //     username: req.body.username,
            //   });

            //   if (!userLoginInfo.loggedinID) {
            //     const newId = uuidv4();
            //     await userLoginInfo.updateOne({
            //       loggedinID: newId,
            //     });
            //     // console.log("\ntrying to send response", obj);
            //     let setSendResponseData = new sendResponseData(
            //       obj,
            //       403,
            //       "Active Session found"
            //     );
            //     let responseToSend = encryptionOfData(
            //       setSendResponseData.successWithMessage()
            //     );
            //     console.log("Active Session found");
            //     res.send(responseToSend);
            //   } else {
            //     let setSendResponseData = new sendResponseData(
            //       obj,
            //       409,
            //       "An active session found!"
            //     );
            //     let responseToSend = encryptionOfData(setSendResponseData.error());

            //     res.send(responseToSend);
            //   }
            // });
          })
          .catch((e) => {
            let setSendResponseData = new sendResponseData(
              "Error in password decryption",
              500,
              e.message
            );
            let responseToSend = encryptionOfData(setSendResponseData.error());

            res.send(responseToSend);
          });
      }
    })
    .catch((e) => {
      console.log("Inside catch of API", e.message);
      let setSendResponseData = new sendResponseData(null, 500, e.message);
      let responseToSend = encryptionOfData(setSendResponseData.error());

      res.send(responseToSend);
    });
});

//! ******* User Profile API *******/
// app.post("/api/userprofile", async (req, res) => {
//   var request = new Request(req);
//   var response = new Response(res);

//   const fromClient = request.headers.authorization;
//   var tokenArray = fromClient.split(" ");
//   var token = tokenArray[1];
//   var tokenObj = {
//     accessToken: token,
//   };

//   revokeToken(tokenObj);

//   let anytoken = await tokenModel.findOne({ accessToken: token });

//   // await signUpTemplateCopy.findOneAndUpdate({
//   //   username: anytoken.user.username
//   // },
//   // {$set:{
//   //   loggedinID: ""
//   // }})
//   // console.log(anytoken);
//   if (anytoken) {
//     // console.log("showing if any token is available: ",anytoken);
//     res.json({
//       data: {
//         message: "Token removed!",
//       },
//       result: {
//         isError: false,
//         status: 200,
//         errorMsg: "",
//       },
//     });
//   } else {
//     res.json({
//       data: {
//         message: null,
//       },
//       result: {
//         isError: false,
//         status: 200,
//         errorMsg: "Token not found. Already logged out!",
//       },
//     });
//   }
// });

app.post("/api/userprofile", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  try {
    let userProfileData = await signUpTemplateCopy.findOne({
      username: req.body.username,
    });

    // getOrSetCache(`/userProfilepictures/${req.body.username}.webp`, () => {
    // let fsreaddata =  fs.readFile(
    //     `/userProfilepictures/${req.body.username}.webp`,
    //     function (err, data) {
    //       console.log(`${req.body.username}.webp`, data);
    //     }
    //   );
    //   console.log("fs read data",fsreaddata)
    // });

    if (userProfileData) {
      let setSendResponseData = new sendResponseData(
        userProfileData,
        200,
        null
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "user not found!"
      );
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData("", 500, error);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

// var upload = multer({ dest: "userProfilepictures/" });

app.post("/api/uploadimage", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;
  // console.log("req.body : ---- ", req.body);

  const url = req.protocol + "://" + req.get("host");
  const profileImg = url + /userProfilepictures/ + req.body.username;

  // console.log(profileImg);

  let userProfileUpdate = await signUpTemplateCopy.findOneAndUpdate(
    {
      username: req.body.username,
    },
    {
      $set: {
        // profilephoto: req.file.path
        profilephoto: profileImg,
      },
    }
  );

  let base64String = req.body.webimage;
  let base64Image = base64String.split(";base64,").pop();

  // const buffer = Buffer.from(base64Image, "base64");
  // Jimp.read(buffer, (err, res) => {
  //   if (err) throw new Error(err);
  //   res.quality(5).write("userProfilepictures/resized.jpg");
  // });

  // console.log("base64String",base64String);

  // fs.writeFile(
  //   `userProfilepictures/${req.body.username}`,
  //   base64String,
  //   { encoding: "base64" },
  //   function (err) {
  //     console.log("File created");
  //   }
  // );
  // console.log("Uploaded image ",base64Image)

  let writeBuffer = new Buffer.from(base64Image, "base64");
  fs.writeFileSync(`./userProfilepictures/${req.body.username}`, writeBuffer);
  // redisClient.setex(
  //   `${req.body.username}`,
  //   30,
  //   JSON.stringify(writeBuffer),
  // );

  // console.log(userProfileUpdate);

  // var data = fs.readFileSync(path.join(__dirname + '/userProfilepictures/' + req.body.username))
  // const data = await fs.readFile('/Users/techanalyticaltd/Desktop/Coding/MindSchoolBD/Development/Backend/userProfilepictures/test@test.com', {encoding: 'base64'});

  // console.log(data)

  // let readBuffer = fs.readFileSync(`./userProfilepictures/${req.body.username}`);
  // let base64data = readBuffer.toString('base64');

  let setSendResponseData = new sendResponseData(userProfileUpdate, 200, "");
  let responseToSend = encryptionOfData(setSendResponseData.success());
  res.send(responseToSend);
});
app.post("/api/getuserimage", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  try {
    let userProfileData = await signUpTemplateCopy.findOne({
      username: req.body.username,
    });

    let readBuffer = "";
    // try {
    //  redisClient.get(`${req.body.username}`, async (error, data) => {
    //     if (error){
    //       console.log("error redis error");
    //       let setSendResponseData = new sendResponseData("", 500, error);
    // let responseToSend = encryptionOfData(setSendResponseData.error());
    // res.send(responseToSend);
    //     }

    //     if (data != null){
    //       console.log("outside redis --", data);
    //       readBuffer = data;
    //     } else {
    //       console.log("inside db");
    //       readBuffer = fs.readFileSync(`./userProfilepictures/${req.body.username}`);
    //       console.log("inside readBuffer  ", readBuffer);
    //     }
    //   });

    readBuffer = fs.readFileSync(`./userProfilepictures/${req.body.username}`);
    // console.log(readBuffer);
    let base64data = readBuffer.toString("base64");
    let base64Image = base64data.split("base64").pop();
    if (base64Image.startsWith("/9")) {
      base64Image = "data:image/jpeg;base64," + base64Image;
    } else {
      base64Image = base64Image.replace("A=", "I");
      base64Image = "data:image/png;base64," + base64Image;
    }
    // console.log("this is the image  ",base64Image);

    if (userProfileData) {
      let setSendResponseData = new sendResponseData(base64Image, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "user not found!"
      );
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );
      res.send(responseToSend);
    }
    // } catch (error) {
    //   console.log("No file found");
    //   let setSendResponseData = new sendResponseData("", 500, error);
    //   let responseToSend = encryptionOfData(error);
    //   res.send(responseToSend);
    // }
  } catch (error) {
    let setSendResponseData = new sendResponseData("", 500, error);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
app.post("/api/updateuserprofile", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  console.log("User data updates", req.body);

  try {
    let userProfileData = await signUpTemplateCopy.findOneAndUpdate(
      {
        username: req.body.username,
      },
      {
        $set: {
          profession: req.body.profession,
          age: req.body.age,
        },
      }
    );

    if (userProfileData) {
      let setSendResponseData = new sendResponseData(
        userProfileData,
        200,
        null
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "user not found!"
      );
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData("", 500, error);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/usercourses", async (req, res) => {
  // let recievedResponseData = decryptionOfData(req, res);
  // req.body = JSON.parse(JSON.parse(recievedResponseData));

  let userProfileData = await signUpTemplateCopy.findOne({
    username: req.body.username,
  });

  const getInstructor = (id) => {
    const found = instructorData.find((instructor) => instructor._id == id);
    if (!found) return "Instructor not found!";
    found.courses = found.courses.map((course) =>
      coursesData.find((courseData) => courseData._id === course)
    );
    return found;
  };

  console.log(getInstructor(1));
  console.log(getInstructor(2));
  console.log(getInstructor(3));

  // console.log(JSON.parse(userProfileData.purchasedCourses[0]));
  res.send(userProfileData.purchasedCourses);
});

//! ******* logout API *******/ (encryption done)
app.post("/api/logout", async (req, res) => {
  // let recievedResponseData = decryptionOfData(req, res);
  // req.body = JSON.parse(JSON.parse(recievedResponseData));

  var request = new Request(req);
  // var response = new Response(res);
  // console.log("request.headers.authorization",request);
  try {
    const fromClient = request.headers.authorization;
    console.log("fromClient", fromClient);
    if (fromClient) {
      var tokenArray = fromClient.split(" ");
      var token = tokenArray[1];
      var tokenObj = {
        accessToken: token,
      };
      console.log("tokenObj", tokenObj);
      revokeToken(tokenObj);

      let anytoken = await tokenModel.findOne({ accessToken: token });

      try {
        if (anytoken) {
          let setSendResponseData = new sendResponseData(
            "Log out successfull",
            200,
            null
          );
          let responseToSend = encryptionOfData(setSendResponseData.success());

          res.send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            404,
            "Token not found. Already logged out!"
          );
          let responseToSend = encryptionOfData(
            setSendResponseData.successWithMessage()
          );

          res.send(responseToSend);
        }
      } catch (error) {
        let setSendResponseData = new sendResponseData(
          null,
          500,
          error.message
        );
        let responseToSend = encryptionOfData(setSendResponseData.error());

        res.send(responseToSend);
      }
    } else {
      let setSendResponseData = new sendResponseData(null, 404, "No token!");
      let responseToSend = encryptionOfData(setSendResponseData.error());

      res.send(responseToSend);
    }
  } catch {
    let setSendResponseData = new sendResponseData(
      null,
      500,
      "Error on server side"
    );
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

//! ******* Forget password API *******/
app.post("/api/forget-password", async (req, res) => {
  // console.log("send email adderss to DB and generate an otp then send to that email");

  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const user = await signUpTemplateCopy.findOne({
    email: req.body.email,
    locked: false,
  });

  if (!user) {
    let setSendResponseData = new sendResponseData(
      null,
      404,
      "Account not found or is locked"
    );
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );
    res.send(responseToSend);
  } else {
    // Checking OPT try left in user DB
    let resetOtpCount = user.resetotpcount;

    if (resetOtpCount > 0 && resetOtpCount <= 3) {
      resetOtpCount--; // Decrementing by 1 for each try
      let OTPtryleft = resetOtpCount;
      const otpGenerated = generateOTP(); // Gerenrating a otp

      console.log(otpGenerated + "  " + resetOtpCount); // Debugging console view

      let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
        {
          email: req.body.email,
          locked: false,
        },
        {
          $set: {
            otp: otpGenerated,
            resetotpcount: resetOtpCount,
            active: false,
            locked: false,
          },
        }
      ); // Updating user profile DB with new OTP and changing lock status to false

      sendMail({
        to: user.email,
        OTP: otpGenerated,
      }); // Sending OTP to email address

      // sendSms({
      //   reciever: user.email,
      //   OTP: otpGenerated,
      // });

      if (signUpUser) {
        let setSendResponseData = new sendResponseData("OTP sent!", 202, null);
        let responseToSend = encryptionOfData(setSendResponseData.success());

        res.send(responseToSend);
      } // Sending user information as response
      else {
        let setSendResponseData = new sendResponseData(
          null,
          500,
          "Internal server error"
        );
        let responseToSend = encryptionOfData(setSendResponseData.error());

        res.send(responseToSend);
      } // Sending Error as response
    } else {
      let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
        {
          email: req.body.email,
          locked: false,
        },
        {
          $set: {
            resetotpcount: 3,
            active: false,
            locked: true,
          },
        }
      ); // Updating User Info in DB (Account Locked as max try done)

      if (signUpUser) {
        let setSendResponseData = new sendResponseData(
          "Account locked! You have used max OTP request",
          403,
          null
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );

        res.send(responseToSend);
      } // Sending Max OTP try messge as response
      else {
        let setSendResponseData = new sendResponseData(
          null,
          401,
          "Unauthorized"
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );

        res.send(responseToSend);
      } // Sending error as response
    }
  }
});

app.post("/api/request-password", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const { email, otp } = req.body; //getting data from request
  const user = await validateUserSignUp(email, otp); //validating user with OTP
  // res.json(user); //Sending response
  let setSendResponseData = new sendResponseData(user, 200, null);
  let responseToSend = encryptionOfData(setSendResponseData.success());

  res.send(responseToSend);
});
//! ******* Resend OTP API *******/ (encryption done)
app.post("/api/resend-otp-forgotpassword", async (req, res) => {
  // send email adderss to DB and generate an otp then send to that email

  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const user = await signUpTemplateCopy.findOne({
    email: req.body.email,
    active: false,
  });

  if (!user) {
    res.send({
      data: {
        message: "Account not found!",
        otp: null,
      },
      result: {
        isError: false,
        status: 401,
        errorMsg: "Unauthorized",
      },
    });
  } else {
    // Checking OPT try left in user DB
    let otpretrycount = user.otpretrycount;

    if (otpretrycount > 0 && otpretrycount <= 3) {
      otpretrycount--; // Decrementing by 1 for each try
      let OTPtryleft = otpretrycount;
      const otpGenerated = generateOTP(); // Gerenrating a otp

      //   console.log(otpGenerated + "  " + resetOtpCount); // Debugging console view

      let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
        {
          email: req.body.email,
          locked: false,
        },
        {
          $set: {
            otp: otpGenerated,
            otpretrycount: OTPtryleft,
            active: false,
            locked: false,
          },
        }
      ); // Updating user profile DB with new OTP and changing lock status to false

      sendMail({
        to: user.email,
        OTP: otpGenerated,
      }); // Sending OTP to email address

      if (signUpUser) {
        let setSendResponseData = new sendResponseData(
          `${OTPtryleft}`,
          302,
          null
        );
        let responseToSend = encryptionOfData(setSendResponseData.success());

        res.send(responseToSend);
      } // Sending user information as response
      else {
        let setSendResponseData = new sendResponseData(
          null,
          500,
          "Internal Server Error"
        );
        let responseToSend = encryptionOfData(setSendResponseData.error());

        res.send(responseToSend);
      } // Sending Error as response
    } else {
      //   try {

      await signUpTemplateCopy
        .findOneAndUpdate(
          {
            email: req.body.email,
          },
          {
            $set: {
              locked: true,
            },
          }
        )
        .then(() => {
          let setSendResponseData = new sendResponseData(
            "User account deleted!",
            406,
            "Not Acceptable"
          );
          let responseToSend = encryptionOfData(
            setSendResponseData.successWithMessage()
          );

          res.send(responseToSend);
        });
    }
  }
});
app.post("/api/reset-password", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  const { email, otp } = req.body;

  let newPassword = await bcrypt.hash(req.body.password, 12);
  const user = await signUpTemplateCopy.findOneAndUpdate(
    {
      email: email,
      otp: otp,
    },
    {
      password: newPassword,
    }
  );
  if (!user) {
    let setSendResponseData = new sendResponseData(
      null,
      404,
      "Account not found or is locked"
    );
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );
    res.send(responseToSend);
  } else {
    let setSendResponseData = new sendResponseData(
      "Password reset successful!",
      202,
      null
    );
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
  }
});
/**************/

//! ******** Course VIDEO API ******** (encryption done)
app.post("/api/allcourses", (req, res, next) => {
  try {
    let setSendResponseData = new sendResponseData(allCourses, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 404, error);

    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

app.post("/api/course", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  let courseid = req.body.courseID;
  // console.log("this is course id",courseid);

  // let result = allCourses.coursesData.map((d)=>{
  //   console.log("this is data", d.courseID);
  // })

  try {
    // let tokenCheckingResult = await tokenChecking(req, res);
    // console.log(tokenCheckingResult.result.isError);
    // if (!tokenCheckingResult.result.isError) {
    // let grabCourse = coursesData.coursesData;
    // let result = courses.coursesData.find(
    //   (item) => item.courseID === courseid
    // );
    // let result = coursesData.coursesData.find(
    //   (item) => item.courseID === courseid
    // )

    // let result = allCourses.map((d)=>{
    //   console.log(d);
    // })

    let result = coursesData.coursesData.find(
      (item) => item.courseID === courseid
    );

    if (result) {
      let setSendResponseData = new sendResponseData(result, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);

      // res.json({
      //   data: {
      //     message: result,
      //   },
      //   result: {
      //     isError: false,
      //     status: 200,
      //     errMsg: "",
      //   },
      // });
    } else {
      // res.json({
      //   data: {
      //     message: null,
      //   },
      //   result: {
      //     isError: false,
      //     status: 404,
      //     errMsg: "No data found!",
      //   },
      // });
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "No data found!"
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    }

    // } else {
    //   res.json({
    //     data: {
    //       courseData: null,
    //     },
    //     result: {
    //       isError: false,
    //       status: 400,
    //       errMsg: "Unauthorized Token",
    //     },
    //   });
    // }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
    // res.json({
    //   data: {
    //     message: null,
    //   },
    //   result: {
    //     isError: true,
    //     status: 500,
    //     errMsg: error,
    //   },
    // });
  }
});
app.post("/api/instructorcourses", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  let courseid = req.body.courseID;

  try {
    let result = allCourses.coursesData.find(
      (item) => item.courseID === courseid
    );

    if (result) {
      let setSendResponseData = new sendResponseData(result, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "No data found!"
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/addcoursedata", async (req, res) => {
  const data = req.body; //getting data from request

  await courseIdList
    .insertMany(data)
    .then(() => {
      res.send("Data inserted!");
    })
    .catch((err) => {
      res.send(err);
    });
});

//! ********** Instructor part ***********/

app.post("/api/allinstructors", (req, res) => {
  try {
    let setSendResponseData = new sendResponseData(allInstructors, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);

    // res.json({
    //   data: {
    //     instructorData: allInstructors,
    //   },
    //   result: {
    //     isError: false,
    //     status: 200,
    //     errMsg: null,
    //   },
    // });
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 200, "server error");
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/instructor", (req, res) => {
  let instructorID = req.body.instructorID;

  try {
    let result = allInstructors.instructorData.find(
      (item) => item._id === instructorID
    );
    if (result) {
      res.json({
        data: {
          message: result,
        },
        result: {
          isError: false,
          status: 200,
          errMsg: null,
        },
      });
    } else {
      res.json({
        data: {
          message: null,
        },
        result: {
          isError: false,
          status: 404,
          errMsg: "No data found for this ID",
        },
      });
    }
  } catch (error) {
    res.json({
      data: {
        message: null,
      },
      result: {
        isError: true,
        status: 404,
        errMsg: error,
      },
    });
  }
});

//! ********** Purchase A course ***********/ (Encryption done)

// app.post("/api/buy", async (req, res) => {

//   let tokenstatus = await tokenChecking(req,res);

//   console.log("token status: ---- ", tokenstatus);

//   if(tokenstatus){
//     let recievedResponseData = decryptionOfData(req, res);
//     req.body = JSON.parse(JSON.parse(recievedResponseData));

//     // const { email, courseList } = req.body; //getting data from request
//     const email = req.body.email;
//     const courseList = req.body.courseList;

//     console.log("data - ", req.body);

//     let currentDate = new Date();
//     let currentDateMiliseconds = currentDate.getTime();

//     let courseExpiresMiliseconds =
//       currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
//     let courseExpires = new Date(courseExpiresMiliseconds);

//     await signUpTemplateCopy
//       .findOneAndUpdate(
//         {
//           email: email,
//         },
//         {
//           $push: {
//             purchasedCourses: {
//               courseid: courseList,
//               purchaseDate: currentDate,
//               expireAt: courseExpires,
//             },
//           },
//         }
//       )
//       .then(() => {
//         // res.send("inserted");
//         let setSendResponseData = new sendResponseData("Inserted", 200, null);
//         let responseToSend = encryptionOfData(
//           setSendResponseData.successWithMessage()
//         );
//         res.send(responseToSend);
//       })
//       .catch((err) => {
//         // res.send("error", err);
//         let setSendResponseData = new sendResponseData(null, 500, err.message);
//         let responseToSend = encryptionOfData(
//           setSendResponseData.error()
//         );
//         res.send(responseToSend);
//       });
//   } else {
//     let setSendResponseData = new sendResponseData(null, 401, "Unauthorized");
//     let responseToSend = encryptionOfData(
//       setSendResponseData.error()
//     );
//     res.send(responseToSend);
//   }

// });

//! ********** Token portoion ***********/

const validateUserSignUp = async (email, otp) => {
  const user = await signUpTemplateCopy.findOne({
    email,
  });
  if (!user) {
    let msg = {
      data: null,
      result: {
        isError: true,
        status: 404,
        errorMsg: "User not found",
      },
    };
    return msg;
  } else if (user && user.otp !== otp) {
    let msg = {
      data: null,
      result: {
        isError: true,
        status: 406,
        errorMsg: "Invalid OTP | Not Acceptable",
      },
    };
    return msg;
  } else {
    const updatedUser = await signUpTemplateCopy.findByIdAndUpdate(user._id, {
      $set: {
        active: true,
      },
    });
    let msg = {
      data: `${updatedUser.email} is now active!`,
      result: {
        isError: false,
        status: 202,
        errorMsg: "",
      },
    };
    return msg;
  }
};

async function tokenChecking(req, res) {
  var request = new Request(req);
  const fromClient = request.headers.authorization;

  console.log("fromClient ---- ", fromClient);

  if (fromClient) {
    var tokenArray = fromClient.split(" ");
    var token = tokenArray[1];
    let tokenObj = await tokenModel.findOne({
      accessToken: token,
    });
    if (tokenObj) {
      let currentDate = new Date().getTime();
      let tokenExpires = new Date(tokenObj.accessTokenExpiresAt).getTime();
      let expiry = (tokenExpires - currentDate) / 1000;

      if (expiry < 0) {
        let tokenExpiryStatus = {
          data: null,
          result: {
            isError: true,
            status: 400,
            errMsg: "token is expired",
          },
        };
        console.log("Token expired");
        return tokenExpiryStatus;
        // return false;
      } else {
        let tokenExpiryStatus = {
          data: tokenObj,
          result: {
            isError: false,
            status: 200,
            errMsg: "Token is still active",
          },
        };
        console.log("Token is still active");
        return tokenExpiryStatus;
        // return true;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

app.oauth = new OAuth2Server({
  model: require("./auth/model"),
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME,
  allowBearerTokensInQueryString: true,
});

function obtainToken(req, res, callback) {
  var request = new Request(req);
  var response = new Response(res);

  return app.oauth
    .token(request, response)
    .then(function (token) {
      let tokenDetails = {
        access_token: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refresh_token: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        user: token.user.username,
        expiryTime: token.expiryTime,
      };

      let sendResponse = {
        data: tokenDetails,
        result: {
          isError: false,
          status: 200,
          errorMsg: "",
        },
      };
      // console.log("Send response ---- ", sendResponse, "Re --", request.body);
      if (request.body.loginMethod === "google") {
        // console.log("Inside google method", sendResponse);
        return sendResponse;
      } else if (request.body.loginMethod === "facebook") {
        // console.log("sent from fb" + sendResponse);
        return sendResponse;
      } else {
        callback(sendResponse);
      }
    })
    .catch(function (err) {
      console.log("this is inside token catch!", err.message);

      let setSendResponseData = new sendResponseData(null, 404, err.message);
      let responseToSend = encryptionOfData(setSendResponseData.error());

      return responseToSend;
      // res.send(responseToSend);
    });
}

//! Payment API's SSLcommerz

app.post("/api/buy", async (req, res) => {
  let tokenstatus = await tokenChecking(req, res);

  console.log("token status: ---- ", tokenstatus);

  if (tokenstatus) {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = JSON.parse(JSON.parse(recievedResponseData));

    // const { email, courseList } = req.body; //getting data from request
    const name = req.body.user;
    const phone = "01234567891";
    const email = "test@test.com";
    const courseList = req.body.courseList;
    const total = 1000;

    console.log("data - ", req.body);

    const data = {
      total_amount: parseFloat(total),
      currency: "BDT",
      tran_id: "REF123",
      success_url: `${process.env.ROOT}/api/ssl-payment-success`,
      fail_url: `${process.env.ROOT}/api/ssl-payment-fail`,
      cancel_url: `${process.env.ROOT}/api/ssl-payment-cancel`,
      ipn_url: `${process.env.ROOT}/api/ssl-payment-notification`,
      shipping_method: "No",
      product_name: "Meditation course",
      product_category: "Courses",
      product_profile: "general",
      cus_name: name,
      cus_email: email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: phone,
      cus_fax: "01711111111",
      multi_card_name: "mastercard",
      value_a: "ref001_A",
      value_b: "ref002_B",
      value_c: "ref003_C",
      value_d: "ref004_D",
    };

    const sslcommerz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASSWORD,
      false
    ); //true for live default false for sandbox
    sslcommerz.init(data).then((data) => {
      //process the response that got from sslcommerz
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters

      // console.log("ssl data", data);

      if (data?.GatewayPageURL) {
        //     let currentDate = new Date();
        // let currentDateMiliseconds = currentDate.getTime();

        // let courseExpiresMiliseconds =
        //   currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
        // let courseExpires = new Date(courseExpiresMiliseconds);

        // let updatedUserData = signUpTemplateCopy.findOneAndUpdate(
        //   {
        //     email: email,
        //   },
        //   {
        //     $set: {
        //       purchasedCourses:  courseList,
        //         // purchaseDate: currentDate,
        //         // expireAt: courseExpires,
        //       // },
        //     },
        //   }
        // );
        console.log(" Not inside ");
        console.log(data?.GatewayPageURL);

        let setSendResponseData = new sendResponseData(data, 202, null);
        let responseToSend = encryptionOfData(setSendResponseData.success());
        res.send(responseToSend);

        // return res.send(data?.GatewayPageURL)
      } else {
        return res.status(400).json({
          message: "Session was not successful",
        });
      }
    });

    // let currentDate = new Date();
    // let currentDateMiliseconds = currentDate.getTime();

    // let courseExpiresMiliseconds =
    //   currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
    // let courseExpires = new Date(courseExpiresMiliseconds);

    // let updatedUserData = await signUpTemplateCopy.findOneAndUpdate(
    //   {
    //     email: email,
    //   },
    //   {
    //     $push: {
    //       purchasedCourses: {
    //         courseid: courseList,
    //         purchaseDate: currentDate,
    //         expireAt: courseExpires,
    //       },
    //     },
    //   }
    // );
  } else {
    let setSendResponseData = new sendResponseData(null, 401, "Unauthorized");
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/ssl-payment-notification", async (req, res) => {
  /**
   * If payment notification
   */

  return res.status(200).json({
    data: req.body,
    message: "Payment notification",
  });
});

app.post("/api/ssl-payment-success", async (req, res) => {
  /**
   * If payment successful
   */
  //  let recievedResponseData = decryptionOfData(req, res);
  //  req.body = JSON.parse(JSON.parse(recievedResponseData));
  // console.log("payment success response : ", req.body);

  return res.status(200).json({
    data: req.body,
    message: "Payment success",
  });
});

app.post("/api/ssl-payment-fail", async (req, res) => {
  /**
   * If payment failed
   */
  //  console.log("payment fail response : ", req.body);

  return res.status(200).json({
    data: req.body,
    message: "Payment failed",
  });
});

app.post("/api/ssl-payment-cancel", async (req, res) => {
  /**
   * If payment cancelled
   */

  return res.status(200).json({
    data: req.body,
    message: "Payment cancelled",
  });
});

//! ********** Review part ***********/
app.post("/api/give-a-review", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let reviewData = new reviews({
      courseID: req.body.courseID,
      username: req.body.username,
      review: req.body.review,
    });

    reviewData.save();

    if (reviewData) {
      let setSendResponseData = new sendResponseData(
        "review submitted",
        200,
        ""
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        "review submission failed",
        400,
        ""
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    }
  } catch (error) {
    //* For postman response
    let setSendResponseData = new sendResponseData(null, 500, error);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! ********** get a users all reviews part ***********/

app.post("/api/user-reviews", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let reviewData = await reviews.find({
      username: req.body.username,
    });

    console.log(
      "req.body reviews  --  ",
      req.body,
      "reviewData --- ",
      reviewData
    );

    if (reviewData) {
      let setSendResponseData = new sendResponseData(reviewData, 200, "");
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        "review submission failed",
        400,
        ""
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, error);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! Testing point
app.post("/api/playthevideo", async (req, res) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  let vdo = JSON.parse(
    await vdochiper({
      videoID: req.body.videoID,
    })
  );

  let setSendResponseData = new sendResponseData(vdo, 200, "");
  let responseToSend = encryptionOfData(setSendResponseData.success());
  res.send(responseToSend);

  // res.send(vdo)
});
app.post("/api/redistesting", async (req, res) => {
  const albumId = req.body.albumId;

  redisClient.get("photos", async (err, photos) => {
    console.log("redisClient");
    if (err) console.log(err);
    if (photos != null) {
      return res.json(JSON.parse(photos));
    } else {
      console.log("Else redisClient");
      let { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos",
        {
          params: { albumId },
        }
      );
      redisClient.setex("photos", 10, JSON.stringify(data));
      // res.send(data);
    }
  });
});

//! Testing point

const DIR = "./userProfilepictures/";

// const storage = multer.diskStorage({
//   destination: (req, file, cb)=>{
//     cb(null, DIR)
//   },
//   filename: (req, file, cb) =>{
//     console.log(file);
//     cb(null, Date.now() + path.extname(file.originalname))
//   }
// })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

// var upload = multer({ storage: storage });

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("profileImg");

// var upload = multer({ dest: "userProfilepictures/" });

app.post("/api/testupload", function (req, res) {
  // const url = req.protocol + '://' + req.get('host')
  // const profileImg = url + /userProfilepictures/ + req.file.filename
  // console.log(url,' and ',profileImg, ' ', req.body)

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading");
    } else if (err) {
      console.log("An unknown error occurred when uploading");
    }

    const url = req.protocol + "://" + req.get("host");
    const profileImg = url + /userProfilepictures/ + req.file.filename;

    var data = fs.readFileSync(
      path.join(__dirname + "/userProfilepictures/" + req.file.filename)
    );

    console.log(
      fs.readFileSync(
        path.join(__dirname + "/userProfilepictures/" + req.file.filename)
      )
    );

    // Everything went fine.
    res.send(data);
  });

  // let sampleFile;
  // let uploadPath;

  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }

  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/userProfilepictures/' + sampleFile.name;

  // // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function(err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send('File uploaded!');
  // });
  // res.send('File uploaded!');

  // let recievedResponseData = decryptionOfData(req, res);
  // req.body = JSON.parse(JSON.parse(recievedResponseData));

  // let base64String = req.body.sampleFile;
  // let base64Image = base64String.split(";base64,").pop();

  // fs.writeFile(
  //   `userProfilepictures/${req.body.username}`,
  //   base64Image,
  //   { encoding: "base64" },
  //   function (err) {
  //     console.log("File created");
  //   }
  // );
  // redisClient.setex(
  //   `userProfilepictures/${req.body.username}.webp`,
  //   30,
  //   JSON.stringify(base64Image)
  // );

  // res.send("uploaded");
});

app.get("/api/:fileId", function (req, res, next) {
  // console.log(req.params.fileId);
  // fs.readFile(`./userProfilepictures/${req.params.fileId}`, function(err, data){
  let fsreaddata = fs.readFile(
    `/userProfilepictures/${req.body.username}.webp`,
    function (err, data) {
      console.log(`${req.body.username}.webp`, data);
    }
  );
  // Display the file content
  // res.writeHead(200, {'Content-Type': 'image/jpeg'})
  res.send(fsreaddata);
});

//! Testing point

app.post("/api/keepalive", async (req, res) => {
  res.send("okay");
});
app.post("/api/atestingpoint", async (req, res) => {
  const id = crypto.randomBytes(10).toString("hex");

  let smssent = JSON.parse(
    await sendSms({
      reciever: "8801515212628",
      OTP: id,
    })
  );
  // console.log((smssent).status_code);
  if (smssent.status_code === 200) {
    res.send("sms is sent");
  } else {
    res.send(`Failed with status code ` + smssent.status_code);
  }
});

// app.use(encryptionService);

let port = process.env.PORT;
app.listen(port, () => {
  console.log("server is up and running " + port);
});

// module.exports = router

//! Development branch
