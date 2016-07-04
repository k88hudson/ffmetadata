const {Cc, Ci} = platform_require("chrome");
const {getMetadata} = require("page-metadata-parser");
const {resolve} = require("url");

function getDocumentObject(data) {
  const parser = Cc["@mozilla.org/xmlextras/domparser;1"]
                .createInstance(Ci.nsIDOMParser);
  // parser.init(null, data.documentURI, data.baseURI);
  return parser.parseFromString(data.fullText, "text/html");
}

function tempFixUrls(data, baseUrl) {
  function resolveUrl(url) {
    if (!url) return url;
    url = url.replace(/\/\/^/, "http://");
    return resolve(baseUrl, url);
  }
  data.image_url = resolveUrl(data.image_url);
  data.icon_url = resolveUrl(data.icon_url);
  data.url = resolveUrl(data.url || baseUrl);
  return data;
}

module.exports = function (data) {
  const htmlDoc = getDocumentObject(data);
  const result = tempFixUrls(getMetadata(htmlDoc), data.documentURI);
  return result;
};
