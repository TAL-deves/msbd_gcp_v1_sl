const request = require("request");
const crypto = require("crypto");


module.exports.sendSms = (params) => {
  let reciever = params.reciever;
  let OTP = params.OTP
  let hashTag = params.hashTag
  const id = crypto.randomBytes(10).toString("hex");
  console.log("from sendsms --  " + reciever + "  "+ OTP, "hashTag -- ", hashTag);
  return new Promise((resolve, reject)=> {
    try {
    var options = {
      'method': 'POST',
      'url': 'https://smsplus.sslwireless.com/api/v3/send-sms',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "api_token": "f55icqnw-1lwnu7du-jnrg4euq-66kmlkdl-06uz5jwo",
        "sid": "TECHLTDMASK",
        "msisdn": `${reciever}`,
        "sms": `Your OTP is ${OTP} to verify your phone number for Mind School.${hashTag? `\n${hashTag}` : ""}`, //Added hashtag
        "csms_id": `${id}`
      })
    
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      // console.log(response.body);
      return resolve(response.body);
    })
  } catch(e) {
    return reject(e)
 }
})
};
