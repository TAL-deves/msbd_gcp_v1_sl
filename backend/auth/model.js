const { response } = require("express");
var mongoose = require("mongoose");
const {v4 : uuidv4} = require('uuid')
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();

const signUpTemplateCopy = require("../Database/models/SignUpModels");

/**
 * Configuration.
 */

var clientModel = require("../Database/models/client"),
  tokenModel = require("../Database/models/token"),
  loggedInUserModel = require("../Database/models/SignUpModels");

/**
 * Add example client and user to the database (for debug).
 */

var loadExampleData = function () {
  var client1 = new clientModel({
    id: "application", // TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
    clientId: "application",
    clientSecret: "secret",
    grants: ["password", "refresh_token"],
    redirectUris: [],
  });

  var client2 = new clientModel({
    clientId: "confidentialApplication",
    clientSecret: "topSecret",
    grants: ["password", "client_credentials"],
    redirectUris: [],
  });

  client1.save(function (err, client) {
    if (err) {
      return console.error(err);
    }
    console.log("Created client", client);
  });

  client2.save(function (err, client) {
    if (err) {
      return console.error(err);
    }
    console.log("Created client", client);
  });
};

// !  Dump the database content (for debug).

var dump = function () {
  clientModel.find(function (err, clients) {
    if (err) {
      return console.error(err);
    }
    console.log("clients", clients);
  });
  tokenModel.find(function (err, tokens) {
    if (err) {
      return console.error(err);
    }
    console.log("tokens", tokens);
  });
  loggedInUserModel.find(function (err, users) {
    if (err) {
      return console.error(err);
    }
    console.log("users", users);
  });
};

/*
 * Methods used by all grant types.
 */

var getAccessToken = function (token, callback) {
  tokenModel
    .findOne({
      accessToken: token,
    })
    .lean()
    .exec(
      function (callback, err, token) {
        if (!token) {
          console.error("Token not found");
          let msg = "Token not found";
          callback(msg);
        }
        callback(err, token);
      }.bind(null, callback)
    );
};

var getClient = function (clientId, clientSecret, callback) {
  clientModel
    .findOne({
      clientId: clientId,
      clientSecret: clientSecret,
    })
    .lean()
    .exec(
      function (callback, err, client) {
        if (!client) {
          console.error("Client not found");
          let msg = "Client not found";
          callback(msg);
        }
        callback(err, client);
      }.bind(null, callback)
    );
};

// var saveToken = function (token, client, user, callback) {
//   token.client = {
//     id: client.clientId,
//   };

//   token.user = {
//     username: user.username,
//   };

//   var tokenInstance = new tokenModel(token);
//   tokenInstance.save(
//     function (callback, err, token) {
//       if (!token) {
//         console.error("Token not saved");
//         let msg = "Token not saved";
//         callback(msg);
//       } else {
//         token = token.toObject();
//         delete token._id;
//         delete token.__v;
//       }
//       callback(err, token);
//     }.bind(null, callback)
//   );
// };

// ! ********** MY ADDITION *********

var saveToken = async function (token, client, user, callback) {
  token.client = {
    id: client.clientId,
  };
  token.user = {
    username: user.username,
  };
  var tokenInstance = new tokenModel(token);
  tokenModel
    .findOne({
      user: { username: token.user.username },
    })
    .lean()
    .exec(
      async function (callback, err, token) {
        if (!token) {
          
          tokenInstance.save(
            function (callback, err, token) {
              token = token.toObject();
              delete token._id;
              delete token.__v;
              callback(err, token);
            }.bind(null, callback)
          );
          // tokenInstance["expiryTime"] = `${expiry} seconds`;
          // tokenInstance["expiryStatus"] = false;
          delete tokenInstance._id;
          delete tokenInstance.__v;
          callback(err, tokenInstance);
          console.log("No token found!!! NEW TOKEN GERENATED");
        } else {
          let currentDate = new Date().getTime();
          let tokenExpires = new Date(token.accessTokenExpiresAt).getTime();
          let expiry = (tokenExpires - currentDate) / 1000;
          console.log("currentDate: ", currentDate);
          console.log("tokenExpires: ", tokenExpires);

          if (expiry < 0) {
            console.log(token.accessToken + " token expired");
            await tokenModel.deleteOne({ id: token.id }).exec(); // handle deletion
            tokenInstance.save(); // save new one here
            tokenInstance["expiryTime"] = `${expiry} seconds`;
            tokenInstance["expiryStatus"] = true;
            console.log("A new token is genererated");
          } else if (expiry > 0) {
            console.log("token Still alive");
            let newtoken = await tokenModel.findOneAndUpdate(token._id);
            token["expiryTime"] = `${expiry} seconds left`;
            token["expiryStatus"] = false;
            await newtoken.updateOne({
              expiryTime: expiry,
              expiryStatus: false
            })
          }
          delete token._id;
          delete token.__v;
        }
        callback(err, token);
      }.bind(null, callback)
    );
};

