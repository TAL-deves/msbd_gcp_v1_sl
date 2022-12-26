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
  videoLogger,
  userAuditLogger,
  mobileDataLogger,
} = require("./logger/logger");

const { loadExampleData, revokeToken } = require("./auth/model");

const bodyParser = require("body-parser");
const OAuth2Server = require("oauth2-server");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const router = express.Router();

const signUpTemplateCopy = require("./Database/models/SignUpModels");
// const courseIdList = require("./Database/models/courses");

const { sendMail } = require("./services/emailService");
const { generateOTP } = require("./services/OTP");
const { getCertificate } = require("./services/certificateGenerator");
const moment = require("moment");
const PDFDocument = require("pdfkit");

const cookieSession = require("cookie-session");
const passport = require("passport");
const passportStrategy = require("./passport");
const expressSession = require("express-session");
// import ResponseDetails from './Details/responseDetails.js';
// var request = require("request");

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

const coursesData = require("./data/courses");
const allCourses = require("./data/allCourses");
const allInstructors = require("./data/instructors");
const logData = require("./Database/models/logData");
const loginData = require("./Database/models/loginData");
const purchaseData = require("./Database/models/purchaseData");
const allData = require("./Database/models/allData");
const usersPurchasedCourses = require("./Database/models/usersPurchasedCourses");
const lessonProgress = require("./Database/models/lessonProgress");
const videoLogData = require("./Database/models/videoLogData");
const test = require("./Database/models/test");
const userMessages = require("./Database/models/userMessages");
const userPendingPurchase = require("./Database/models/userPendingPurchase");
const certificateData = require("./Database/models/certificateData");
var QRCode = require("qrcode");

// const apiMetrics = require('prometheus-api-metrics');

// const dummyData = require("https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/config/allCourses.js");

// const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
// let express to use this
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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
  // loadExampleData() // TODO: NEED TO UNCOMMENT THIS
});

app.use(express.json());
app.use(
  cors({
    origin: "*", //Testing
    // origin: true,
    // origin: ["https://mindschoolbd.com/","https://www.mindschoolbd.com/","mindschoolbd.com"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    // exposedHeaders: ['x-auth-token']
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
  // console.log(req.headers.useraagent)
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
// var Key = CryptoJS.SHA256(keyString);
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
  // const { request, passphase } = req.body;
  const keyString = "thisIsAverySpecialSecretKey00000";
  // const key = crypto.createHash("sha256").update(keyString).digest();
  var key = CryptoJS.enc.Utf8.parse(keyString);

  try {
    let resp;
    resp = req.body;

    const { request, passphase } = resp;

    // console.log("request, passphase ---", request, passphase);

    var decryptedFromText = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(request) },
      Key,
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
      }
    );

    let bytedata = decryptedFromText.words;

    let obj = decryptedFromText.toString(CryptoJS.enc.Utf8);

    // console.log("obj ----", obj);

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

let serverErrMsg = "Server error! Please try again later";

//! Starting of ***** response *****
class sendResponseData {
  constructor(data, status, errMsg) {
    this.data = data;
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

//! Redis generic
// const DEFAULT_EXPIRATION = 120;

// function getOrSetCache(key, cb, time = DEFAULT_EXPIRATION) {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, async (error, data) => {
//       if (error) return reject(error);
//       if (data != null) return resolve(JSON.parse(data));
//       const freshData = await cb();
//       redisClient.setex(key, time, JSON.stringify(freshData));
//       resolve(freshData);
//     });
//   });
// }

app.use(myLogger);
// app.use(apiMetrics());

//? this is req.body destructing
// const objectMap = (obj, fn) =>
//   Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

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
    failureRedirect: process.env.GOOGLE_FAILED_URL,
    // session: false,
  }),
  async function (req, res) {
    const userid = req.session.passport.user.googleId;
    const userinfo = req.session.passport.user.profilename;
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
        host: process.env.SERVER_URL,
        connection: "close",
      },
      method: "POST",
      query: {},
    };

    //! Cheking if user already logged in

    let userLoginInfo = await signUpTemplateCopy.findOne({
      username: userid,
    });

    if (!userLoginInfo.loggedinID) {
      const newId = uuidv4();
      await userLoginInfo.updateOne({
        loggedinID: newId,
      });

      let token = await obtainToken(options);
      let foundtoken = token;

      let setSendResponseData = new sendResponseData(foundtoken);
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );

      res.redirect(
        req.hostname +
          `login?gusername=${userid}&gobject=${JSON.stringify(
            responseToSend
          )}&profilename=${userinfo}`
      );
    } else {
      await tokenModel.findOneAndDelete({
        "user.username": userid,
      });

      let token = await obtainToken(options);
      let foundtoken = token;

      let setSendResponseData = new sendResponseData(foundtoken);
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );

      res.redirect(
        req.hostname +
          `login?gusername=${userid}&gobject=${JSON.stringify(
            responseToSend
          )}&profilename=${userinfo}`
      );
    }
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

    let userLoginInfo = await signUpTemplateCopy.findOne({
      username: userid,
    });

    // console.log("userLoginInfo", userLoginInfo);

    if (!userLoginInfo.loggedinID) {
      const newId = uuidv4();
      await userLoginInfo.updateOne({
        loggedinID: newId,
      });

      let token = await obtainToken(options);
      let foundtoken = token;

      let setSendResponseData = new sendResponseData(foundtoken);
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );

      res.redirect(
        req.hostname +
          `login?fusername=${userid}&fobject=${JSON.stringify(
            responseToSend
          )}&fprofilename=${profilename}`
      );
    } else {
      await tokenModel.findOneAndDelete({
        "user.username": userid,
      });

      let token = await obtainToken(options);
      let foundtoken = token;

      let setSendResponseData = new sendResponseData(foundtoken);
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );

      res.redirect(
        req.hostname +
          `login?fusername=${userid}&fobject=${JSON.stringify(
            responseToSend
          )}&fprofilename=${profilename}`
      );
    }
  }
);

// ! ******* sign up google from mobile  *******/ (Encryption done)

