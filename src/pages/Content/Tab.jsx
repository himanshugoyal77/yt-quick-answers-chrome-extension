import React, { useCallback, useEffect, useState } from 'react';
import './content.styles.css';
import Content from './Content';
import { YoutubeTranscript } from 'youtube-transcript';
import Bot from './Bot';

const Tabbar = ({ videoId }) => {
  const [tabIdx, setTabIdx] = useState(0);

  const [transcript, setTranscript] = useState([]);

  const getTranscript = useCallback(async () => {
    YoutubeTranscript.fetchTranscript(videoId)
      .then((res) =>
        res.forEach((item) => setTranscript((prev) => [...prev, item.text]))
      )
      .catch((err) => console.log(err));
  }, [videoId]);

  useEffect(() => {
    getTranscript();
  }, [videoId]);

  console.log('transcript', transcript);

  return (
    <div className="wrapper">
      <div className="content-container">
        <div className="tabs">
          <div className="tab-header">
            <div
              onClick={() => setTabIdx(0)}
              className={tabIdx === 0 ? 'active' : ''}
            >
              Summarize
            </div>
            <div
              onClick={() => setTabIdx(1)}
              className={tabIdx === 1 ? 'active' : ''}
            >
              Chat
            </div>
          </div>
          <div
            className="tab-indicator"
            style={{
              left: `calc(calc(100% / 2) * ${tabIdx})`,
            }}
          ></div>
          <div className="tab-body">
            <div className="active"></div>
            <div className={tabIdx === 0 ? 'active' : ''}>
              <Content transcript={transcript} />
            </div>
            <div className={tabIdx === 1 ? 'active' : ''}>
              <Bot transcript={transcript.join(' ')} videoId={videoId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabbar;
