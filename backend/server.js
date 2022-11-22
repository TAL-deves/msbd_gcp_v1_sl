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
  // loadExampleData()
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

// const cryptkey = CryptoJS.enc.Utf8.parse('thisIsAverySpecialSecretKey00000');
// const cryptiv = CryptoJS.enc.Utf8.parse('1583288699248111')

// // Decryption
// const crypted = CryptoJS.enc.Base64.parse("pJnfSAG/Q/nTGmnUmTwd1lXCgcK+bO5gs2VVx3Zk6fo=");
// var decrypt = CryptoJS.AES.decrypt({ciphertext: crypted}, cryptkey, {
//     iv: cryptiv,
//     mode: CryptoJS.mode.CBC
// });
// console.log(decrypt.toString(CryptoJS.enc.Utf8));

// // Encryption
// var encrypt = CryptoJS.AES.encrypt("Sample Text", cryptkey, {
//     iv: cryptiv,
//     mode: CryptoJS.mode.CBC
// });
// console.log(encrypt.toString())

// console.log("Key  ",Key);

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
    // return JSON.stringify(jsonObj);
    return jsonObj;
  },
  parse: function (jsonStr) {
    // parse json string
    //var jsonObj = JSON.parse(jsonStr);
    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: jsonStr,
    });
    // optionally extract iv or salt
    // if (jsonObj.iv) {
    //   cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    // }
    // if (jsonObj.s) {
    //   cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
    // }
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

// var encrypt = CryptoJS.AES.encrypt("test@test.com", Key, {
//   iv: IV,
//   mode: CryptoJS.mode.CBC
// });

// console.log("encrypt   ---   ", encrypt.toString());

// let decryptionService = function (req, res, next) {
//   console.log("This prints 1st");
//   const { request, passphase } = req.body;
//   const keyString = "thisIsAverySpecialSecretKey00000";
//   const key = crypto.createHash("sha256").update(keyString).digest();
//   try {
//     const iv = Buffer.from(passphase, "hex");
//     const encryptedText = Buffer.from(request, "hex");
//     let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
//     let decrypted = decipher.update(encryptedText);

//     decrypted = Buffer.concat([decrypted, decipher.final()]);

//     let obj = decrypted;
//     // console.log("obj req ----- :"+JSON.parse(obj));

//     // let recievedData = (obj)

//     // console.log("This is the object -----", JSON.stringify(obj));
//     return obj;

//     // switch (req.originalUrl) {
//     //   case "/api/signup":
//     //   case "/api/forget-password":
//     //     req.body = JSON.parse(JSON.parse(obj));
//     //     break;
//     //   case "/api/oauth/token":
//     //     req.body = JSON.parse(obj);
//     //     break;

//     //   default:
//     //     req.body = obj;
//     // }

//     // req.body= JSON.parse(obj);
//     // req.body.recv= recievedData
//     // req.body = (req.body)
//     // console.log("Outgoing req ----- :", obj);
//     // console.log("Outgoing req ----- :"+ typeof (req.body));
//   } catch (err) {
//     console.log("Error log:     " + err.message);
//     res.send(err.message);
//   }

//   next();
// };
// }

// let encryptionService = function (req, res, next) {
//   console.log("This prints 3rd");
//   let oldSend = res.send;

//   console.log("This prints 3rd", oldSend);
//   //  console.log("oldSend -------   ",res);
//   res.send = (data) => {
//     //  console.log("data -------   "+JSON.stringify(data));
//     let encryptionData = encrypt(JSON.stringify(data));
//     //  let encryptionData = encrypt((data))
//     // console.log("encryptionData -------   "+encryptionData);

//     res.send = oldSend; // set function back to avoid the 'double-send'
//     let encryptedData = {
//       request: encryptionData,
//       passphase: IV.toString(),
//     };
//     console.log("ENCRYPTED response data: " +encryptionData);

//     return res.send(encryptedData); // just call as normal with data

//   };
//   next();
// };
//! Starting of  ***** Encryption and decryption *****

