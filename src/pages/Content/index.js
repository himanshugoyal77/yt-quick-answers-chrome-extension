import React from 'react';
import { createRoot } from 'react-dom/client';
import Content from './Content';

(() => {
  let videUrl = window.location.href;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, value, videoId, url } = message;
    videUrl = url;
    if (type === 'NEW') {
      newVideoLoaded(videoId);
    }
  });

  const newVideoLoaded = (videoId) => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '0';
    div.style.right = '0';
    div.style.zIndex = '999';
    const body = document.querySelector('body');
    body.appendChild(div);
    const root = createRoot(div);
    root.render(<Content videoId={videoId} />);
  };
  
  if (videUrl && videUrl.includes('youtube.com/watch')) {
    newVideoLoaded();
  }
})();
// Compare this snippet from src/pages/Popup/index.js:
