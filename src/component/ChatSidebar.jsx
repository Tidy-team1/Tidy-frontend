import React, { useState, useEffect } from 'react';
import './ChatSidebar.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

function ChatSidebar({
  open,
  onClose,
  selectedSlide,
  selectedSlideId,
  selectedFeedbackId,
  presentationId,
  onSelectCommentSlide,
  onSelectCommentFeedback,
  slideList,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`/auth/me`);
        console.log(res.data.id);
        setUserId(res.data.id);
      } catch (err) {
        console.error('userId get 실패:', err);
      }
    };

    fetchUserId();
  }, [open]);

  const fetchComments = async () => {
    if (!open) return;
    try {
      const res = await axios.get(`/presentations/${presentationId}/comments`);
      console.log('코멘트 응답:', res.data);

      const converted = res.data.map((c) => ({
        id: c.id,
        text: c.content,
        sender: c.userId === userId ? 'me' : 'team',
        slideId: c.slideId,
        userName: c.userName,
        createdAt: c.createdAt,
        feedbackIds: c.feedbackIds,
      }));
      setMessages(converted);
    } catch (err) {
      console.error('코멘트 get 실패:', err);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchComments();
  }, [open, userId, presentationId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const payload = {
      content: input,
      feedbackIds: selectedFeedbackId ? [selectedFeedbackId] : [],
    };

    try {
      console.log(selectedSlideId);
      const res = await axios.post(
        `/slides/${selectedSlideId}/comments`,
        payload
      );
      console.log(`코멘트post 응답:`, res.data);

      const newComment = {
        id: res.data.id,
        text: res.data.content,
        sender: 'me',
        slideId: res.data.slideId,
        userName: res.data.userName,
        createdAt: res.data.createdAt,
        feedbackIds: res.data.feedbackIds,
      };

      setMessages((prev) => [...prev, newComment]);
      setInput('');

      await fetchComments();
    } catch (err) {
      console.error('코멘트 post 실패:', err);
    }
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
          <div
            key={i}
            className={`chat-msg ${msg.sender}`}
            style={{ cursor: msg.slideId ? 'pointer' : 'default' }}
            onClick={() => {
              if (msg.slideId) {
                const target = slideList.find((s) => s.id === msg.slideId); //slideId로 slideIndex 찾기
                console.log(`코멘트 슬라이드:`, msg.slideId);
                onSelectCommentSlide(target.slideIndex);

                if (msg.feedbackIds && msg.feedbackIds.length > 0) {
                  onSelectCommentFeedback(msg.feedbackIds[0]);
                }
              }
            }}
          >
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button className="send-btn" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatSidebar;
