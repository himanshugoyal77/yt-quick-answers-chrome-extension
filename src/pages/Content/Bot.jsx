import React, { useEffect, useRef, useState } from 'react';
import './content.styles.css';

const Bot = () => {
  const inputRef = useRef();
  const el = useRef(null);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  });

  const handleSend = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    const newMsg = messages.concat(
      <UserMsg key={messages.length + 1} text={inputRef.current.value} />
    );
    setMessages(newMsg);
  };

  console.log('bot 44');
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
