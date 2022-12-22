const request = require("request");

module.exports.vdochiper = (params) => {
  let videoID = params.videoID;
  // console.log(videoID);
  return new Promise((resolve, reject) => {
    try {
      var options = {
        method: "POST",
        url: `https://dev.vdocipher.com/api/videos/${videoID}/otp`,
        headers: {
          Accept: "application/json",
          Authorization:
            "Apisecret CkSGZrtxllPYCDH3RqoR5STBSawhzy23KJFqX49eonKRCnWPbLxEyWcGerUgUujk",
          "Content-Type": "application/json",
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        return resolve(response.body);
      });
      // request(options, function (error, response) {
      //   if (error) throw new Error(error);
      //   // console.log(response.body);
      //   return resolve(response.body);
      // })
    } catch (e) {
      return reject(e);
    }
  });
};
