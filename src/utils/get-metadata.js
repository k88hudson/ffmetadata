const {Cc, Ci} = platform_require("chrome");
const urlParse = require("url-parse");

function getDocumentObject(data) {
  const parser = Cc["@mozilla.org/xmlextras/domparser;1"]
                .createInstance(Ci.nsIDOMParser);
  // parser.init(null, data.documentURI, data.baseURI);
  return parser.parseFromString(data.fullText, "text/html");
}

const selectors = {
  title: [
    ['meta[property="og:title"]', el => el.content],
    ['meta[property="twitter:title"]', el => el.content],
    ['link[rel="canonical"]', el => el.href || el.text],
    ['title', el => el.textContent]
  ],
  icon: [
    ['link[rel="apple-touch-icon-precomposed"]', el => el.href],
    ['link[rel="apple-touch-icon"]', el => el.href],
    ['link[rel="shortcut icon"]', el => el.text],
    ['link[rel="fluid-icon"]', el => el.href],
    ['meta[name="msapplication-square*logo"]', el => el.content]
  ],
  favicon: [
    ['link[rel="shortcut icon"]', el => el.href]
  ],
  description: [
    ['meta[name="description"]', el => el.content]
  ],
  image: [
    ['meta[property="og:image"]', el => el.content]
  ]
};

module.exports = function (data) {
  const htmlDoc = getDocumentObject(data);
  return Object.keys(selectors).map(key => {
    const rules = selectors[key];
    let result;
    rules.some(rule => {
      const [selector, extract] = rule;
      const el = htmlDoc.querySelector(selector);
      if (!el) return;
      const extracted = extract(el);
      if (!extracted) return;
      result = {};
      result[key] = extracted;
      return true;
    });
    return result;
  })
  .filter(item => item)
  .reduce((prev, current) => {
    return Object.assign(prev, current);
  }, {});
};
