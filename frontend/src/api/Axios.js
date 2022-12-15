import axios from "axios";
import LocalStorageService from "./localstorage";
import JsonFormatter from "./jsonFormatter";

var CryptoJS = require("crypto-js");

// Generate random 16 bytes to use as IV
var IV = CryptoJS.enc.Utf8.parse("1583288699248111");

var keyString = "thisIsAverySpecialSecretKey00000";
// finds the SHA-256 hash for the keyString
// var Key = CryptoJS.SHA256(keyString);
//var Key = CryptoJS.SHA256(keyString);

var Key = CryptoJS.enc.Utf8.parse(keyString);

// function encrypt(data) {
//   var val = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
//   var encrypted = CryptoJS.AES.encrypt(val, Key, { iv: IV }).toString();
//   var b64 = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Base64);
//   // //// console.log(b64)
//   return b64;
// }

export function encrypt(data) {
  // var encryptedCP = CryptoJS.AES.encrypt(data, Key, { iv: IV });
  // var cryptText = encryptedCP.toString();
  // var cipherParams = CryptoJS.lib.CipherParams.create({
  //   ciphertext: CryptoJS.enc.Base64.parse(cryptText),
  //   formatter: JsonFormatter,
  // });
  // return cipherParams.toString();

  var encrypt = CryptoJS.AES.encrypt(data, Key, {
    iv: IV,
    mode: CryptoJS.mode.CBC
  });
  //// console.log("axios data-------",data)
  //// console.log("axios encrypt-------", encrypt.toString())
  return encrypt.toString()
  
}

// export function decrypt(request)
// {
//   var decryptedFromText = CryptoJS.AES.decrypt(
//     JsonFormatter.parse(JSON.stringify(request)),
//     Key,
//     { iv: IV }
//   );

//   let recievedData = JSON.parse(decryptedFromText.toString(CryptoJS.enc.Utf8))


//   if(  typeof recievedData === "string"){
//    recievedData = JSON.parse(recievedData);
//   }
// }



process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export const baseURL = process.env.REACT_APP_API_URL;


const loginURL = "/api/oauth/token";
const logoutURL = "/api/logout";

const client_id = "application";
const client_secret = "secret";


const caxios = axios.create({
  baseURL: baseURL,

  headers: { "Access-Control-Allow-Origin": "*" },
  //   httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //   }),
  transformRequest: [
    (data, headers) => {
      // if(headers.originalRequest===loginURL){

      //   return JSON.parse(data);
      // }else{
        // //// console.log("This is the send data request: ------  "+data);
        var sendReq = {
          request: encrypt(data),
          passphase: IV.toString(),
        };
        // // console.log("This is the send request: ------  "+sendReq);
        return sendReq;

      // }
      // return data;
    },
    ...axios.defaults.transformRequest,
  ],
  transformResponse: [
    (data, header) => {
      let resp;
      resp = data;
      const { request, passphase } = JSON.parse(resp);
    //  let recievedData= decrypt(request)
    var decryptedFromText = CryptoJS.AES.decrypt(
      JsonFormatter.parse(JSON.stringify(request)),
      Key,
      { iv: IV }
    );
  
    let recievedData = JSON.parse(decryptedFromText.toString(CryptoJS.enc.Utf8))
    // // console.log(
    //   "decryptedFromText:---------   ",
    //     recievedData
    // );
  
    if(  typeof recievedData === "string"){
     recievedData = JSON.parse(recievedData);
    }
      
      return recievedData;
    },
  ],
});

// LocalstorageService
const localStorageService = LocalStorageService.getService();

// Add a request interceptor
caxios.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken();
    if (token && config.url !== loginURL) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor

caxios.interceptors.response.use(
  (response) => {
    // //// console.log("In response interceptor", response.config.url, response);
    if (response.status === 200 && response.config.url === loginURL) {
      if (response?.data?.data !== null) {
        localStorageService.setToken(response.data);
      }
      return response;
    }
    if (response.status === 400 && response.config.url === loginURL) {
      return response;
    }
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (!error.response) {
      //// console.log("!error.response", error);
      let customError = new Error("Network unreachable");
      customError.status = 202;
      return Promise.reject(customError);
    }

    if (error.response.status === 400 && originalRequest.url === loginURL) {
      //// console.log("error 400", error);
      return Promise.reject(error.response);
    }

    if (error.response.status === 401 && originalRequest.url === loginURL) {
      //router.push('/login');
      //// console.log("error 401", error);
      window.location = `${process.env.PUBLIC_URL}/login`;
      return Promise.reject(error);
    }

    if (error.response.status === 405 && originalRequest.url === loginURL) {
      //router.push('/login');
      //// console.log("error 405", error.response);
      return Promise.reject(error.response);
    }

    if (error.response.status === 401 && originalRequest.url === logoutURL) {
      localStorageService.clearToken();
      localStorage.setItem("loggedIn", false);
      window.location = `${process.env.PUBLIC_URL}/login`;
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      let token = getBasicToken();
      const rtoken = localStorageService.getRefreshToken();
      const userId = localStorage.getItem("username");
      let reqData = `grant_type=refresh_token&refresh_token=${rtoken}&client_id=${client_id}&username=${userId}`;
      let config = {
        headers: {
          Authorization: `Basic ${token}`,
        },
      };
      return axios
        .post(baseURL + loginURL, reqData, config)
        .then((res) => {
          if (res.status === 200) {
            localStorageService.setToken(res.data);
            return caxios(originalRequest);
          } else {
            localStorageService.clearToken();
            window.location = `${process.env.PUBLIC_URL}/login`;
          }
        })
        .catch(function (err) {
          localStorageService.clearToken();
          localStorage.setItem("loggedIn", false);
          window.location = `${process.env.PUBLIC_URL}/login`;
          return Promise.reject(err);
        });
    }
    //// console.log("error out side", error);
    return Promise.reject(error);
  }
);

function getBasicToken() {
  let temp = client_id + ":" + client_secret;
  let token = btoa(temp);

  return token;
}

export function login(userId,email, password,phoneNumber , callback, loginfrom) {
  let reqData = `grant_type=password&username=${phoneNumber}&email=${email}&password=${password}&client_id=${client_id}&phoneNumber=${phoneNumber}`;
  if(loginfrom!== undefined && userId===password){
    
    reqData = `grant_type=password&username=${userId}&email=${email}&password=${password}&client_id=${client_id}&loginMethod=${loginfrom}`;
  }
  let token = getBasicToken();
  let config = {
    headers: {
     // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${token}`,
    },
  };
  caxios
    .post("/api/oauth/token", reqData, config)
    .then((res) => callback(res))
    .catch((err) => callback(err));
}

//export default caxios, login;
export default caxios;

// sample
// import -
// import api, {login} from './service/ApiService';
// login -
// login(cuser,cpass, (response) => {
//  //// console.log(response);
// })


// get -
// api.get(<url>)
// .then(res => {
//   //// console.log(res);
// })


// post -
// api.post(<url>, data, config)
//  .then(res => {
//     //// console.log(res);
//   })