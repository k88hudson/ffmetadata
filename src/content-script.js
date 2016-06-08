const {CONTENT_TO_ADDON_EVENT} = require("./constants");
function onLoad() {
  const data = {
    baseURI: document.baseURI,
    documentURI: document.documentURI,
    fullText: document.documentElement.innerHTML
  };
  self.port.emit(CONTENT_TO_ADDON_EVENT, data);
  window.removeEventListener("load", onLoad);
}

if (document.readyState === "complete") {
  onLoad();
} else {
  window.addEventListener("load", onLoad);
}

// setTimeout(onLoad, 5000);
