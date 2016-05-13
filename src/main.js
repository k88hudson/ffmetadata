const pageMod = platform_require("sdk/page-mod");
const data = platform_require("sdk/self").data;
const {CONTENT_TO_ADDON_EVENT} = require("./constants");
const getMetadata = require("./utils/get-metadata");

pageMod.PageMod({
  include: "*",
  contentScriptFile: data.url("content-script.js"),
  onAttach(worker) {
    worker.port.on(CONTENT_TO_ADDON_EVENT, data => {
      console.log(data.documentURI);
      console.log(JSON.stringify(getMetadata(data), null, 2));
    });
  }
});
