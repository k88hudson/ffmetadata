const devToolsPanelsByTabId = new Map();

browser.runtime.onConnect.addListener((port) => {
  if (port.name.startsWith("devtools_panel:")) {
    const tabId = parseInt(port.name.split(":")[1], 10);
    const onPortDisconnect = () => {
      devToolsPanelsByTabId.delete(tabId);
      port.onDisconnect.removeListener(onPortDisconnect);
    };
    const onPortMessage = async (action) => {
      if (action.type === "GET_PAGE_DATA") {
        let pageData = await browser.tabs.sendMessage(tabId, "GET_PAGE_DATA");
        port.postMessage({type: "PAGE_DATA", pageData});
      }
    };

    port.onDisconnect.addListener(onPortDisconnect);
    port.onMessage.addListener(onPortMessage);
    devToolsPanelsByTabId.set(tabId, port);
  }
});

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "PAGE_DATA_UPDATED" && sender.tab) {
    let devToolsPanelPort = devToolsPanelsByTabId.get(sender.tab.id);

    if (devToolsPanelPort) {
      devToolsPanelPort.postMessage({type: "PAGE_DATA", pageData: msg.pageData});
    }
  }
});
