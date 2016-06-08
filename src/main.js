const pageMod = platform_require("sdk/page-mod");
const data = platform_require("sdk/self").data;
const {CONTENT_TO_ADDON_EVENT} = require("./constants");
const getMetadata = require("./utils/get-metadata");

const {Sidebar} = platform_require("sdk/ui/sidebar");

let sidebarWorker;

pageMod.PageMod({
  include: "*",
  attachTo: ["existing", "top"],
  contentScriptFile: data.url("content-script.js"),
  onAttach(worker) {
    worker.port.on(CONTENT_TO_ADDON_EVENT, data => {
      console.log(data.documentURI);
      const metadata = getMetadata(data);
      console.log(JSON.stringify(metadata, null, 2));
      sidebarWorker.port.emit(CONTENT_TO_ADDON_EVENT, metadata);
    });
  }
});

Sidebar({
  id: "metadata-debugger",
  title: "Metadata debugger",
  url: "./sidebar.html",
  onAttach: function (worker) {
    sidebarWorker = worker;
  }
}).show();
