const getMetadata = require("./utils/get-metadata.js");

function getData() {
  return getMetadata({
    baseURI: document.baseURI,
    documentURI: document.documentURI,
    fullText: document.documentElement.innerHTML
  });
}

browser.runtime.onMessage.addListener((actionType) => {
  if (actionType === "GET_PAGE_DATA") {
    return Promise.resolve(getData());
  }
});

browser.runtime.sendMessage({
  type: "PAGE_DATA_UPDATED",
  pageData: getData(),
});
