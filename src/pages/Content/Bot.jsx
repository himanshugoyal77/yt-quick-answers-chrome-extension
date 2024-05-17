import React, { useCallback, useEffect, useRef, useState } from 'react';
import './content.styles.css';
import { Bars } from 'react-loader-spinner';

const Bot = ({ transcript, videoId }) => {
  const inputRef = useRef();
  const el = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  });

  const getApiResponse = async (query) => {
    const res = await fetch('http://localhost:4500/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query, videoId }),
    });

    const data = await res.json();

    // id loading true, show ... in the bot message
    if (res.status === 200) {
      return data.message;
    }

    return 'Sorry, I am not able to understand your query';
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const query = inputRef.current.value;

    if (query === '') {
      setMessages((prev) => [
        ...prev,
        <div key={Date.now()} className="bot-message">
          Please enter a valid query
        </div>,
      ]);
      return;
    }

    inputRef.current.value = '';

    // setMessages((prev) => [
    //   ...prev,
    //   <div key={Date.now()} className="user-message">
    //     {query}
    //   </div>,
    // ]);
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={query} />,
      <BotMessage
        key={messages.length + 2}
        fetchMessage={async () => await getApiResponse(query)}
      />
    );
    setMessages(newMessages);
  };

  console.log('messsages', messages);

  const IndexTranscript = useCallback(async () => {
    if (transcript.length > 0) {
      try {
        const res = await fetch('http://localhost:4500/generate-vectors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript, videoId }),
        });
        const data = await res.json();
        if (res.status === 200) {
          setMessages([
            <div key={messages.length + 1} className="bot-message">
              {data.message}
            </div>,
          ]);
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

const UserMessage = ({ text }) => {
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
};

const BotMessage = ({ fetchMessage }) => {
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState('hi there');

  useEffect(() => {
    async function loadMessage() {
      const msg = await fetchMessage();
      setLoading(false);
      setMessage(msg);
    }
    loadMessage();
  }, [fetchMessage]);

  return (
    <div className="message-container">
      <div className="bot-message">{isLoading ? '...' : message}</div>
    </div>
  );
};

export default Bot;
