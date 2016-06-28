const {Cc, Ci} = platform_require("chrome");
const {getMetadata} = require("page-metadata-parser");

function getDocumentObject(data) {
  const parser = Cc["@mozilla.org/xmlextras/domparser;1"]
                .createInstance(Ci.nsIDOMParser);
  // parser.init(null, data.documentURI, data.baseURI);
  return parser.parseFromString(data.fullText, "text/html");
}

module.exports = function (data) {
  const htmlDoc = getDocumentObject(data);
  const result = getMetadata(htmlDoc);
  console.log(result);
  return result;
};