// ********** MY ADDITION Ends ******

/*
 * Method used only by password grant type.
 */

var getUser = function (username, password, callback) {
  // let encPassword = bcrypt.hash(password, 12);
  loggedInUserModel
    .findOne({
      username: username,
      // password: password,
    })
    .lean()
    .exec(
      function (callback, err, user) {
        // let errr = ""
        if (!user) {
          callback(err);
        }
        callback(err, user);
      }.bind(null, callback)
    );
};

/*
 * Method used only by client_credentials grant type.
 */

var getUserFromClient = function (client, callback) {
  clientModel
    .findOne({
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      grants: "client_credentials",
    })
    .lean()
    .exec(
      function (callback, err, client) {
        if (!client) {
          console.error("Client not found");
        }

        callback(err, {
          username: "",
        });
      }.bind(null, callback)
    );
};

/*
 * Methods used only by refresh_token grant type.
 */

var getRefreshToken = function (refreshToken, callback) {
  tokenModel
    .findOne({
      refreshToken: refreshToken,
    })
    .lean()
    .exec(
      function (callback, err, token) {
        if (!token) {
          console.error("Token not found");
        }

        callback(err, token);
      }.bind(null, callback)
    );
};

// var revokeToken = function(token, callback) {
// 	tokenModel.deleteOne({
// 		accessToken: token.accessToken
// 	}).exec((function(callback, err, results) {
// 		var deleteSuccess = results && results.deletedCount === 1;
// 		let result = '';
// 		if (!deleteSuccess) {
// 			// result = "token not found"
// 			// 	callback(result)
// 			return err;
// 			}
// 		else{
// 			return err;
// 			// result = "Revoked"
// 			// callback(result)
// 		}
// 		// callback(msg, deleteSuccess);
// 	}).bind(null, callback));

// 	callback("Token Deleted!")
// };

var revokeToken = async function (token, callback) {
  // try {
    let username = await tokenModel.findOne({
      accessToken: token.accessToken
    })
    
  
        if (username) {
          await signUpTemplateCopy.findOneAndUpdate({
            username: username.user.username
          },
          {$set:{
            loggedinID: ""
          }})
        }

    tokenModel
      .deleteOne({
        accessToken: token.accessToken,
      })
      .exec(
        function (done, err, results) {
          var deleteSuccess = results && results.deletedCount === 1;
  
          if (!deleteSuccess) {
            console.log("No token found!");
            // callback(err);
            let msg = "No token found!"
            // return response.json(msg);
          }
          console.log("Token removed!");
          // callback('Token Deleted!')
          // response.status(200).sendStatus("token removed")
        }.bind(null, callback)
        );
  
        // await signUpTemplateCopy.findOneAndUpdate({
        //   username: username.user.username
        // },
        // {$set:{
        //   loggedinID: ""
        // }})

        // } catch (error) {
  //   let msg = "Server error"
  //   return msg
  // }
  

};

/**
 * Export model definition object.
 **/

module.exports = {
  getAccessToken: getAccessToken,
  getClient: getClient,
  saveToken: saveToken,
  getUser: getUser,
  getUserFromClient: getUserFromClient,
  getRefreshToken: getRefreshToken,
  revokeToken: revokeToken,
  loadExampleData: loadExampleData,
};
