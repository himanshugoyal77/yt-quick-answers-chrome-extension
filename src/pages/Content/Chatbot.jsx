import { useEffect, useRef, useState } from 'react';
import UserMessage from './UserMessages';
import BotMessage from './BotMessages';

function Chatbot() {
  const [messages, setMessages] = useState([]);

  const send = async (text) => {
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage key={messages.length + 2} />
    );
    setMessages(newMessages);
  };

  return (
    <div className="chatbot">
      <Messages messages={messages} />
      
    </div>
  );
}

export default Chatbot;

export function Messages({ messages }) {
  const el = useRef(null);
  useEffect(() => {
    el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  });
  return (
    <div className="messages">
      {messages}
      <div id={'el'} ref={el} />
    </div>
  );
}