app.post("/api/signupmobile", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userExists = await signUpTemplateCopy.findOne({
      googleId: req.body.googleId,
    });

    // console.log("userExists   ----   ", userExists);

    if (!userExists) {
      const signUpUser = new signUpTemplateCopy({
        fullname: req.body.name,
        username: req.body.googleId,
        email: req.body.email,
        password: req.body.googleId,
        googleId: req.body.googleId,
      });

      await signUpUser.save();
      var options = {
        body: {
          grant_type: "password",
          username: req.body.googleId,
          password: req.body.googleId,
          loginMethod: "google",
          profileName: req.body.name,
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

      let responseToSend = encryptionOfData(foundtoken);

      res.send(responseToSend);
    } else {
      var options = {
        body: {
          grant_type: "password",
          username: req.body.googleId,
          password: req.body.googleId,
          loginMethod: "google",
          profileName: req.body.name,
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

      let userLoginInfo = await signUpTemplateCopy.findOne({
        username: req.body.googleId,
      });

      if (!userLoginInfo.loggedinID) {
        // if (userLoginInfo.active === true && userLoginInfo.locked === false) {
        const newId = uuidv4();
        await userLoginInfo.updateOne({
          loggedinID: newId,
        });

        let token = await obtainToken(options);
        let foundtoken = token;

        let responseToSend = encryptionOfData(foundtoken);

        // let responseToSend = encryptionOfData(obj);
        console.log("successfull login from mobile");
        res.send(responseToSend);
      } else {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          "An active session found!"
        );
        let responseToSend = encryptionOfData(setSendResponseData.error());
        res.send(responseToSend);
      }
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

//? google,fb login for mobile
app.post("/api/signupmobiletest", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // console.log("signupmobiletest    -----  ", req.body);

    let userExists = await signUpTemplateCopy.findOne({
      // googleId: req.body.googleId,
      $and: [
        { googleId: req.body.googleId },
        { facebookId: req.body.facebookId },
      ],
    });

    // console.log("userExists   ----   ", userExists);

    if (!userExists) {
      if (req.body.method === "google") {
        //! google new registration

        const signUpUser = new signUpTemplateCopy({
          fullname: req.body.fullname,
          username: req.body.googleId,
          email: req.body.email,
          password: req.body.googleId,
          googleId: req.body.googleId,
          facebookId: req.body.facebookId,
          active: true,
        });

        await signUpUser.save();
        let googleOptions = {
          body: {
            grant_type: "password",
            username: req.body.googleId,
            password: req.body.googleId,
            loginMethod: "google",
            profileName: req.body.name,
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

        let token = await obtainToken(googleOptions);
        let foundtoken = token;

        let responseToSend = encryptionOfData(foundtoken);

        res.send(responseToSend);
      } else {
        //! facebook new registration
        const signUpUser = new signUpTemplateCopy({
          fullname: req.body.fullname,
          username: req.body.facebookId,
          email: req.body.email,
          password: req.body.facebookId,
          googleId: req.body.googleId,
          facebookId: req.body.facebookId,
          active: true,
        });

        await signUpUser.save();

        let facebookOptions = {
          body: {
            grant_type: "password",
            username: req.body.facebookId,
            password: req.body.facebookId,
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

        let token = await obtainToken(facebookOptions);
        let foundtoken = token;

        let responseToSend = encryptionOfData(foundtoken);

        res.send(responseToSend);
      }
    } else {
      if (req.body.method === "google") {
        //! Google login
        let googleOptions = {
          body: {
            grant_type: "password",
            username: req.body.googleId,
            password: req.body.googleId,
            loginMethod: "google",
            profileName: req.body.name,
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

        let userLoginInfo = await signUpTemplateCopy.findOne({
          username: req.body.googleId,
        });

        if (!userLoginInfo.loggedinID) {
          // if (userLoginInfo.active === true && userLoginInfo.locked === false) {
          const newId = uuidv4();
          await userLoginInfo.updateOne({
            loggedinID: newId,
          });

          let token = await obtainToken(googleOptions);
          let foundtoken = token;

          let responseToSend = encryptionOfData(foundtoken);

          res.send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            409,
            "An active session found!"
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());
          res.send(responseToSend);
        }
      } else {
        let facebookOptions = {
          body: {
            grant_type: "password",
            username: req.body.facebookId,
            password: req.body.facebookId,
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

        let userLoginInfo = await signUpTemplateCopy.findOne({
          username: req.body.facebookId,
        });

        if (!userLoginInfo.loggedinID) {
          // if (userLoginInfo.active === true && userLoginInfo.locked === false) {
          const newId = uuidv4();
          await userLoginInfo.updateOne({
            loggedinID: newId,
          });

          let token = await obtainToken(facebookOptions);
          let foundtoken = token;

          let responseToSend = encryptionOfData(foundtoken);

          res.send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            409,
            "An active session found!"
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());
          res.send(responseToSend);
        }
      }
    }
  } catch (error) {
    console.log(error);
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

// ! ******* login google from mobile *******/ (Encryption done)

// ! ******* Clearing previous token data *******/ (Encryption done)
//* updated with phone number, username and also email
app.post("/api/clearalltoken", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // userAudtLogger.log("info", `${JSON.stringify(req.body)}`);

    // console.log("log --- ", req);

    const { username, email, phoneNumber } = req.body;

    //? Checking phonenumber or username (Both must be same in client end)
    const user = await signUpTemplateCopy.findOne({
      $and: [
        // { phoneNumber: phoneNumber },
        { username: username },
      ],
    });

    if (user) {
      let sessionAvailable = await tokenModel.findOneAndDelete({
        "user.username": username,
      });

      if (sessionAvailable) {
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
          `All session ended for user ${username}`,
          200,
          null
        );
        let responseToSend = encryptionOfData(setSendResponseData.success());

        res.send(responseToSend);
      } else {
        let setSendResponseData = new sendResponseData(
          null,
          401,
          `No session found for ${username}`
        );
        let responseToSend = encryptionOfData(setSendResponseData.error());

        res.send(responseToSend);
      }
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "No user found!"
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());

      res.send(responseToSend);
    }
  } catch (error) {
    console.log("error");
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

// ! ******* Email checking API *******/ (Encryption done)
//* updated with phone number, username and also email
app.post("/api/checkuser", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const user = await signUpTemplateCopy.findOne({
      $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }],
    }); //? This checks both phone number and email

    if (user) {
      if (user.phoneNumber == req.body.phoneNumber) {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          `${user.phoneNumber} exists in database`
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      } else if (user.email == req.body.email) {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          `${user.email} exists in database`
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      } else {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          `User exists in database`
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      }
    } else {
      let setSendResponseData = new sendResponseData("Phone number", 200, null);
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

// ! ******* Sign up API *******/ (Encryption done)
//* updated with phone number, username and also email
app.post("/api/signup", async (req, res, next) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // const user = await signUpTemplateCopy.findOne({
    //   phoneNumber: req.body.phoneNumber,
    //   email: req.body.email,
    // });

    // console.log(user);
    const user = await signUpTemplateCopy.findOne({
      $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }],
    });

    if (user) {
      if (user.phoneNumber == req.body.phoneNumber) {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          `${user.phoneNumber} exists in database`
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      } else if (user.email == req.body.email) {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          `${user.email} exists in database`
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      } else {
        let setSendResponseData = new sendResponseData(
          null,
          409,
          `User exists in database`
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      }
    } else {
      const otpGenerated = generateOTP();
      const signUpUser = new signUpTemplateCopy({
        fullname: req.body.fullname,
        username: req.body.phoneNumber,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        otp: otpGenerated,
      });

      // sendMail({
      //   to: signUpUser.email,
      //   OTP: otpGenerated,
      // });

      // console.log(req.body);
      let smssent = JSON.parse(
        await sendSms({
          reciever: req.body.phoneNumber,
          OTP: otpGenerated,
        })
      );

      if (process.env.DEVELOPMENT_ENV) {
        //? This is Development phase!! SMS Wont be sent

        signUpUser.save();
        if (signUpUser) {
          let setSendResponseData = new sendResponseData(
            "User registered!",
            202,
            null
          );
          let responseToSend = encryptionOfData(
            setSendResponseData.successWithMessage()
          );

          res.send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            500,
            "Server error"
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());

          res.send(responseToSend);
        }
      } else {
        //? This is Development phase!! SMS Wont be sent

        if (smssent.status_code === 200) {
          signUpUser.save();
          if (signUpUser) {
            let setSendResponseData = new sendResponseData(
              "User registered!",
              202,
              null
            );
            let responseToSend = encryptionOfData(
              setSendResponseData.successWithMessage()
            );

            res.send(responseToSend);
          } else {
            let setSendResponseData = new sendResponseData(
              null,
              500,
              "Server error"
            );
            let responseToSend = encryptionOfData(setSendResponseData.error());

            res.send(responseToSend);
          }
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            smssent.status_code,
            "OTP service down! Please try again later."
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());

          res.send(responseToSend);
        }
      }
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

// ! ******* verification API *******/ (Encryption done)
//* updated with phone number, username and also email
app.post("/api/verify", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;
    console.log(req.body);

    const user = await validateUserSignUp(req.body);

    let responseToSend = encryptionOfData(user);
    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

//! ******* Resend OTP API *******/ (encryption done)
//* updated with phone number, username and also email
app.post("/api/resend-otp", async (req, res) => {
  try {
    //? send email adderss to DB and generate an otp then send to that email
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    console.log("resend-otp resend ---- ", req.body);

    const user = await signUpTemplateCopy.findOne({
      $and: [{ phoneNumber: req.body.phoneNumber }, { active: false }],
    });

    console.log("resend-otp user ---- ", user);

    if (!user) {
      let setSendResponseData = new sendResponseData(null, 401, "Unauthorized");
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    } else {
      // let smssent = JSON.parse(
      //   await sendSms({
      //     reciever: req.body.phoneNumber,
      //     OTP: otpGenerated,
      //   })
      // );

      // if (!process.env.DEVELOPMENT_ENV) {
      //   //? This is Development phase!! SMS Wont be sent
      // } else {

      //   if (smssent.status_code === 200) {
      //     console.log("hello");
      //   } else {
      //     let setSendResponseData = new sendResponseData(
      //       null,
      //       smssent.status_code,
      //       "OTP service down! Please try again later."
      //     );
      //     let responseToSend = encryptionOfData(setSendResponseData.error());

      //     res.send(responseToSend);
      //   }

      // }

      // Checking OPT try left in user DB
      let otpretrycount = user.otpretrycount;

      if (otpretrycount > 0 && otpretrycount <= 3) {
        otpretrycount--; // Decrementing by 1 for each try
        let OTPtryleft = otpretrycount;
        const otpGenerated = generateOTP(); // Gerenrating a otp

        //   console.log(otpGenerated + "  " + resetOtpCount); // Debugging console view

        let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
          {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
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

        // sendMail({
        //   to: user.email,
        //   OTP: otpGenerated,
        // }); // Sending OTP to email address

        sendSms({
          reciever: user.phoneNumber,
          OTP: otpGenerated,
        });

        // let smssent = JSON.parse(
        //   await sendSms({
        //     reciever: req.body.phoneNumber,
        //     OTP: otpGenerated,
        //   })
        // );

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
            // username:req.body.username,
            // email: req.body.email,
            phoneNumber: req.body.phoneNumber,
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! ******* users API *******/ (encryption done)
//? Not in use <--- START --->
app.post("/api/user", async (req, res, next) => {
  try {
    let datas = await signUpTemplateCopy.find();
    // let allCoursesList = allCourses.coursesData
    let setSendResponseData = new sendResponseData(datas, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});
app.post("/api/userdetails", async (req, res, next) => {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;
  // console.log(req.body.username);
  let datas = await tokenChecking(req);

  // console.log("token checking status ----- ", datas);
  // try {
  let setSendResponseData = new sendResponseData(datas, 200, null);
  let responseToSend = encryptionOfData(datas);

  res.send(responseToSend);
  // } catch (error) {
  //   let setSendResponseData = new sendResponseData(null, 404, error.message);
  //   let responseToSend = encryptionOfData(setSendResponseData.success());

  //   res.send(responseToSend);
  // }
});
//? Not in use <--- END --->

//! ******* certificate API *******/
app.post("/api/certificate", async (req, res) => {
  try {
    let {
      username,
      instructorName,
      instructorTitle,
      instructorSign,
      completeDate,
      courseName,
      fullName,
      courseID,
    } = req.body;

    // console.log(req.body);

    completeDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let genId = uuidv4();
    let certificateNumber = `ID: ${genId}`;

    let base64String;
    let base64Image;
    let writeBuffer;

    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
    });

    // Draw the certificate image
    doc.image("./images/mindschool.png", 0, 0, { width: 841 });

    // Set the font to Dancing Script
    doc.font("./fonts/DancingScript-VariableFont_wght.ttf");

    // Draw the name
    doc
      .font("./fonts/DancingScript-VariableFont_wght.ttf")
      .fontSize(45)
      .text(fullName, -80, 250, {
        align: "center",
      });
    // Draw the course name
    doc.font("Times-Roman").fontSize(15).text(courseName, -80, 345, {
      align: "center",
    });
    // doc.image("./images/instructorSign.png", 60, 435, { width: 200 });

    // Draw the date
    doc.font("Times-Roman").fontSize(17).text(completeDate, -80, 430, {
      align: "center",
    });
    // Draw the certificateNumber
    doc.font("Times-Roman").fontSize(10).text(certificateNumber, -80, 400, {
      align: "center",
    });

    fullName = fullName.replaceAll(" ", "_");

    let saveCertificateData = new certificateData({
      username: username,
      courseID: courseID,
      courseName: courseName,
      fullName: fullName.replaceAll("_", " "),
      completeStatus: true,
      certificate: true,
      certificateID: genId,
      certificateDate: completeDate,
    });

    await saveCertificateData.save();

    QRCode.toDataURL(
      `https://www.mindschoolbd.com/verify-certificate/?certificateIDparam=${genId}`
    )
      .then((url) => {
        base64String = url;
        base64Image = base64String.split(";base64,").pop();
        writeBuffer = new Buffer.from(base64Image, "base64");

        fs.writeFile(
          `./userCertificates/qrCodes/${genId}.png`,
          writeBuffer,
          function (err) {
            if (err) throw err;

            // Draw the QR CODE
            doc.image(`./userCertificates/qrCodes/${genId}.png`, 730, 500, {
              width: 80,
            });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              `inline; filename=${fullName}.pdf`
            );

            doc.pipe(res);

            let userAuditLoggerData = {
              username: req.body.username,
              url: req.originalUrl,
              timestamp: new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }),
            };
            userAuditLogger.log(
              "info",
              `${JSON.stringify(userAuditLoggerData)}`
            );
            // Finalize the PDF and end the stream
            doc.end();
          }
        );
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=${fullName}.pdf`
        );

        doc.pipe(res);

        let userAuditLoggerData = {
          username: req.body.username,
          url: req.originalUrl,
          timestamp: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };

        userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

        // Finalize the PDF and end the stream
        doc.end();
      });
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, error.msg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
app.get("/api/mobilecertificate", async (req, res) => {
  try {
    var request = req.query.request.replaceAll(" ", "+");

    var IV = CryptoJS.enc.Utf8.parse("1583288699248111");

    var keyString = "thisIsAverySpecialSecretKey00000";
    var Key = CryptoJS.enc.Utf8.parse(keyString);

    var decryptedFromText = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(request) },
      Key,
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
      }
    );

    let obj = decryptedFromText.toString(CryptoJS.enc.Utf8);

    let {
      username,
      instructorName,
      instructorTitle,
      instructorSign,
      completeDate,
      courseName,
      fullName,
      courseID,
    } = JSON.parse(obj);

    // console.log(req.query);

    completeDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let genId = uuidv4();
    let certificateNumber = `ID: ${genId}`;

    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
    });

    // Draw the certificate image
    doc.image("./images/mindschool.png", 0, 0, { width: 841 });

    // Set the font to Dancing Script
    doc.font("./fonts/DancingScript-VariableFont_wght.ttf");

    // Draw the name
    doc
      .font("./fonts/DancingScript-VariableFont_wght.ttf")
      .fontSize(45)
      .text(fullName, -80, 250, {
        align: "center",
      });
    // Draw the course name
    doc.font("Times-Roman").fontSize(15).text(courseName, -80, 345, {
      align: "center",
    });
    // doc.image("./images/instructorSign.png", 60, 435, { width: 200 });

    // Draw the date
    doc.font("Times-Roman").fontSize(17).text(completeDate, -80, 430, {
      align: "center",
    });
    // Draw the certificateNumber
    doc.font("Times-Roman").fontSize(10).text(certificateNumber, -80, 400, {
      align: "center",
    });

    // fullName = fullName.replaceAll(" ", "_");

    // let saveCertificateData = new certificateData({
    //   username: username,
    //   courseID: courseID,
    //   courseName: courseName,
    //   fullName: fullName.replaceAll("_", " "),
    //   completeStatus: true,
    //   certificate: true,
    //   certificateID: genId,
    //   certificateDate: completeDate,
    // });

    // await saveCertificateData.save();

    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", `inline; filename=${fullName}.pdf`);

    // doc.pipe(res);

    // let userAuditLoggerData = {
    //   username: req.body.username,
    //   url: req.originalUrl,
    //   timestamp: new Date().toLocaleDateString("en-US", {
    //     month: "long",
    //     day: "numeric",
    //     year: "numeric",
    //     hour: "numeric",
    //     minute: "numeric",
    //     second: "numeric",
    //   }),
    // };

    // userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    // // Finalize the PDF and end the stream
    // doc.end();

    fullName = fullName.replaceAll(" ", "_");

    let saveCertificateData = new certificateData({
      username: username,
      courseID: courseID,
      courseName: courseName,
      fullName: fullName.replaceAll("_", " "),
      completeStatus: true,
      certificate: true,
      certificateID: genId,
      certificateDate: completeDate,
    });

    await saveCertificateData.save();

    QRCode.toDataURL(
      `https://www.mindschoolbd.com/verify-certificate/?certificateIDparam=${genId}`
    )
      .then((url) => {
        base64String = url;
        base64Image = base64String.split(";base64,").pop();
        writeBuffer = new Buffer.from(base64Image, "base64");

        fs.writeFile(
          `./userCertificates/qrCodes/${genId}.png`,
          writeBuffer,
          function (err) {
            if (err) throw err;

            // Draw the QR CODE
            doc.image(`./userCertificates/qrCodes/${genId}.png`, 730, 500, {
              width: 80,
            });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              `inline; filename=${fullName}.pdf`
            );

            doc.pipe(res);

            let userAuditLoggerData = {
              username: req.body.username,
              url: req.originalUrl,
              timestamp: new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }),
            };
            userAuditLogger.log(
              "info",
              `${JSON.stringify(userAuditLoggerData)}`
            );
            // Finalize the PDF and end the stream
            doc.end();
          }
        );
      })
      .catch((err) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=${fullName}.pdf`
        );

        doc.pipe(res);

        let userAuditLoggerData = {
          username: req.body.username,
          url: req.originalUrl,
          timestamp: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };

        userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

        // Finalize the PDF and end the stream
        doc.end();
      });

  } catch (error) {
    console.log("Inside catch");
    let setSendResponseData = new sendResponseData(null, 500, error.msg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/verifycertificate", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { username, certificateID } = req.body;

    // console.log("certificateID ---", certificateID);

    let findData = await certificateData.findOne({
      $and: [{ certificateID: certificateID }],
    });

    // console.log("findData ---", findData);

    if (findData) {
      let setSendResponseData = new sendResponseData(findData, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(null, 401, "Not vaild");
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, error.message);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});

//* <---  obtainToken/LOGIN API, logout API --->
//! ******* obtainToken/LOGIN API *******/
//? Both username, phonenumber is same and email is also taken but optional
app.post("/api/oauth/token", async (req, res, next) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    console.log("req.body inside login ---- ", req.body);

    req.headers["Content-type"] = "application/x-www-form-urlencoded";

    let object = req.body;

    let upObj = object.split("&");

    let jsonData = {};

    for (let i = 0; i < upObj.length; i++) {
      let upObject = upObj[i].split("=");
      jsonData[upObject[0]] = upObject[1];
    }

    req.body = jsonData;

    console.log("req.body after json ---- ", req.body);

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
          await bcrypt
            .compare(req.body.password, data.password)
            .then((result) => {
              if (result) {
                let token = obtainToken(req, res, async (obj) => {
                  let userLoginInfo = await signUpTemplateCopy.findOne({
                    username: req.body.username,
                  });

                  if (!userLoginInfo.loggedinID) {
                    if (
                      userLoginInfo.active === true &&
                      userLoginInfo.locked === false
                    ) {
                      const newId = uuidv4();
                      await userLoginInfo.updateOne({
                        loggedinID: newId,
                      });
                      let responseToSend = encryptionOfData(obj);
                      console.log("successfull login");
                      res.send(responseToSend);
                    } else {
                      let setSendResponseData = new sendResponseData(
                        null,
                        403,
                        "Account is not active or locked! Please contact support."
                      );
                      let responseToSend = encryptionOfData(
                        setSendResponseData.error()
                      );
                      res.send(responseToSend);
                    }
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
            })
            .catch((e) => {
              let setSendResponseData = new sendResponseData(
                null,
                500,
                e.message
              );
              let responseToSend = encryptionOfData(
                setSendResponseData.error()
              );

              res.send(responseToSend);
            });
        }
      })
      .catch((e) => {
        let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
        let responseToSend = encryptionOfData(setSendResponseData.error());

        res.send(responseToSend);
      });
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});
//! ******* logout API *******/ (encryption done)
app.post("/api/logout", async (req, res) => {
  try {
    var request = new Request(req);
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
          let userAuditLoggerData = {
            username: req.body.username,
            url: req.originalUrl,
            timestamp: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }),
          };

          userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

          let setSendResponseData = new sendResponseData(
            "Log out successfull",
            200,
            null
          );
          let responseToSend = encryptionOfData(setSendResponseData.success());
          res.status(202).send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            404,
            "Token not found. Already logged out!"
          );
          let responseToSend = encryptionOfData(
            setSendResponseData.successWithMessage()
          );

          res.status(202).send(responseToSend);
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
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});
//* <---  obtainToken/LOGIN API, logout API --->

//* <---  User Profile related API --->
//! ******* User Profile API *******/
app.post("/api/userprofile", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    // console.log("User userSessionStatus", userSessionStatus.result.errMsg);

    if (userSessionStatus.data != null) {
      // console.log("User is allowed");
      let userProfileData = await signUpTemplateCopy.findOne({
        username: req.body.username,
      });

      let userAuditLoggerData = {
        username: req.body.username,
        url: req.originalUrl,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      };

      userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

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
    } else {
      console.log("Not allowed", userSessionStatus);
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData("", 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/uploadimage", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    // console.log("req.body ----- ",req.body);
    if (userSessionStatus.data != null) {
      const url = req.protocol + "s://" + req.get("host");

      // console.log("url ----- ",url);
      // const profileImg = url + /userProfilepictures/ + req.body.username;
      const profileImg = "./userProfilepictures/" + req.body.username;
      // console.log("profileImg ----- ",profileImg);

      let userProfileUpdate = await signUpTemplateCopy.findOneAndUpdate(
        {
          username: req.body.username,
        },
        {
          $set: {
            profilephoto: profileImg,
          },
        }
      );

      let base64String = req.body.webimage;

      // console.log("base64String ----- ",base64String.slice(0, 50));

      let base64Image = base64String.split(";base64,").pop();
      // console.log("base64String ----- ",base64Image.slice(0, 50));

      let writeBuffer = new Buffer.from(base64Image, "base64");
      fs.writeFileSync(
        `./userProfilepictures/${req.body.username}`,
        writeBuffer
      );

      let userAuditLoggerData = {
        username: req.body.username,
        url: req.originalUrl,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      };

      userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

      let setSendResponseData = new sendResponseData(
        userProfileUpdate,
        200,
        ""
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/getuserimage", async (req, res) => {
  // try {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  console.log("getuserimage ---- ", req.body);

  let userSessionStatus = await tokenChecking(req);

  if (userSessionStatus.data != null) {
    let userProfileData = await signUpTemplateCopy.findOne({
      username: req.body.username,
    });

    let readBuffer = "";
    try {
      readBuffer = fs.readFileSync(
        `./userProfilepictures/${req.body.username}`
      );
    } catch (error) {
      readBuffer = fs.readFileSync(`./userProfilepictures/default`);
    }

    // console.log("readBuffer", readBuffer);

    let base64data = readBuffer.toString("base64");
    let base64Image = base64data.split("base64").pop();
    // console.log(" base64Image ----- ",base64Image);
    if (base64Image.startsWith("/9")) {
      base64Image = "data:image/jpeg;base64," + base64Image;
    } else if (base64Image.startsWith("iV")) {
      base64Image = base64Image.replace("A=", "I");
      base64Image = "data:image/png;base64," + base64Image;
    } else if (base64Image.startsWith("P")) {
      base64Image = "data:image/svg+xml;base64," + base64Image;
    } else {
      base64Image = "data:image/webp;base64," + base64Image;
    }
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
  } else {
    let responseToSend = encryptionOfData(userSessionStatus);
    res.send(responseToSend);
  }
  // } catch (error) {
  //   let setSendResponseData = new sendResponseData("", 500, serverErrMsg);
  //   let responseToSend = encryptionOfData(setSendResponseData.error());
  //   res.send(responseToSend);
  // }
});

//* Some works remaining <--- token check, phoneNumber --->
app.post("/api/updateuserprofile", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const {
      fullname,
      username,
      phonenumber,
      email,
      staddress,
      city,
      postcode,
      country,
      gender,
      profession,
      age,
    } = req.body;

    let userSessionStatus = await tokenChecking(req);

    if (userSessionStatus.data != null) {
      let userProfileData = await signUpTemplateCopy.findOne({
        username: username,
      });

      if (userProfileData) {
        let updateduserProfileData = await signUpTemplateCopy.findOneAndUpdate(
          {
            username: username,
          },
          {
            $set: {
              fullname: fullname,
              age: age,
              gender: gender,
              phoneNumber: phonenumber,
              profession: profession,
              email: email,
              streetAddress: staddress,
              city: city,
              postCode: postcode,
              country: country,
            },
          }
        );

        let updated = await signUpTemplateCopy.findOne({
          username: username,
        });

        let userAuditLoggerData = {
          username: req.body.username,
          url: req.originalUrl,
          timestamp: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };

        userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

        let setSendResponseData = new sendResponseData(updated, 200, null);
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
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData("", 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
//* <---  User Profile related API --->

//* <---  Forget password, request password, resend OTP, reset password --->
//! ******* Forget password API *******/
//? updated with phonenumber, username, email
app.post("/api/forget-password", async (req, res) => {
  // console.log("send email adderss to DB and generate an otp then send to that email");

  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // console.log("req.body    ----   ", req.body);

    const user = await signUpTemplateCopy.findOne({
      // email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      // locked: false,
    });

    // console.log("user   ----   ", user);

    if (user === null) {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "No user found!"
      );
      let responseToSend = encryptionOfData(
        setSendResponseData.successWithMessage()
      );
      res.send(responseToSend);
    } else if (user.locked) {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "Account is locked. Please contact support"
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

        // console.log(otpGenerated + "  " + resetOtpCount); // Debugging console view

        let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
          {
            phoneNumber: req.body.phoneNumber,
            // email: req.body.email,
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

        sendSms({
          reciever: user.phoneNumber,
          OTP: otpGenerated,
        });

        if (signUpUser) {
          let setSendResponseData = new sendResponseData(
            "OTP sent!",
            202,
            null
          );
          let responseToSend = encryptionOfData(setSendResponseData.success());

          res.send(responseToSend);
        } // Sending user information as response
        else {
          let setSendResponseData = new sendResponseData(
            null,
            500,
            serverErrMsg
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());

          res.send(responseToSend);
        } // Sending Error as response
      } else {
        let signUpUser = await signUpTemplateCopy.findOneAndUpdate(
          {
            phoneNumber: req.body.phoneNumber,
            // email: req.body.email,
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

//! ******* request password API *******/
//? updated with phonenumber, username, email
app.post("/api/request-password", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // console.log(req.body);
    // const { phoneNumber, email, otp } = req.body; //getting data from request
    const user = await validateUserSignUp(req.body); //validating user with OTP
    // res.json(user); //Sending response
    let setSendResponseData = new sendResponseData(user, 200, null);
    let responseToSend = encryptionOfData(user);

    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(user, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});

//! ******* Resend OTP API *******/ (encryption done)
//? updated with phone number, email and username
app.post("/api/resend-otp-forgotpassword", async (req, res) => {
  try {
    // send email adderss to DB and generate an otp then send to that email

    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // console.log(req.body);

    const user = await signUpTemplateCopy.findOne({
      phoneNumber: req.body.phoneNumber,
      // active: false,
    });

    if (!user) {
      let setSendResponseData = new sendResponseData(
        "Account not found!",
        401,
        "Unauthorized"
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
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
            phoneNumber: req.body.phoneNumber,
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

        // sendMail({
        //   to: user.email,
        //   OTP: otpGenerated,
        // }); // Sending OTP to email address

        sendSms({
          reciever: user.phoneNumber,
          OTP: otpGenerated,
        });

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
              phoneNumber: req.body.phoneNumber,
            },
            {
              $set: {
                locked: true,
              },
            }
          )
          .then(() => {
            let setSendResponseData = new sendResponseData(
              "User account locked!",
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(user, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});

//! ******* Reset password OTP API *******/ (encryption done)
//? updated with phone number, email and username
app.post("/api/reset-password", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { email, otp, phoneNumber } = req.body;

    let newPassword = await bcrypt.hash(req.body.password, 12);
    const user = await signUpTemplateCopy.findOneAndUpdate(
      {
        phoneNumber: phoneNumber,
        // email: email,
        otp: otp,
      },
      {
        $set: {
          password: newPassword,
          otpretrycount: 3,
          resetotpcount: 3,
        },
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});
//* <---  Forget password, request password, resend OTP, reset password --->

//* <---  Start course video, details --->
//! ******** Course VIDEO API ******** (encryption done) [No token check required!]
app.post("/api/allcourses", async (req, res, next) => {
  try {
    let data = await allData.find();
    // console.log(data[0].coursesData);

    // if (data) {
    let setSendResponseData = new sendResponseData(data[0], 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
    // } else {
    //   let setSendResponseData = new sendResponseData(allCourses, 200, null);
    //   let responseToSend = encryptionOfData(setSendResponseData.success());
    //   res.send(responseToSend);
    // }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);

    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

app.post("/api/coursedetails", async (req, res, next) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { courseID, language } = req.body;

    // console.log(courseID, language);

    let data = await allData.find();
    let coursedetailsData;

    //? if language is en then send bn data

    if (language === "bn") {
      coursedetailsData = data[0].coursesData.en;
    } else {
      coursedetailsData = data[0].coursesData.bn;
    }

    let result = coursedetailsData.find((item) => item.courseID == courseID);

    // console.log("result",result);

    // if (data) {
    let setSendResponseData = new sendResponseData(result, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
    // } else {
    //   let setSendResponseData = new sendResponseData(allCourses, 200, null);
    //   let responseToSend = encryptionOfData(setSendResponseData.success());
    //   res.send(responseToSend);
    // }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);

    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

app.post("/api/courseavailed", async (req, res, next) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let courseid = req.body.courseID;

    let user = await signUpTemplateCopy.findOne({
      username: "manas@manas.com",
    });

    let usercourses = user.purchasedCourses;

    usercourses.find((e) => {
      // console.log("Element ", e);
      if (e === req.body.courseID) {
        let setSendResponseData = new sendResponseData(true, 200, null);
        let responseToSend = encryptionOfData(setSendResponseData.success());
        res.send(responseToSend);
      } else {
        let setSendResponseData = new sendResponseData(false, 200, null);
        let responseToSend = encryptionOfData(setSendResponseData.success());
        res.send(responseToSend);
      }
    });
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);

    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

app.post("/api/course", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    if (userSessionStatus.data != null) {
      let courseid = req.body.courseID;

      let data = await allData.find();
      let coursesdata = data[0].courseData;

      let result = coursesdata.find((item) => item.courseID === courseid);

      let userCompletedLessons = await lessonProgress.find({
        $and: [
          { username: req.body.username },
          { courseID: req.body.courseID },
          { complete: true },
        ],
      });

      let userCompletedLessonsUpdated = [];

      if (userCompletedLessons[0] !== null) {
        userCompletedLessons.map((item) => {
          // console.log("item",item.lessonNumber);
          userCompletedLessonsUpdated.push(item.lessonNumber);
        });
      }

      if (result) {
        let dataJSON = {
          courseID: result.courseID,
          title: result.title,
          lessons: result.lessons,
          lessonsCompleted: userCompletedLessonsUpdated,
        };
        // console.log("result ----", dataJSON);
        let setSendResponseData = new sendResponseData(dataJSON, 200, null);
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
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/instructorcourses", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    //! here instructorID is actually courseID

    const { courseID, language } = req.body;

    let data = await allData.find();

    let allcoursesdata;

    let instructor;
    let instructorCoursesArray;
    let instructorCourses = [];

    //? if language is en then send bn data

    if (language === "bn") {
      allcoursesdata = data[0].coursesData.en;
      instructordata = data[0].instructorData.en;
      instructor = instructordata.find((item) => item._id == courseID);

      instructorCoursesArray = instructor.courses;

      instructorCoursesArray = instructorCoursesArray.filter((e1) =>
        allcoursesdata.some((e2) => e2.courseID === e1)
      );
      allcoursesdata = allcoursesdata.filter((e1) =>
        instructorCoursesArray.some((e2) => e2 === e1.courseID)
      );
    } else {
      allcoursesdata = data[0].coursesData.bn;
      instructordata = data[0].instructorData.bn;
      instructor = instructordata.find((item) => item._id == courseID);

      instructorCoursesArray = instructor.courses;

      instructorCoursesArray = instructorCoursesArray.filter((e1) =>
        allcoursesdata.some((e2) => e2.courseID === e1)
      );
      allcoursesdata = allcoursesdata.filter((e1) =>
        instructorCoursesArray.some((e2) => e2 === e1.courseID)
      );
    }

    if (allcoursesdata) {
      let setSendResponseData = new sendResponseData(allcoursesdata, 200, null);
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
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
//* <---  End course video, details --->

//* <---  Instructor API --->
//! ********** Instructor part ***********/
app.post("/api/allinstructors", async (req, res) => {
  try {
    let data = await allData.find();

    // console.log(data[0].instructorData);

    // if (data) {
    let setSendResponseData = new sendResponseData(data[0], 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
    // } else {
    //   let setSendResponseData = new sendResponseData(allInstructors, 200, null);
    //   let responseToSend = encryptionOfData(setSendResponseData.success());
    //   res.send(responseToSend);
    // }

    // let setSendResponseData = new sendResponseData(data[0], 200, null);
    // let responseToSend = encryptionOfData(setSendResponseData.success());
    // res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/instructordetails", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { instructorID, language } = req.body;

    // let result = allInstructors.instructorData.find(
    //   (item) => item._id === instructorID
    // );

    let data = await allData.find();
    let instructorData;

    if (language === "bn") {
      instructorData = data[0].instructorData.bn;
    } else {
      instructorData = data[0].instructorData.en;
    }

    let result = instructorData.find((item) => item._id == instructorID);

    if (result) {
      let setSendResponseData = new sendResponseData(result, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(null, 404, "Not found");
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    }
  } catch (error) {
    console.log("inside catch");
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
//* <---  Instructor API --->

//! ********** Purchase A course ***********/ (Encryption done)
//! Payment API's SSLcommerz

app.post("/api/mobilepaymentdata", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    if (userSessionStatus.data != null) {
      const {
        fullname,
        username,
        phonenumber,
        email,
        courses,
        staddress,
        city,
        postcode,
        country,
        price,
        amount,
        bank_tran_id,
        base_fair,
        card_brand,
        card_issuer,
        card_issuer_country,
        card_issuer_country_code,
        card_no,
        card_sub_brand,
        card_type,
        currency,
        currency_amount,
        currency_rate,
        currency_type,
        error,
        risk_level,
        risk_title,
        status,
        store_amount,
        store_id,
        tran_date,
        tran_id,
        val_id,
        value_a,
        value_b,
        value_c,
        value_d,
        verify_sign,
        verify_sign_sha2,
        verify_key,
      } = req.body;

      //? Saving this to database as payment pending status.
      let currentDate = new Date();

      let userPurchasedCourses = new userPendingPurchase({
        amount: `${parseFloat(price)}`,
        bank_tran_id: "",
        base_fair: "0.00",
        card_brand: "",
        card_issuer: "",
        card_issuer_country: "",
        card_issuer_country_code: "",
        card_no: "",
        card_sub_brand: "",
        card_type: "",
        currency: "",
        currency_amount: "",
        currency_rate: "",
        currency_type: "",
        error: "",
        risk_level: "",
        risk_title: "",
        status: "PENDING",
        store_amount: "",
        store_id: process.env.STORE_ID,
        tran_date: currentDate,
        tran_id: tran_id,
        val_id: "",
        value_a: username,
        value_b: phonenumber,
        value_c: JSON.stringify(courses).replaceAll('"', "."),
        value_d: "",
        verify_sign: "",
        verify_sign_sha2: "",
        verify_key: "",
      });

      await userPurchasedCourses.save();

      let userAuditLoggerData = {
        username: req.body.username,
        url: req.originalUrl,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      };

      userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

      let setSendResponseData = new sendResponseData(
        "Payment initiated",
        200,
        null
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());
      return res.send(responseToSend);
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/sandboxbuy", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    if (userSessionStatus.data != null) {
      const {
        fullname,
        username,
        phonenumber,
        email,
        courses,
        staddress,
        city,
        postcode,
        country,
        price,
        discountedPrice,
      } = req.body; //getting data from request

      // console.log("req buy---- ", req.body);
      const newId = uuidv4().replaceAll("-", "");

      const data = {
        total_amount: parseFloat(price),
        // currency: "BDT",
        tran_id: newId,
        success_url: `${process.env.SSL_URL}api/ssl-payment-success`,
        fail_url: `${process.env.SSL_URL}api/ssl-payment-fail`,
        cancel_url: `${process.env.SSL_URL}api/ssl-payment-cancel`,
        // ipn_url: `${process.env.SSL_URL}api/ssl-payment-notification`,
        // ipn_url: `${process.env.ROOT}/api/ssl-payment-notification`,
        shipping_method: "No",
        product_name: JSON.stringify(courses).replaceAll('"', "."),
        product_category: "Courses",
        product_profile: "general",
        cus_name: fullname,
        cus_email: email,
        cus_add1: staddress,
        cus_add2: "Dhaka",
        cus_city: city,
        cus_state: city,
        cus_postcode: postcode,
        cus_country: "Bangladesh",
        cus_phone: phonenumber,
        // cus_fax: "01711111111",
        // multi_card_name: "master",
        value_a: username,
        value_b: phonenumber,
        value_c: JSON.stringify(courses).replaceAll('"', "."),
        // value_d: "ref004_D",
      };

      //? Saving this to database as payment pending status.
      let currentDate = new Date();

      let userPurchasedCourses = new userPendingPurchase({
        amount: `${parseFloat(price)}`,
        bank_tran_id: "",
        base_fair: "0.00",
        card_brand: "",
        card_issuer: "",
        card_issuer_country: "",
        card_issuer_country_code: "",
        card_no: "",
        card_sub_brand: "",
        card_type: "",
        currency: "",
        currency_amount: "",
        currency_rate: "",
        currency_type: "",
        error: "",
        risk_level: "",
        risk_title: "",
        status: "PENDING",
        store_amount: "",
        store_id: process.env.STORE_ID,
        tran_date: currentDate,
        tran_id: newId,
        val_id: "",
        value_a: username,
        value_b: phonenumber,
        value_c: JSON.stringify(courses).replaceAll('"', "."),
        value_d: "",
        verify_sign: "",
        verify_sign_sha2: "",
        verify_key: "",
      });

      await userPurchasedCourses.save();

      let userAuditLoggerData = {
        username: req.body.username,
        url: req.originalUrl,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      };

      userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

      const sslcommerz = new SSLCommerzPayment(
        process.env.STORE_ID_SANDBOX,
        process.env.STORE_PASSWORD_SANDBOX,
        false
      ); //true for live default false for sandbox
      sslcommerz.init(data).then((data) => {
        //process the response that got from sslcommerz
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters

        if (data?.GatewayPageURL) {
          let setSendResponseData = new sendResponseData(data, 202, null);
          let responseToSend = encryptionOfData(setSendResponseData.success());
          return res.send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            400,
            "Payment session was not successful"
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());
          return res.send(responseToSend);
        }
      });
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/buy", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    if (userSessionStatus.data != null) {
      const {
        fullname,
        username,
        phonenumber,
        email,
        courses,
        staddress,
        city,
        postcode,
        country,
        price,
        discountedPrice,
      } = req.body; //getting data from request

      const newId = uuidv4().replaceAll("-", "");

      const data = {
        total_amount: parseFloat(price),
        // currency: "BDT",
        tran_id: newId,
        success_url: `${process.env.SSL_URL}api/ssl-payment-success`,
        fail_url: `${process.env.SSL_URL}api/ssl-payment-fail`,
        cancel_url: `${process.env.SSL_URL}api/ssl-payment-cancel`,
        // ipn_url: `${process.env.SSL_URL}api/ssl-payment-notification`,
        // ipn_url: `${process.env.ROOT}/api/ssl-payment-notification`,
        shipping_method: "No",
        product_name: JSON.stringify(courses).replaceAll('"', "."),
        product_category: "Courses",
        product_profile: "general",
        cus_name: fullname,
        cus_email: email,
        cus_add1: staddress,
        cus_add2: "Dhaka",
        cus_city: city,
        cus_state: city,
        cus_postcode: postcode,
        cus_country: "Bangladesh",
        cus_phone: phonenumber,
        // cus_fax: "01711111111",
        // multi_card_name: "master",
        value_a: username,
        value_b: phonenumber,
        value_c: JSON.stringify(courses).replaceAll('"', "."),
        // value_d: "ref004_D",
      };

      //? Saving this to database as payment pending status.
      let currentDate = new Date();

      let userPurchasedCourses = new userPendingPurchase({
        amount: `${parseFloat(price)}`,
        bank_tran_id: "",
        base_fair: "0.00",
        card_brand: "",
        card_issuer: "",
        card_issuer_country: "",
        card_issuer_country_code: "",
        card_no: "",
        card_sub_brand: "",
        card_type: "",
        currency: "",
        currency_amount: "",
        currency_rate: "",
        currency_type: "",
        error: "",
        risk_level: "",
        risk_title: "",
        status: "PENDING",
        store_amount: "",
        store_id: process.env.STORE_ID,
        tran_date: currentDate,
        tran_id: newId,
        val_id: "",
        value_a: username,
        value_b: phonenumber,
        value_c: JSON.stringify(courses).replaceAll('"', "."),
        value_d: "",
        verify_sign: "",
        verify_sign_sha2: "",
        verify_key: "",
      });

      await userPurchasedCourses.save();

      let userAuditLoggerData = {
        username: req.body.username,
        url: req.originalUrl,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      };

      userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

      const sslcommerz = new SSLCommerzPayment(
        process.env.STORE_ID,
        process.env.STORE_PASSWORD,
        true
      ); //true for live default false for sandbox
      sslcommerz.init(data).then((data) => {
        //process the response that got from sslcommerz
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters

        if (data?.GatewayPageURL) {
          let setSendResponseData = new sendResponseData(data, 202, null);
          let responseToSend = encryptionOfData(setSendResponseData.success());
          return res.send(responseToSend);
        } else {
          let setSendResponseData = new sendResponseData(
            null,
            400,
            "Payment session was not successful"
          );
          let responseToSend = encryptionOfData(setSendResponseData.error());
          return res.send(responseToSend);
        }
      });
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/ssl-payment-notification", async (req, res) => {
  // console.log("ssl-payment-notification", req.body);

  // let lessonProgressNew = new test({
  //   testdata1: req.body,
  //   testdata2: JSON.stringify(req.body),
  // });

  // await lessonProgressNew.save();

  const {
    amount,
    bank_tran_id,
    base_fair,
    card_brand,
    card_issuer,
    card_issuer_country,
    card_issuer_country_code,
    card_no,
    card_sub_brand,
    card_type,
    currency,
    currency_amount,
    currency_rate,
    currency_type,
    error,
    risk_level,
    risk_title,
    status,
    store_amount,
    store_id,
    tran_date,
    tran_id,
    val_id,
    value_a,
    value_b,
    value_c,
    value_d,
    verify_sign,
    verify_sign_sha2,
    verify_key,
  } = req.body;

  let currentDate = new Date();
  let currentDateMiliseconds = currentDate.getTime();

  let courseExpiresMiliseconds =
    currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
  let courseExpires = new Date(courseExpiresMiliseconds);

  if (value_d === "mobile") {
    let userPurchasedCourses = new usersPurchasedCourses({
      username: `${value_a}`,
      phoneNumber: `${value_b}`,
      coursesList: JSON.parse(value_c.replaceAll(".", '"')),
      expirationDate: `${courseExpires}`,
      amount: `${amount}`,
      bank_tran_id: bank_tran_id,
      base_fair: "0.00",
      card_brand: "",
      card_issuer: "",
      card_issuer_country: "",
      card_issuer_country_code: "",
      card_no: "",
      card_sub_brand: "",
      card_type: "",
      currency: "",
      currency_amount: "",
      currency_rate: "",
      currency_type: "",
      error: "",
      risk_level: "",
      risk_title: "",
      status: status,
      store_amount: "",
      store_id: process.env.STORE_ID,
      tran_date: tran_date,
      tran_id: `${tran_id}`,
      val_id: val_id,
      value_a: value_a,
      value_b: value_b,
      value_c: value_c,
      value_d: "",
      verify_sign: "",
      verify_sign_sha2: "",
      verify_key: "",
    });

    await userPurchasedCourses.save();

    let userAuditLoggerData = {
      username: req.body.username,
      url: req.originalUrl,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    res.send("okay");
  } else {
    res.json({
      data:null,
      result: "failed"
    });
  }
});

app.post("/api/ssl-payment-success", async (req, res) => {
  const {
    tran_id,
    val_id,
    amount,
    bank_tran_id,
    tran_date,
    status,
    value_a,
    value_b,
    value_c,
  } = req.body;

  let currentDate = new Date();
  let currentDateMiliseconds = currentDate.getTime();
  let courseExpiresMiliseconds =
    currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
  let courseExpires = new Date(courseExpiresMiliseconds);

  let userPurchasedCourses = new usersPurchasedCourses({
    username: `${value_a}`,
    phoneNumber: `${value_b}`,
    coursesList: JSON.parse(value_c.replaceAll(".", '"')),
    expirationDate: `${courseExpires}`,
    amount: `${amount}`,
    bank_tran_id: bank_tran_id,
    base_fair: "0.00",
    card_brand: "",
    card_issuer: "",
    card_issuer_country: "",
    card_issuer_country_code: "",
    card_no: "",
    card_sub_brand: "",
    card_type: "",
    currency: "",
    currency_amount: "",
    currency_rate: "",
    currency_type: "",
    error: "",
    risk_level: "",
    risk_title: "",
    status: status,
    store_amount: "",
    store_id: process.env.STORE_ID,
    tran_date: tran_date,
    tran_id: `${tran_id}`,
    val_id: val_id,
    value_a: value_a,
    value_b: value_b,
    value_c: value_c,
    value_d: "",
    verify_sign: "",
    verify_sign_sha2: "",
    verify_key: "",
  });
  await userPurchasedCourses.save();

  let setSendResponseData = new sendResponseData(req.body, 200, null);
  let responseToSend = encryptionOfData(setSendResponseData.success());

  let userAuditLoggerData = {
    username: req.body.username,
    url: req.originalUrl,
    timestamp: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
  };

  userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

  res.redirect(process.env.CLIENT_URL + `courses?payment=success`);
});

app.post("/api/ssl-payment-fail", async (req, res) => {
  const {
    tran_id,
    val_id,
    amount,
    bank_tran_id,
    tran_date,
    status,
    value_a,
    value_b,
    value_c,
  } = req.body;

  let currentDate = new Date();
  let currentDateMiliseconds = currentDate.getTime();

  let courseExpiresMiliseconds =
    currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
  let courseExpires = new Date(courseExpiresMiliseconds);

  let userPurchasedCourses = new usersPurchasedCourses({
    username: `${value_a}`,
    phoneNumber: `${value_b}`,
    coursesList: JSON.parse(value_c.replaceAll(".", '"')),
    expirationDate: `${courseExpires}`,
    amount: `${amount}`,
    bank_tran_id: bank_tran_id,
    base_fair: "0.00",
    card_brand: "",
    card_issuer: "",
    card_issuer_country: "",
    card_issuer_country_code: "",
    card_no: "",
    card_sub_brand: "",
    card_type: "",
    currency: "",
    currency_amount: "",
    currency_rate: "",
    currency_type: "",
    error: "",
    risk_level: "",
    risk_title: "",
    status: status,
    store_amount: "",
    store_id: process.env.STORE_ID,
    tran_date: tran_date,
    tran_id: `${tran_id}`,
    val_id: val_id,
    value_a: value_a,
    value_b: value_b,
    value_c: value_c,
    value_d: "",
    verify_sign: "",
    verify_sign_sha2: "",
    verify_key: "",
  });

  await userPurchasedCourses.save();

  let userAuditLoggerData = {
    username: req.body.username,
    url: req.originalUrl,
    timestamp: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
  };

  userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

  res.redirect(process.env.CLIENT_URL + `courses?payment=failed`);
});

app.post("/api/ssl-payment-cancel", async (req, res) => {
  const {
    tran_id,
    val_id,
    amount,
    bank_tran_id,
    tran_date,
    status,
    value_a,
    value_b,
    value_c,
  } = req.body;

  let currentDate = new Date();
  let currentDateMiliseconds = currentDate.getTime();

  let courseExpiresMiliseconds =
    currentDateMiliseconds + 90 * 24 * 60 * 60 * 1000;
  let courseExpires = new Date(courseExpiresMiliseconds);

  let userPurchasedCourses = new usersPurchasedCourses({
    username: `${value_a}`,
    phoneNumber: `${value_b}`,
    coursesList: JSON.parse(value_c.replaceAll(".", '"')),
    expirationDate: `${courseExpires}`,
    amount: `${amount}`,
    bank_tran_id: bank_tran_id,
    base_fair: "0.00",
    card_brand: "",
    card_issuer: "",
    card_issuer_country: "",
    card_issuer_country_code: "",
    card_no: "",
    card_sub_brand: "",
    card_type: "",
    currency: "",
    currency_amount: "",
    currency_rate: "",
    currency_type: "",
    error: "",
    risk_level: "",
    risk_title: "",
    status: status,
    store_amount: "",
    store_id: process.env.STORE_ID,
    tran_date: tran_date,
    tran_id: `${tran_id}`,
    val_id: val_id,
    value_a: value_a,
    value_b: value_b,
    value_c: value_c,
    value_d: "",
    verify_sign: "",
    verify_sign_sha2: "",
    verify_key: "",
  });
  await userPurchasedCourses.save();

  let userAuditLoggerData = {
    username: req.body.username,
    url: req.originalUrl,
    timestamp: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
  };

  userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

  res.redirect(process.env.CLIENT_URL + `courses?payment=cancel`);
});

//! ********** User courses and payment history part ***********/
app.post("/api/usercourses", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    //! This is for token checking Start
    let userSessionStatus = await tokenChecking(req);

    if (userSessionStatus.data != null) {
      // console.log("/api/usercourses ----- ", req.body);
      let data = await allData.find();
      // data = data[0].coursesData.en;
      // let array2 = data.coursesData.en

      let userCourses = await usersPurchasedCourses.find({
        $and: [{ username: req.body.username }, { status: "VALID" }],
      });

      let userallcourses = [];

      //? NO expiry checking
      // userCourses.map((item) => {
      //   item.coursesList.map((item2) => {
      //     userallcourses.push(item2);
      //   });
      // });

      //? with expiry checking
      // userCourses.map((item) => {
      //   if(moment(new Date()).isSameOrAfter(new Date(item.expirationDate))){
      //     console.log("expired");
      //   } else {
      //     item.coursesList.map((item2) => {
      //       userallcourses.push(item2);
      //     });
      //   }
      // });

      //? with expiry checking and status changing
      Promise.all(
        userCourses.map(async (item) => {
          if (moment(new Date()).isSameOrAfter(new Date(item.expirationDate))) {
            await usersPurchasedCourses.findOneAndUpdate(
              {
                $and: [
                  { username: "+8801779561764" },
                  { status: "VALID" },
                  { coursesList: item.coursesList },
                ],
              },
              {
                $set: {
                  courseExpityStatus: "VALIDITY EXPIRED",
                },
              }
            );

            // console.log("expired --- ", item);
          } else {
            item.coursesList.map((item2) => {
              userallcourses.push(item2);
            });
          }
        })
      );

      if (userCourses[0]) {
        let array1 = userallcourses;
        let array2 = data[0].coursesData.en;
        let array3 = [];
        let array31 = [];

        // array1 = array1.filter((e1) => array2.some((e2) => e2.courseID === e1));
        // array2 = array2.filter((e1) => array1.some((e2) => e2 === e1.courseID));
        // array3 = [...array2];
        // console.log("userallcourses array3 ----- ", array3);
        // console.log("userallcourses list ----- ", array2);

        array1.map((e) => {
          let objects = array2.find((e2) => e2.courseID == e);
          // console.log("e --- ", e, "objects ---", objects);

          let courses = {
            courseID: objects.courseID,
            title: objects.title,
            thumbnail: objects.thumbnail,
            courseLength: objects.courseLength,
            totalLecture: objects.totalLecture,
            instructor: objects.instructor.name,
            complete: false,
            status: 0,
          };

          array31.push({ ...courses });
          array3.push({ ...objects });
          return true;
        });

        // console.log("array31",array31);

        //! with progress

        await Promise.all(
          array31.map(async (item, index) => {
            let userCompletedLessons = await lessonProgress.find({
              $and: [
                { username: req.body.username },
                { courseID: item.courseID },
                { complete: true },
              ],
            });

            let userCompletedLessonsUpdated = [];

            if (userCompletedLessons[0] !== null) {
              userCompletedLessons.map((item) => {
                // console.log("item",item.lessonNumber);
                userCompletedLessonsUpdated.push(item.lessonNumber);
              });
            }

            //? if language is en then send bn data

            coursedetailsData = data[0].coursesData.en;

            let result = coursedetailsData.find(
              (item) => item.courseID == item.courseID
            );

            let total_course = userCompletedLessonsUpdated.length;
            let total_completed = parseInt(result.totalLecture);

            let progress = (total_course / total_completed) * 100;

            // console.log(" progress ", Math.ceil(progress));
            if (Math.ceil(progress) > 100) {
              progress = 100;
            }
            item.status = Math.ceil(progress);
          })
        );

        let userAuditLoggerData = {
          username: req.body.username,
          url: req.originalUrl,
          timestamp: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        };

        userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

        let setSendResponseData = new sendResponseData(array31, 200, null);
        let responseToSend = encryptionOfData(setSendResponseData.success());
        res.send(responseToSend);
      } else {
        // console.log("userCourses else ----- ", userCourses[0]);
        let setSendResponseData = new sendResponseData(
          null,
          200,
          "No purchase done yet"
        );
        let responseToSend = encryptionOfData(setSendResponseData.success());
        res.send(responseToSend);
      }
    } else {
      console.log("Not allowed", userSessionStatus);
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
    //! This is for token checking END
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
//! payment history (encrypiton, token check)
app.post("/api/paymenthistory", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    // console.log("User userSessionStatus", userSessionStatus.result.errMsg);

    if (userSessionStatus.data != null) {
      let userpaymenthistory = await usersPurchasedCourses.find({
        username: req.body.username,
      });

      let userAuditLoggerData = {
        username: req.body.username,
        url: req.originalUrl,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      };

      userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

      if (userpaymenthistory) {
        let setSendResponseData = new sendResponseData(
          userpaymenthistory,
          200,
          null
        );
        let responseToSend = encryptionOfData(setSendResponseData.success());
        res.send(responseToSend);
      } else {
        let setSendResponseData = new sendResponseData(
          null,
          404,
          "No payment history"
        );
        let responseToSend = encryptionOfData(
          setSendResponseData.successWithMessage()
        );
        res.send(responseToSend);
      }
    } else {
      console.log("Not allowed", userSessionStatus);
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
//! ********** Review part ***********/
app.post("/api/give-a-review", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    let userAuditLoggerData = {
      username: req.body.username,
      url: req.originalUrl,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    if (userSessionStatus.data != null) {
      console.log("User is allowed");
      let userpaymenthistory = await usersPurchasedCourses.find({
        username: req.body.username,
      });

      if (userpaymenthistory) {
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
      } else {
        console.log("Not allowed", userSessionStatus);
        let responseToSend = encryptionOfData(userSessionStatus);
        res.send(responseToSend);
      }
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! ********** get a users all reviews part ***********/

app.post("/api/user-reviews", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    let userAuditLoggerData = {
      username: req.body.username,
      url: req.originalUrl,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    if (userSessionStatus.data != null) {
      console.log("User is allowed");
      let userpaymenthistory = await usersPurchasedCourses.find({
        username: req.body.username,
      });

      if (userpaymenthistory) {
        let reviewData = await reviews.find({
          username: req.body.username,
        });

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
      } else {
        console.log("Not allowed", userSessionStatus);
        let responseToSend = encryptionOfData(userSessionStatus);
        res.send(responseToSend);
      }
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! video Playing throuh VDOchipher
app.post("/api/playthevideo", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    let userAuditLoggerData = {
      username: req.body.username,
      url: req.originalUrl,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    if (userSessionStatus.data != null) {
      let vdo = JSON.parse(
        await vdochiper({
          videoID: req.body.videoID,
        })
      );

      let setSendResponseData = new sendResponseData(vdo, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});


//? applypromocode related API
app.post("/api/applypromocode", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;
    console.log(req.body);

    let userSessionStatus = await tokenChecking(req);

    let userAuditLoggerData = {
      username: req.body.username,
      url: req.originalUrl,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    if (userSessionStatus) {
      let promocode = {
        code: "ABC123",
        discount: "50%",
        amount: 0.5,
      };

      let setSendResponseData = new sendResponseData(promocode, 200, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        404,
        "Promo code is not valid!"
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//? Log related API
//! ******* videologdata API *******/
app.post("/api/videologdata", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const {
      courseID,
      videoID,
      username,
      status,
      actionTime,
      totalTimeCovered,
      totalTimePlayed,
      totalVdoDuration,
      videoTitle,
      lessonTitle,
      episode,
      currentProgress,
    } = req.body;

    // let bodyData = objectMap(req.body, v=> v) //? mapping object

    let userSessionStatus = await tokenChecking(req);

    // console.log("User userSessionStatus", userSessionStatus.result.errMsg);

    if (userSessionStatus.data != null) {
     
      let logVideData = new videoLogData({
        username: username,
        courseID: courseID,
        videoID: videoID,
        status: status,
        actionTime: actionTime,
        totalTimeCovered: totalTimeCovered,
        totalTimePlayed: totalTimePlayed,
        totalVdoDuration: totalVdoDuration,
        courseName: videoTitle,
        lessonName: lessonTitle,
        lessonNumber: episode,
        currentProgress: currentProgress,
      });
  
      await logVideData.save();
  
      if (
        req.body.status === "ended" &&
        req.body.totalTimeCovered === req.body.totalVdoDuration
      ) {
        let lessonProgressData = await lessonProgress.find({
          $and: [
            { username: username },
            { courseID: courseID },
            { lessonNumber: episode },
            { complete: true },
          ],
        });
  
        if (!lessonProgressData[0]) {
          let lessonProgressNew = new lessonProgress({
            username: username,
            courseName: videoTitle,
            courseID: courseID,
            videoID: videoID,
            lessonNumber: episode,
            complete: true,
          });
  
          await lessonProgressNew.save();
        } else {
          // console.log("Already watched  ");
          // let setSendResponseData = new sendResponseData("Updated", 200, null);
          // let responseToSend = encryptionOfData(setSendResponseData);
          // res.send(responseToSend);
        }
      }
  
      videoLogger.log("info", `${JSON.stringify(req.body)}`);
  
      let setSendResponseData = new sendResponseData("sent", 200, null);
      let responseToSend = encryptionOfData(setSendResponseData);
  
      res.send(responseToSend);

    } else {
      console.log("Not allowed", userSessionStatus);
      let responseToSend = encryptionOfData(userSessionStatus);
      res.send(responseToSend);
    }
  } catch (error) {
    console.log("serverErrMsg", serverErrMsg);
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});

//! ******* Mobile Logs *******/
app.post("/api/mobilelogdata", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    mobileDataLogger.log("info", `${JSON.stringify(req.body)}`);

    let setSendResponseData = new sendResponseData("sent", 200, null);
    let responseToSend = encryptionOfData(setSendResponseData);

    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 404, error.message);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});

//!  User message API
app.post("/api/leaveamessage", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { phonenumber, fullname, email, leaveMessage } = req.body;

    let saveUserMessage = await new userMessages({
      phonenumber: phonenumber,
      fullname: fullname,
      email: email,
      leaveMessage: leaveMessage,
    });

    saveUserMessage.save();

    let userAuditLoggerData = {
      username: req.body.username,
      url: req.originalUrl,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    };

    userAuditLogger.log("info", `${JSON.stringify(userAuditLoggerData)}`);

    if (saveUserMessage) {
      let setSendResponseData = new sendResponseData(
        "Message Sent!",
        200,
        senullrverErrMsg
      );
      let responseToSend = encryptionOfData(setSendResponseData.success());
      res.send(responseToSend);
    } else {
      let setSendResponseData = new sendResponseData(
        null,
        500,
        "Server busy! Please try again later"
      );
      let responseToSend = encryptionOfData(setSendResponseData.error());
      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! Getting User message Data
app.get("/api/getusermessages", async (req, res) => {
  try {
    let getAllUserMessages = await userMessages.find();
    let getAllUserMessagesCount = await userMessages.find().count();

    let data = {
      messages: getAllUserMessages,
      total: getAllUserMessagesCount,
    };

    let setSendResponseData = new sendResponseData(data, 200, null);
    // let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(setSendResponseData);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! Getting Log Data
app.get("/api/checklogdata", async (req, res) => {
  let totalusers = await signUpTemplateCopy.count();
  let totalViews = await logData.count();
  let totalLogins = await loginData.count();
  let totalPurchases = await purchaseData.count();
  let totalLoggedinUsers = await tokenModel.count();

  let data = {
    totalUsers: totalusers,
    totalViews: totalViews,
    totalLogins: totalLogins,
    totalPurchases: totalPurchases,
    totalLoggedinUsers: totalLoggedinUsers,
  };

  res.json(data);
});


//! User session check
app.post("/api/sessioncheck", async (req, res) => {
  // try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    
    // console.log("/api/sessioncheck ", userSessionStatus);

    let userSessionStatus = await tokenChecking(req);

    // console.log("token check: ---- ", userSessionStatus);

    let responseToSend = encryptionOfData(userSessionStatus);
    res.send(responseToSend);
    // let setSendResponseData = new sendResponseData(userSessionStatus, 200, null);
    // let responseToSend = encryptionOfData(setSendResponseData.success());
    // res.send(responseToSend);
  // } catch (error) {
  //   let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
  //   let responseToSend = encryptionOfData(setSendResponseData.error());
  //   res.send(responseToSend);
  // }
});

//! Testing point

app.post("/api/testpostreq", async (req, res) => {
  let data = {
    data: req.body,
    send: "Sent from backend",
  };
  res.json(data);
});

app.get("/api/testgetreq", async (req, res) => {
  console.log("request ------", req.hostname);
  console.log("req.headers.host ------", 'https://' +req.headers.host+"/");
  console.log("req.headers.origin ------", req.headers.originalUrl);
  console.log("url ------", req.protocol + '://' + req.get('host') + req.originalUrl);
  console.log("url ------", req.protocol + '://' + req.get('host') );
  let data = {
    data: "sample data",
    send: "Got from backend",
  };
  res.json(data);
});

app.post("/api/testingpoint", async (req, res) => {
  try {
    res.send("test")
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, error.msg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//* <---  Token portoion  --->
//! ********** Token portoion ***********/
const validateUserSignUp = async (arg) => {
  const { email, phoneNumber, otp } = arg;

  const user = await signUpTemplateCopy.findOne({
    phoneNumber: phoneNumber,
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
      data: `${updatedUser.phoneNumber} is verified!`,
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

  // console.log("fromClient ---- ", fromClient);

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
        // console.log("Token is still active");
        return tokenExpiryStatus;
        // return true;
      }
    } else {
      let tokenExpiryStatus = {
        data: null,
        result: {
          isError: false,
          status: 401,
          errMsg: "No token in DB",
        },
      };
      console.log("No token in DB");
      return tokenExpiryStatus;
      // return false;
    }
  } else {
    let tokenExpiryStatus = {
      data: null,
      result: {
        isError: false,
        status: 404,
        errMsg: "Token is required",
      },
    };
    console.log("No token!");
    return tokenExpiryStatus;
    // return false;
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
//* <---  Token portoion  --->

let port = process.env.PORT;
app.listen(port, () => {
  console.log("server is up and running " + port);
});

// module.exports = router
