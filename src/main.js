const pageMod = platform_require("sdk/page-mod");
const data = platform_require("sdk/self").data;
const {CONTENT_TO_ADDON_EVENT, ADDON_TO_CONTENT_EVENT} = require("./constants");
const getMetadata = require("./utils/get-metadata");

const {Sidebar} = platform_require("sdk/ui/sidebar");

let sidebarWorker;
// let pageModWorkers = new Set();

pageMod.PageMod({
  include: "*",
  attachTo: ["existing", "top"],
  contentScriptFile: data.url("content-script.js"),
  onAttach(worker) {
    worker.port.on(CONTENT_TO_ADDON_EVENT, action => {
      switch (action.type) {
        case "PAGE_HIDE":
          console.log("page hide");
          break;
        case "DATA_RESPONSE":
          const metadata = getMetadata(action.data);
          sidebarWorker.port.emit(CONTENT_TO_ADDON_EVENT, metadata);
          break;
      }
    });
  }
});

Sidebar({
  id: "metadata-debugger",
  title: "Metadata debugger",
  url: "./sidebar.html",
  onAttach: function (worker) {
    console.log("attach");
    sidebarWorker = worker;
  }
}).show();