let decryptionOfData = (req, res) => {
  // const { request, passphase } = req.body;
  const keyString = "thisIsAverySpecialSecretKey00000";
  // const key = crypto.createHash("sha256").update(keyString).digest();
  var key = CryptoJS.enc.Utf8.parse(keyString);

  // console.log("key ---- ",key);

  try {
    // const iv = Buffer.from(passphase, "base64");
    // const encryptedText = Buffer.from(request, "base64");
    // let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    // let decrypted = decipher.update(encryptedText);

    // decrypted = Buffer.concat([decrypted, decipher.final()]);

    // let obj = decrypted;

    // return obj;

    let resp;
    resp = req.body;
    // console.log("reqst body ---- :  ", req.body);
    const { request, passphase } = resp;

    // console.log("request ---- :  ", request);

    // let data = request;
    // let buff = Buffer.from(data, 'base64');
    // let text = buff.toString('ascii');

    // console.log("data   -- ", request);
    // console.log("buff   -- ", buff);
    // console.log("text   -- ", text);

    // console.log("request   -- ", CryptoJS.enc.Base64.parse(request));
    // console.log("passphase   -- ", passphase);

    // var decryptedFromText = CryptoJS.AES.decrypt(
    //   JsonFormatter.parse(request),
    //   Key,
    //   { iv: IV }
    // // );
    // let something = [
    //   1952999795, 1232290166,
    //   1702000979, 1885692777,
    //   1634489189, 1668441460,
    //   1264941360,  808464432
    // ]
    //   var decryptedFromText = CryptoJS.AES.decrypt(something, Key, {
    //     iv: IV,
    //     mode: CryptoJS.mode.CBC
    // });
    var decryptedFromText = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(request) },
      Key,
      {
        iv: IV,
        mode: CryptoJS.mode.CBC,
      }
    );

    // console.log(" ------  ",decryptedFromText);

    // console.log("decryptedFromText   -- ", (decryptedFromText));

    let bytedata = decryptedFromText.words;

    // console.log("CryptoJS.enc.Utf8",CryptoJS.enc.Utf8.stringify(decryptedFromText.words))

    let obj = decryptedFromText.toString(CryptoJS.enc.Utf8);
    // console.log("obj   -- ", (obj))
    // console.log(
    //   "decryptedFromText:---------   ",
    //   typeof recievedData, recievedData
    // );

    // if(  typeof obj === "string"){
    //   obj = JSON.parse(obj);
    // }
    if (typeof obj === "string" && obj.startsWith("g")) {
      console.log("string type obj ", obj);
      return obj;
    }
    return JSON.parse(obj);
  } catch (err) {
    console.log("Error log:     " + err.message);
    return err.message;
    // res.send(err.message);
  }
};

let encryptionOfData = (data) => {
  // console.log("raw data",data);
  let encryptionData = encrypt(JSON.stringify(data));
  //  let encryptionData = encrypt((data))
  // console.log("encryptionData -------   "+encryptionData);
  // console.log("encryptionData",typeof(encryptionData));
  // res.send = oldSend; // set function back to avoid the 'double-send'
  let encryptedData = {
    request: encryptionData,
    passphase: IV.toString(),
  };
  // console.log("ENCRYPTED response data: ",encryptedData);

  // console.log("This is the encryptedData -----", JSON.stringify(encryptedData));

  return encryptedData;
};
//? Ending of ***** Encryption and decryption *****

let serverErrMsg = "Server error! Please try again later";

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

// app.use(decryptionService);
// app.use(encryptionService);

