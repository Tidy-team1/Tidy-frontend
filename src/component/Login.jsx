import React from 'react';
import './Login.css';

function Login({ onClose, onLoginSuccess }) {
  const naverLogin = () => {
    window.location.href = 'http://localhost:8080/auth/login/naver';
  };

  const googleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/login/google';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 방지
      >
        <h2 style={{ textAlign: 'center', color: '#545454ff' }}>
          간편 로그인{' '}
          <button className="close" onClick={onClose}>
            X
          </button>
        </h2>

        <button onClick={naverLogin}>
          <b>네이버</b>로 로그인
        </button>
        <button onClick={googleLogin}>
          <b>Google</b>로 로그인
        </button>
        <button>
          <b>이메일</b>로 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
