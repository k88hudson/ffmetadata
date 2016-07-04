const pageMod = platform_require("sdk/page-mod");
const data = platform_require("sdk/self").data;
const {CONTENT_TO_ADDON_EVENT, ADDON_TO_CONTENT_EVENT} = require("./constants");
const getMetadata = require("./utils/get-metadata");
const {Sidebar} = platform_require("sdk/ui/sidebar");

let sidebarWorker;
let sendToDebugger;
// let pageModWorkers = new Set();

// pageMod.PageMod({
//   include: "*",
//   attachTo: ["existing", "top"],
//   contentScriptFile: data.url("content-script.js"),
//   onAttach(worker) {
//     worker.port.on(CONTENT_TO_ADDON_EVENT, action => {
//       switch (action.type) {
//         case "DATA_CLEAR":
//           // sidebarWorker.port.emit(CONTENT_TO_ADDON_EVENT, {});
//           sendToDebugger({});
//           break;
//         case "DATA_RESPONSE":
//           const metadata = getMetadata(action.data);
//           // sidebarWorker.port.emit(CONTENT_TO_ADDON_EVENT, metadata);
//           sendToDebugger(metadata);
//           break;
//       }
//     });
//   }
// });

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
const tabs = platform_require("sdk/tabs");
 const {MessageChannel} = platform_require("sdk/messaging");

const MetadataDebugger = Class({
  extends: Panel,
  label: "Metadata",
  tooltip: "Metadata debugger",
  icon: data.url("icon.svg"),
  url: data.url("sidebar.html"),
  setup: function(options) {
    console.log("setup");
  },
  dispose: function() {
    console.log("dispose");
  },
  onReady: function() {
    const channel = new MessageChannel();
    const addonSide = channel.port1;
    const panelSide = channel.port2;
    let worker;

    function onContentScriptMessage(action) {
      if (action.type === "PAGE_TEXT") {
        const metadata = getMetadata(action.data);
        addonSide.postMessage(metadata);
      }
    }

    function setWorker() {
      worker = tabs.activeTab.attach({
        contentScriptFile: "content-script.js",
      });
      worker.port.on("message", onContentScriptMessage);
      tabs.activeTab.on("ready", setWorker);
    }

    setWorker();

    addonSide.onmessage = function(evt) {
      worker.port.emit("message", evt.data);
    };

    this.postMessage("port", [panelSide]);

    console.log("panel ready");
  }
});

const metadataTool = new Tool({
  panels: {metadata: MetadataDebugger}
});
