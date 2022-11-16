const request = require("request");

module.exports.vdochiper = (params) => {
  let videoID = params.videoID;
  console.log(videoID);
  return new Promise((resolve, reject) => {
    try {
      var options = {
        method: "POST",
        url: `https://dev.vdocipher.com/api/videos/${videoID}/otp`,
        headers: {
          Accept: "application/json",
          Authorization:
            "Apisecret jwTJlcEOxctO8pfGz4BCzjCprgLYoLpYc3jlWJupGowdQt0EES3eIqVwgjbIdApX",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          annotate:
            "[{'type':'rtext', 'text':'Mind School', 'alpha':'0.30', 'color':'0xFF0000','size':'15','interval':'5000'}]",
        }),
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
