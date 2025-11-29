import React from 'react';
import './ChatIcon.css';

function ChatIcon({ onClick }) {
  return (
    <div className="chatIcon" onClick={onClick}>
      💬
    </div>
  );
}

export default ChatIcon;
