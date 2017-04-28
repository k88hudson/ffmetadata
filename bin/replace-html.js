const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "../extension/sidebar.html");
const htmlText = fs.readFileSync(htmlPath, "utf8");

fs.writeFileSync(htmlPath, htmlText.replace(/http:\/\/localhost:1936\//g, ""), "utf8");
