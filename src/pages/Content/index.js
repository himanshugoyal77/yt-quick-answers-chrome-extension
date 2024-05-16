import React from 'react';
import { createRoot } from 'react-dom/client';
import Content from './Content';
import Tabbar from './Tab';

(() => {
  let isClicked = false;

  let videUrl = window.location.href;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, value, videoId, url } = message;
    videUrl = url;
    if (type === 'NEW') {
      newVideoLoaded(videoId);
    }
  });

  const newVideoLoaded = (videoId) => {
    const div = document.createElement('img');
    div.style.position = 'fixed';
    div.style.bottom = '0';
    div.style.right = '0';
    div.style.zIndex = '9999';
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.border = '1px solid red';
    div.style.cursor = 'pointer';
    div.src =
      'https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw=';
    const body = document.querySelector('body');
    body.appendChild(div);

    const parent = document.createElement('div');
    parent.style.position = 'fixed';
    parent.style.bottom = '120px';
    parent.style.right = '0';
    parent.style.zIndex = '999';
    parent.classList.add('greasy-extension');
    console.log('clicked', isClicked);

    div.addEventListener('click', () => {
      if (!isClicked) {
        // parent.style.display = 'block';
        body.appendChild(parent);
        const root = createRoot(parent);
        root.render(<Tabbar videoId={videoId} />);
        isClicked = true;
      } else {
        const parent = document.querySelector('.greasy-extension');
        if (parent) {
          parent.remove();
          isClicked = false;
        }

        // parent.style.display = 'none';
      }
    });

    // const root = createRoot(div);
    // root.render(<Content videoId={videoId} />);
  };

  if (videUrl && videUrl.includes('youtube.com/watch')) {
    newVideoLoaded();
  }
})();
// Compare this snippet from src/pages/Popup/index.js:
