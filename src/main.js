const pageMod = platform_require("sdk/page-mod");
const data = platform_require("sdk/self").data;
const {CONTENT_TO_ADDON_EVENT, ADDON_TO_CONTENT_EVENT} = require("./constants");
const getMetadata = require("./utils/get-metadata");

const {Sidebar} = platform_require("sdk/ui/sidebar");

let sidebarWorker;
let sendToDebugger;
// let pageModWorkers = new Set();

pageMod.PageMod({
  include: "*",
  attachTo: ["existing", "top"],
  contentScriptFile: data.url("content-script.js"),
  onAttach(worker) {
    worker.port.on(CONTENT_TO_ADDON_EVENT, action => {
      switch (action.type) {
        case "DATA_CLEAR":
          // sidebarWorker.port.emit(CONTENT_TO_ADDON_EVENT, {});
          sendToDebugger({});
          break;
        case "DATA_RESPONSE":
          const metadata = getMetadata(action.data);
          // sidebarWorker.port.emit(CONTENT_TO_ADDON_EVENT, metadata);
          sendToDebugger(metadata);
          break;
      }
    });
  }
});

// Sidebar({
//   id: "metadata-debugger",
//   title: "Metadata debugger",
//   url: "./sidebar.html",
//   onAttach: function (worker) {
//     console.log("attach");
//     sidebarWorker = worker;
//   }
// }).show();

// require the SDK modules
const {Panel} = platform_require("dev/panel");
const {Tool} = platform_require("dev/toolbox");
const {Class} = platform_require("sdk/core/heritage");

const MetadataDebugger = Class({
  extends: Panel,
  label: "Metadata",
  tooltip: "Metadata debugger",
  icon: data.url("icon.png"),
  url: data.url("sidebar.html"),
  setup: function(options) {
    console.log("setup");
  },
  dispose: function() {
    console.log("dispose");
  },
  onReady: function() {
    sendToDebugger = data => {
      this.postMessage(CONTENT_TO_ADDON_EVENT, data);
    };
  }
});

const metadataTool = new Tool({
  panels: {metadata: MetadataDebugger}
});
