const backgroundPagePort = browser.runtime.connect({
  name: `devtools_panel:${browser.devtools.inspectedWindow.tabId}`
});

const {port1, port2} = new MessageChannel();

window.postMessage("devtools_channels", window.location, [port2]);

port1.onmessage = (evt) => {
  if (evt.data === "REFRESH") {
    backgroundPagePort.postMessage({type: "GET_PAGE_DATA"});
  }
};

backgroundPagePort.onMessage.addListener((msg) => {
  port1.postMessage(msg.pageData);
});

backgroundPagePort.postMessage({type: "GET_PAGE_DATA"});
