const {CONTENT_TO_ADDON_EVENT, ADDON_TO_CONTENT_EVENT} = require("./constants");
function sendData() {
  if (!document.hasFocus()) return;
  const data = {
    baseURI: document.baseURI,
    documentURI: document.documentURI,
    fullText: document.documentElement.innerHTML
  };
  self.port.emit(CONTENT_TO_ADDON_EVENT, {type: "DATA_RESPONSE", data});
  window.removeEventListener("load", sendData);
}

sendData();
if (document.readyState === "complete") {
  sendData();
} else {
  window.addEventListener("load", sendData);
}

self.port.on(ADDON_TO_CONTENT_EVENT, data => {
  if (data.type === "DATA_REQUEST") {
    sendData();
  }
});

// Send a message when the page unloads
window.addEventListener("pagehide", function() {
  self.port.emit(CONTENT_TO_ADDON_EVENT, {type: "DATA_CLEAR"});
}, false);

window.addEventListener("focus", function() {
  sendData();
});