// ! ******* Social Login API *******/ (Encryption done)
app.get("/api/login/success", (req, res) => {
  if (req.session) {
    // res.status(200).json({
    //   data: {
    //     messege: null,
    //   },
    //   result: {
    //     error: false,
    //     message: "Successfully Loged In",
    //     user: req.session,
    //   },
    // });

    let setSendResponseData = new sendResponseData("Success", 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  } else {
    // res.status(403).json({
    //   data: {
    //     messege: null,
    //   },
    //   result: {
    //     isError: true,
    //     status: 403,
    //     message: "Not Authorized",
    //   },
    // });

    let setSendResponseData = new sendResponseData(null, 403, "Not Authorized");
    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    res.send(responseToSend);
  }
});

app.get("/api/login/failed", (req, res) => {
  // res.status(401).json({
  //   data: {
  //     messege: null,
  //   },
  //   result: {
  //     isError: true,
  //     message: "Log in failure",
  //   },
  // });

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
        host: process.env.SERVER_URL,
        connection: "close",
      },
      method: "POST",
      query: {},
    };

    let token = await obtainToken(options);
    let foundtoken = token;
    // console.log(" foundtoken -----  ", foundtoken);
    // let tokendata = JSON.stringify(token.data.accessToken);
    // res.json("from obtain token: "+ JSON.stringify(token));

    let setSendResponseData = new sendResponseData(foundtoken);

    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    // res.send(responseToSend);

    res.redirect(
      process.env.CLIENT_URL +
        `login?gusername=${userid}&gobject=${JSON.stringify(
          responseToSend
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
    // // console.log(res);
    // let token = await obtainToken(options);
    // // obtainToken(options);
    // let foundtoken = token;
    // console.log("from fb callback: " + token);
    // // let tokendata = JSON.stringify(token.data.accessToken);
    // // res.json("from obtain token: "+ JSON.stringify(token));
    // res.redirect(process.env.CLIENT_URL_DEVELOPMENT + `login?fusername=${userid}`);

    let token = await obtainToken(options);
    let foundtoken = token;
    // console.log(" foundtoken -----  ", foundtoken);
    // let tokendata = JSON.stringify(token.data.accessToken);
    // res.json("from obtain token: "+ JSON.stringify(token));

    let setSendResponseData = new sendResponseData(foundtoken);

    let responseToSend = encryptionOfData(
      setSendResponseData.successWithMessage()
    );

    // res.send(responseToSend);

    res.redirect(
      process.env.CLIENT_URL +
        `login?fusername=${userid}&fobject=${JSON.stringify(
          responseToSend
        )}&fprofilename=${profilename}`
    );
  }
);

// app.get("/api/logout", (req, res) => {
//   // req.logout();
//   // req.session.destroy(function (err) {
//   // 	res.send("logged out!!");
//   // });
//   //   res.redirect(process.env.CLIENT_URL_DEVELOPMENT + "login");
//   // req.session = null;
//   // res.clearCookie();
//   // res.end();
//   //   res.redirect("/");
// });

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

      let token = await obtainToken(options);
      let foundtoken = token;

      let responseToSend = encryptionOfData(foundtoken);

      res.send(responseToSend);
    }
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, "Server error!");
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

// ! ******* login google from mobile *******/ (Encryption done)

// ! ******* Clearing previous token data *******/ (Encryption done)
app.post("/api/clearalltoken", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { username, email } = req.body;

    let user = await signUpTemplateCopy.findOne({
      email: req.body.username,
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
app.post("/api/checkuser", async (req, res) => {
  try {
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
      let setSendResponseData = new sendResponseData("Email address", 200, null);
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
app.post("/api/signup", async (req, res, next) => {
  try {
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
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        otp: otpGenerated,
      });

      sendMail({
        to: signUpUser.email,
        OTP: otpGenerated,
      });

      // console.log(req.body);
      let smssent = JSON.parse(
        await sendSms({
          reciever: req.body.phoneNumber,
          OTP: otpGenerated,
        })
      );
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
          // res.send({
          //   data: {
          //     message: "User registered!",
          //     // fullname: data.fullname,
          //     // username: data.username,
          //     // email: data.email,
          //     // otp: data.otp, //temporary visible
          //     // createdOn: data.creation_date,
          //   },
          //   result: {
          //     isError: false,
          //     status: 202,
          //     errorMsg: "",
          //   },
          // });
          // })
          // .catch((error) => {
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

// ! ******* verification API *******/ (Encryption done)
app.post("/api/verify", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    console.log("req.body --- ", req.body);
    const { email, otp } = req.body;
    const user = await validateUserSignUp(email, otp);
    // let setSendResponseData = new sendResponseData(
    //   user,
    //   200,
    //   user.result.errorMsg
    // );
    let responseToSend = encryptionOfData(
      user
    );
    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

//! ******* Resend OTP API *******/ (encryption done)
app.post("/api/resend-otp", async (req, res) => {
  try {
    // send email adderss to DB and generate an otp then send to that email
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    console.log("req.body resend ---- ",req.body);

    const user = await signUpTemplateCopy.findOne({
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      active: false,
    });

    if (!user) {
      let setSendResponseData = new sendResponseData(null, 401, "Unauthorized");
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

        sendMail({
          to: user.email,
          OTP: otpGenerated,
        }); // Sending OTP to email address

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
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! ******* users API *******/ (encryption done)
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
app.post("/api/certificate", (req, res) => {
  username = "First Middle Last";
  instructorName = "Dr. Abul Kalam Faruq";
  instructorTitle = "Instructor";
  instructorSign = "Institute Name";
  completeDate = "November 8th, 2022";
  courseName = `"Purify with Yahia Amin"`;

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
    .text(username, -80, 250, {
      align: "center",
    });
  // Draw the course name
  doc.font("Times-Roman").fontSize(15).text(courseName, -80, 345, {
    align: "center",
  });
  doc.image("./images/instructorSign.png", 60, 435, { width: 200 });

  // Draw the date
  doc.font("Times-Roman").fontSize(17).text(completeDate, -80, 430, {
    align: "center",
  });

  // Pipe the PDF into an name.pdf file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${username}.pdf`);

  // doc.pipe(res);

  // Finalize the PDF and end the stream
  doc.end();
  doc.pipe(fs.createWriteStream(`./userCertificates/${username}.pdf`));

  // doc.pipe(username);
  data = fs.readFileSync(`./userCertificates/${username}.pdf`);
  // console.log(data);
  // fs.writeFileSync("./userCertificates/hello", data)

  let setSendResponseData = new sendResponseData(data, 200, null);
  let responseToSend = encryptionOfData(setSendResponseData.success());
  res.send(responseToSend);
});

