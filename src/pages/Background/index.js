(() => {
  chrome.tabs.onUpdated.addListener(async (tabId, tabObj) => {
    let [tab] = await chrome.tabs.query({ active: true });

    if (tab.url.includes('youtube.com/watch')) {
      const queryParameters = tab.url.split('?')[1];
      const urlParams = new URLSearchParams(queryParameters);
      const videoId = urlParams.get('v');

      chrome.tabs.sendMessage(tabId, { type: 'NEW', videoId, url: tab.url });
    }
  });
})();
