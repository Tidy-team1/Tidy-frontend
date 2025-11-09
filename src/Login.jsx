import React from 'react';
import './Login.css';

function Login({ onClose }) {
  //login 컴포넌트에서는 onclose판단 (닫기 버튼에서)
  const naverLogin = () => {
    window.location.href =
      'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&state=RANDOM_STATE';
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
        {/*<input type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />*/}
        <button onClick={naverLogin}>
          <b>네이버</b>로 로그인
        </button>
        <button>
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
