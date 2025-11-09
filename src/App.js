import './App.css';
import { useState } from 'react';
import Topbar from './Component.jsx';
import Login from './Login.jsx';

function App() {
  let post = '불러온 API 저장';
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app">
      <Topbar onLoginClick={() => setShowLogin(true)} />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}{' '}
      {/*showLogin && <Login/>은 showLogin이 true일 때 <Login/>을 띄운다는 걸 의미*/}
      <img src="/tidyLogo.png" alt="로고" />
      <p className="catchpri">
        <b>발표 전 한 끗 차이</b>
      </p>
      <p>검토하려는 파일을 업로드 하세요.</p>
      <button className="fileSelect">+ 파일 선택하기</button>
      <div className="loadContainer">
        <div className="dragLoad">
          드래그하여 업로드 하세요.
          <img src="/upload.png" />
        </div>
        <div className="buttonContainer">
          <button>개인 워크스페이스로 업로드</button>
          <button>팀 워크스페이스로 업로드</button>
        </div>
      </div>
    </div>
  );
}

export default App;
