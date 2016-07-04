
function getData() {
  return {
    baseURI: document.baseURI,
    documentURI: document.documentURI,
    fullText: document.documentElement.innerHTML
  };
}

// sendData();
// if (document.readyState === "complete") {
//   sendData();
// } else {
//   window.addEventListener("load", sendData);
// }

// self.port.on("ADDON_TO_CONTENT_EVENT", data => {
//   if (data.type === "DATA_REQUEST") {
//     sendData();
//   }
// });
//
// // Send a message when the page unloads
// window.addEventListener("pagehide", function() {
//   self.port.emit(CONTENT_TO_ADDON_EVENT, {type: "DATA_CLEAR"});
// }, false);
//
// window.addEventListener("focus", function() {
//   sendData();
// });

self.port.on("message", e => {
  console.log("content script received message");
  console.log(e);
});

self.port.emit("message", {type: "PAGE_TEXT", data: getData()});

console.log("content-script loaded");
