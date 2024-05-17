import React from 'react';
window.React = React;

function UserMessage({ text }) {
  return (
    <div className="message-container">
      <div className="user-message">{text}</div>
    </div>
  );
}

export default UserMessage;
