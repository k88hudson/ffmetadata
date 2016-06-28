const {Cc, Ci} = platform_require("chrome");
const urlParse = require("url-parse");

function getDocumentObject(data) {
  const parser = Cc["@mozilla.org/xmlextras/domparser;1"]
                .createInstance(Ci.nsIDOMParser);
  // parser.init(null, data.documentURI, data.baseURI);
  return parser.parseFromString(data.fullText, "text/html");
}

const selectors = {
  title: {
    oneOf: [
      ['meta[property="og:title"]', el => el.content],
      ['meta[property="twitter:title"]', el => el.content],
      ['title', el => el.textContent],
      ['link[rel="canonical"]', el => el.href || el.text]
    ]
  },
  icon: {
    oneOf: [
      ['link[rel="apple-touch-icon-precomposed"]', el => el.href],
      ['link[rel="apple-touch-icon"]', el => el.href],
      ['link[rel="shortcut icon"]', el => el.text],
      ['link[rel="fluid-icon"]', el => el.href],
      ['meta[name="msapplication-square*logo"]', el => el.content],
      ['meta[name="msapplication-TileImage"]', el => el.content]
    ]
  },
  favicon: {
    oneOf: [
      ['link[rel="shortcut icon"]', el => el.href],
      ['link[rel="icon"]', el => el.href],
      ['link[type="image/x-icon"]', el => el.href]
    ]
  },
  description: {
    oneOf: [
      ['meta[name="description"]', el => el.content]
    ]
  },
  image: {
    oneOf: [
      ['meta[property="og:image"]', el => el.content],
      ['img', el => el.src]
    ]
  },
  images: {
    allOf: [
      ['img', el => el.src]
    ]
  }
};

function protocolRelativeToHttps(url) {
  return url.replace(/^\/\//, "https://");
}

module.exports = function (data) {
  const htmlDoc = getDocumentObject(data);
  const result = Object.keys(selectors).map(key => {
    const rules = selectors[key];
    let result;
    if (rules.oneOf) {
      rules.oneOf.some(rule => {
        const [selector, extract] = rule;
        const el = htmlDoc.querySelector(selector);
        if (!el) return;
        const extracted = extract(el);
        if (!extracted) return;
        result = {};
        result[key] = protocolRelativeToHttps(extracted);
        return true;
      });
    }
    else if (rules.allOf) {
      result = {};
      result[key] = [];
      rules.allOf.forEach(rule => {
        const [selector, extract] = rule;
        const els = Array.from(htmlDoc.querySelectorAll(selector));
        els.forEach(el => {
          const extracted = extract(el);
          if (!extracted) return;
          result[key].push(protocolRelativeToHttps(extracted));
        });
      });
    }
    return result;
  })
  .filter(item => item)
  .reduce((prev, current) => {
    return Object.assign(prev, current);
  }, {});
  result.url = data.documentURI;
  return result;
};
