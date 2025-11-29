import React, { useState } from 'react';
import './ChatSidebar.css';

function ChatSidebar({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'me' }]);
    setInput('');
  };

  return (
    <div className={`chat-sidebar ${open ? 'open' : ''}`}>
      <div className="chat-header">
        <button
          className="close-btn"
          onClick={() => {
            onClose();
            open = false;
          }}
        >
          x
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.sender}`}>
            <div className="chatContent">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder="코멘트 입력…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-btn" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatSidebar;
