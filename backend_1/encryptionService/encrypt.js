// crypto module
const crypto = require("crypto");
// var CryptoJS = require("crypto-js");

const algorithm = "aes-256-cbc"; 
const key = "my-secret-key@123"; 

// generate 16 bytes of random data
// const initVector = crypto.randomBytes(16);

// protected data
// const message = "This is a secret message";

function encyptMessage(msg){
    // secret key generate 32 bytes of random data
// const Securitykey = crypto.randomBytes(32);

// the cipher function
// const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

// encrypt the message
// input encoding
// output encoding
// let encryptedData = cipher.update(msg, "utf-8", "hex");

// encryptedData += cipher.final("hex");

// console.log("Encrypted message: " + encryptedData);

// var bytes = CryptoJS.AES.decrypt(msg, 'my-secret-key@123');
// console.log("bytes: " + bytes);
//   var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//   console.log("decryptedData: " + decryptedData);

// return decryptedData;
// return encryptedData;

var decipher = crypto.createDecipher(algorithm, key);
var decrypted = decipher.update(msg, 'hex', 'utf8');

console.log(decrypted);

}

module.exports = {
    encyptMessage:encyptMessage
}

