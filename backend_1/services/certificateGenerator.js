// Import dependencies
const fs = require("fs");
const moment = require("moment");
const PDFDocument = require("pdfkit");

// require('../assets/images')

const getCertificate = (username) => {

// Create the PDF document
const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
});

// The name
const name = username;
console.log('Current directory: ' + process.cwd());
console.log(username);


// Pipe the PDF into an name.pdf file
doc.pipe(fs.createWriteStream(`${username}.pdf`));

// Draw the certificate image
doc.image("./images/certificate.png", 0, 0, { width: 842 });

// Remember to download the font
// Set the font to Dancing Script
doc.font("./fonts/DancingScript-VariableFont_wght.ttf");

// Draw the name
doc.fontSize(60).text(name, -50, 265, {
    align: "center"
});

// Draw the date
doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -450, 470, {
    align: "center"
});

// Finalize the PDF and end the stream
doc.end();
}
module.exports = { getCertificate: getCertificate};