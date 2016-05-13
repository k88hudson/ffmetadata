const {CONTENT_TO_ADDON_EVENT} = require("./constants");

function onLoad() {
  const data = {
    baseURI: document.baseURI,
    documentURI: document.documentURI,
    fullText: document.documentElement.innerHTML
  };
  self.port.emit(CONTENT_TO_ADDON_EVENT, data);
  window.removeEventListener("DOMContentLoaded", onLoad);
}

if (document.readyState === "complete") {
  onLoad();
} else {
  window.addEventListener("DOMContentLoaded", onLoad);
}