//! ******* obtainToken/LOGIN API *******/
app.post("/api/oauth/token", async (req, res, next) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    console.log("req.bod inside login y ---- ", req.body);

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

//! ******* User Profile API *******/
app.post("/api/userprofile", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);
    if (userSessionStatus.data != null) {
      console.log("User is allowed");
      let userProfileData = await signUpTemplateCopy.findOne({
        username: req.body.username,
      });

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
      console.log("Not allowed");
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

    const url = req.protocol + "://" + req.get("host");
    const profileImg = url + /userProfilepictures/ + req.body.username;

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
    let base64Image = base64String.split(";base64,").pop();

    let writeBuffer = new Buffer.from(base64Image, "base64");
    fs.writeFileSync(`./userProfilepictures/${req.body.username}`, writeBuffer);

    let setSendResponseData = new sendResponseData(userProfileUpdate, 200, "");
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
app.post("/api/getuserimage", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;
    let userProfileData = await signUpTemplateCopy.findOne({
      username: req.body.username,
    });

    let readBuffer = "";

    readBuffer = fs.readFileSync(`./userProfilepictures/${req.body.username}`);

    let base64data = readBuffer.toString("base64");
    let base64Image = base64data.split("base64").pop();
    if (base64Image.startsWith("/9")) {
      base64Image = "data:image/jpeg;base64," + base64Image;
    } else {
      base64Image = base64Image.replace("A=", "I");
      base64Image = "data:image/png;base64," + base64Image;
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
  } catch (error) {
    let setSendResponseData = new sendResponseData("", 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/updateuserprofile", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    // console.log("User data updates", req.body);
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
    let setSendResponseData = new sendResponseData("", 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

// app.post("/api/usercourses", async (req, res) => {
//   let recievedResponseData = decryptionOfData(req, res);
//   req.body = recievedResponseData;

//   let userProfileData = await signUpTemplateCopy.findOne({
//     username: req.body.username,
//   });

//   const getInstructor = (id) => {
//     const found = instructorData.find((instructor) => instructor._id == id);
//     if (!found) return "Instructor not found!";
//     found.courses = found.courses.map((course) =>
//       coursesData.find((courseData) => courseData._id === course)
//     );
//     return found;
//   };

//   console.log(getInstructor(1));
//   console.log(getInstructor(2));
//   console.log(getInstructor(3));

//   // console.log(JSON.parse(userProfileData.purchasedCourses[0]));
//   res.send(userProfileData.purchasedCourses);
// });

//! ******* logout API *******/ (encryption done)
app.post("/api/logout", async (req, res) => {
  // let recievedResponseData = decryptionOfData(req, res);
  // req.body = JSON.parse(JSON.parse(recievedResponseData));

  // var response = new Response(res);
  // console.log("request.headers.authorization",request);
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

//! ******* Forget password API *******/
app.post("/api/forget-password", async (req, res) => {
  // console.log("send email adderss to DB and generate an otp then send to that email");

  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;
   
    console.log("req.body    ----   ", req.body)

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

        sendSms({
          reciever: user.email,
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());

    res.send(responseToSend);
  }
});

app.post("/api/request-password", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    const { email, otp } = req.body; //getting data from request
    const user = await validateUserSignUp(email, otp); //validating user with OTP
    // res.json(user); //Sending response
    let setSendResponseData = new sendResponseData(user, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(user, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});
//! ******* Resend OTP API *******/ (encryption done)
app.post("/api/resend-otp-forgotpassword", async (req, res) => {
  try {
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(user, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.success());

    res.send(responseToSend);
  }
});
app.post("/api/reset-password", async (req, res) => {
  try {
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
  } catch (error) {
    let setSendResponseData = new sendResponseData(user, 500, serverErrMsg);
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

    console.log(usercourses);

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

    let courseid = req.body.courseID;

    let result = coursesData.coursesData.find(
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
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
app.post("/api/instructorcourses", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let courseid = req.body.courseID;
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
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! ********** Instructor part ***********/

app.post("/api/allinstructors", (req, res) => {
  try {
    let setSendResponseData = new sendResponseData(allInstructors, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

app.post("/api/instructor", (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;
    let instructorID = req.body.instructorID;
    let result = allInstructors.instructorData.find(
      (item) => item._id === instructorID
    );
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
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
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

//! Payment API's SSLcommerz

app.post("/api/buy", async (req, res) => {
  // let tokenstatus = await tokenChecking(req, res);

  // console.log("token status: ---- ", tokenstatus);

  // if (tokenstatus) {
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;

  // const { email, courseList } = req.body; //getting data from request
  const name = req.body.user;
  const phone = "01234567891";
  const email = "test@test.com";
  const courseList = ["C001", "C002"];
  const total = 10;

  // console.log("data - ", req.body);

  const data = {
    total_amount: parseFloat(total),
    currency: "BDT",
    tran_id: "REF123",
    success_url: `${process.env.ROOT}/api/ssl-payment-success`,
    fail_url: `${process.env.ROOT}/api/ssl-payment-fail`,
    cancel_url: `${process.env.ROOT}/api/ssl-payment-cancel`,
    ipn_url: `${process.env.ROOT}/api/ssl-payment-notification`,
    shipping_method: "No",
    product_name: JSON.stringify(courseList),
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
      // console.log(" Not inside ");
      // console.log(data?.GatewayPageURL);

      let setSendResponseData = new sendResponseData(data, 202, null);
      let responseToSend = encryptionOfData(setSendResponseData.success());
      return res.send(responseToSend);

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
  // } else {
  //   let setSendResponseData = new sendResponseData(null, 401, "Unauthorized");
  //   let responseToSend = encryptionOfData(setSendResponseData.error());
  //   res.send(responseToSend);
  // }
});

app.post("/api/ssl-payment-notification", async (req, res) => {
  /**
   * If payment notification
   */
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;
  console.log("ssl-payment-notification", req.body);

  // return res.status(200).json({
  //   data: req.body,
  //   message: "Payment notification",
  // });

  let setSendResponseData = new sendResponseData(req.body.data, 200, null);
  let responseToSend = encryptionOfData(
    setSendResponseData.successWithMessage()
  );
  return res.send(responseToSend);
});

app.post("/api/ssl-payment-success", async (req, res) => {
  /**
   * If payment successful
   */

  // let recievedResponseData = decryptionOfData(req, res);
  //  req.body = recievedResponseData;
  // console.log("ssl-payment-success", req.body);

  // console.log("I am here");

  // console.log(req.body)

  let user = await signUpTemplateCopy.findOneAndUpdate(
    {
      username: "manas@manas.com",
    },
    {
      $push: {
        purchasedCourses: "C002",
      },
    }
  );

  console.log(user);

  let setSendResponseData = new sendResponseData(req.body, 200, null);
  let responseToSend = encryptionOfData(setSendResponseData.success());
  // return res.send(req.body);

  // res.redirect(`localhost:3000/course
  //    +
  //     ${JSON.stringify(
  //       setSendResponseData
  //     )}`
  // );
  res.redirect(process.env.CLIENT_URL_DEVELOPMENT + `courses?payment=success`);

  //  setTimeout(()=>{
  //   res.redirect(`localhost:3000/
  //      +
  //       ${JSON.stringify(
  //         setSendResponseData
  //       )}`
  //   );
  //  }, 1000)
});

app.post("/api/ssl-payment-fail", async (req, res) => {
  /**
   * If payment failed
   */
  //  console.log("payment fail response : ", req.body);

  // return res.status(200).json({
  //   data: req.body,
  //   message: "Payment failed",
  // });

  res.redirect(process.env.CLIENT_URL_DEVELOPMENT + `courses?payment=failed`);
});

app.post("/api/ssl-payment-cancel", async (req, res) => {
  /**
   * If payment cancelled
   */
  let recievedResponseData = decryptionOfData(req, res);
  req.body = recievedResponseData;
  console.log("ssl-payment-cancel", req.body);

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

    let vdo = JSON.parse(
      await vdochiper({
        videoID: req.body.videoID,
      })
    );

    let setSendResponseData = new sendResponseData(vdo, 200, null);
    let responseToSend = encryptionOfData(setSendResponseData.success());
    res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});
//! User session check
app.post("/api/sessioncheck", async (req, res) => {
  try {
    let recievedResponseData = decryptionOfData(req, res);
    req.body = recievedResponseData;

    let userSessionStatus = await tokenChecking(req);

    console.log("token check: ---- ", userSessionStatus);

    let responseToSend = encryptionOfData(userSessionStatus);
    res.send(responseToSend);
    // let setSendResponseData = new sendResponseData(userSessionStatus, 200, null);
    // let responseToSend = encryptionOfData(setSendResponseData.success());
    // res.send(responseToSend);
  } catch (error) {
    let setSendResponseData = new sendResponseData(null, 500, serverErrMsg);
    let responseToSend = encryptionOfData(setSendResponseData.error());
    res.send(responseToSend);
  }
});

//! Testing point

app.post("/api/keepalive", async (req, res) => {
  var configurationForFileUpdates = {
    method: "get",
    url: "https://storage.googleapis.com/artifacts.xenon-sentry-364311.appspot.com/assets/config/allCourses.js",
    headers: {},
  };

  await axios(config)
    .then(function (response) {
      fs.writeFile("./data/dummydata.js", response.data, (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
        }
      });

      res.send("okay");
    })
    .catch(function (error) {
      res.send("Error");
    });
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


let port = process.env.PORT;
app.listen(port, () => {
  console.log("server is up and running " + port);
});

// module.exports = router

//! Development branch up
