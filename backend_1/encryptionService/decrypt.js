// crypto module
const crypto = require("crypto");

const algorithm = "aes-256-cbc"; 

// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);



function decryptMessage(msg){

// secret key generate 32 bytes of random data
const Securitykey = "&CzHaI!ux0C1av5#fwD$4^lAN%haKqo0";



const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

console.log("Decrypted decipher: " + JSON.stringify(decipher));


let decryptedData = decipher.update(msg, "hex", "utf-8");

console.log("Decrypted decryptedData: " + decryptedData);


decryptedData += decipher.final("utf8");

console.log("Decrypted message: " + decryptedData);

return decryptedData;
}

module.exports = {
    decryptMessage : decryptMessage
}


