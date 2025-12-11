import React, { useState, useEffect } from 'react';
import './ChatSidebar.css';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

function ChatSidebar({
  open,
  onClose,
  selectedSlide,
  selectedFeedbackId,
  presentationId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!open) return;
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `/presentations/${presentationId}/comments`
        );
        console.log('코멘트 응답:', res.status);
        console.log(res.data);
      } catch (err) {
        console.error('코멘트 get 실패:', err);
      }
    };
    fetchComments();
  }, [open]);

  useEffect(() => {
    if (open && selectedFeedbackId !== null) {
      // 실제 구현 시: selectedFeedbackId와 연결된 서버의 대화 내용을 불러와야 합니다.
      setMessages([
        {
          text: `슬라이드 ${selectedSlide}의 피드백 (${selectedFeedbackId})`,
          sender: 'system',
        },
        {
          text: '이 부분 디자인 수정해야 할까요?',
          sender: 'me',
          feedbackId: selectedFeedbackId,
        },
        {
          text: '네, 텍스트 크기를 좀 더 키워봅시다. 폰트는 이걸로 유지할까요?',
          sender: 'team',
          feedbackId: selectedFeedbackId,
        },
      ]);
    } else {
      setMessages([]); // 사이드바가 닫히거나 피드백이 선택되지 않으면 메시지 초기화
    }
  }, [open, selectedFeedbackId, selectedSlide]); // 의존성 배열에 추가

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        text: input,
        sender: 'me',
        slideIndex: selectedSlide,
        feedbackId: selectedFeedbackId,
      },
    ]);
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
