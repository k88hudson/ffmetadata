const data = platform_require("sdk/self").data;
const {CONTENT_TO_ADDON_EVENT, ADDON_TO_CONTENT_EVENT} = require("./constants");
const getMetadata = require("./utils/get-metadata");
const {Sidebar} = platform_require("sdk/ui/sidebar");
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
    if (this.unload) this.unload();
    this.unload = null;
  },
  onReady: function() {
    console.log("ready");
    const channel = new MessageChannel();
    const addonSide = channel.port1;
    const panelSide = channel.port2;
    let tabWorker;
    let tab;

    function onContentScriptMessage(action) {
      if (action.type === "PAGE_TEXT") {
        const metadata = getMetadata(action.data);
        addonSide.postMessage(metadata);
      }
    }

    function onPanelMessage(e) {
      console.log(e);
    }

    function setWorker() {
      tab = tabs.activeTab;
      tabWorker = tab.attach({contentScriptFile: "content-script.js"});
      tabWorker.port.on("message", onContentScriptMessage);
      tab.on("ready", setWorker);
    }

    setWorker();
    addonSide.onmessage = e => tabWorker.port.emit("message", e.data);
    panelSide.onmessage = onPanelMessage;
    this.postMessage("port", [panelSide]);
    this.unload = () => {
      tab.off("ready", setWorker);
      worker.port.off("message", onContentScriptMessage);
    };
  }
});

const metadataTool = new Tool({
  panels: {metadata: MetadataDebugger}
});
