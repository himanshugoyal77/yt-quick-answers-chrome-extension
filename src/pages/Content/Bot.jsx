import React, { useCallback, useEffect, useRef, useState } from 'react';
import './content.styles.css';

const db = new Set();

const Bot = ({ transcript, videoId }) => {
  console.log('db', db);
  const inputRef = useRef();
  const el = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  });

  const handleSend = async (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    const newMsg = messages.concat(
      <UserMsg key={messages.length + 1} text={inputRef.current.value} />
    );
    setMessages(newMsg);

    const res = await fetch('http://localhost:4500/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: inputRef.current.value, videoId }),
    });
    const data = await res.json();
    if (res.status === 200) {
      const newMsg = messages.concat(
        <div key={messages.length + 1} className="bot-message">
          {data.message}
        </div>
      );
      setMessages(newMsg);
      inputRef.current.value = '';
    }
  };
  const IndexTranscript = useCallback(async () => {
    if (transcript.length > 0 && !db.has(videoId)) {
      try {
        const res = await fetch('http://localhost:4500/generate-vectors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript, videoId }),
        });
        const data = await res.json();
        db.add(videoId);
        if (res.status === 200) {
          console.log('data', data);
          const newMsg = messages.concat(
            <div key={messages.length + 1} className="bot-message">
              {data.message}
            </div>
          );
          setMessages(newMsg);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [transcript, videoId]);

  useEffect(() => {
    IndexTranscript();
  }, [transcript, videoId]);

  return (
    <div className="chatbot">
      <div className="messages">
        {messages}
        <div id={'el'} ref={el} />
      </div>
      <div className="input">
        <form onSubmit={handleSend}>
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter your message here"
          />
          <button>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 500 500"
            >
              <g>
                <g>
                  <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
                </g>
              </g>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

const UserMsg = ({ text }) => {
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
};

export default Bot;
