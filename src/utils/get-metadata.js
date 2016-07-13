const {Cc, Ci} = platform_require("chrome");
const MetadataParser = require("page-metadata-parser");
const {resolve} = require("url");

const parser = new MetadataParser({
  site_name: [
    ['meta[property="og:site_name"]', node => node.element.content],
  ]
});

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
  const result = tempFixUrls(parser.getMetadata(htmlDoc), data.documentURI);
  result.metaTags = Array.map.call(null, htmlDoc.querySelectorAll("meta"), item => {
    const attributes = {};
    Array.forEach.call(null, item.attributes, attr => attributes[attr.nodeName] = attr.nodeValue);
    return attributes;
  });
  console.log(result.metaTags);
  return result;
};
