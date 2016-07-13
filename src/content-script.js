
function getData() {
  return {
    baseURI: document.baseURI,
    documentURI: document.documentURI,
    fullText: document.documentElement.innerHTML
  };
}

self.port.on("message", e => {
  console.log("content script received message");
  console.log(e);
});

self.port.emit("message", {type: "PAGE_TEXT", data: getData()});

console.log("content-script loaded");
