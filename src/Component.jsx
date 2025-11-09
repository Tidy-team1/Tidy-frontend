import React from 'react';
import './Component.css';

function Topbar({ onLoginClick }) {
  //Topbar컴포넌트에서는 onLoginClick판단
  return (
    <nav>
      <ul className="nav-container">
        <li className="nav-item">
          <a href="">HOME</a>
        </li>
        <li className="nav-item">
          <a href="">개인 워크스페이스</a>
          <ul className="submenu">
            <li className="list">
              <a href=""></a>
              <div></div>
            </li>
            <li className="all">
              <a href="">모두 보기</a>
            </li>
            <li className="new">
              <a
                href="https://docs.google.com/presentation/u/0/"
                target="_blank"
                rel="noreferrer"
              >
                + 새 프로젝트 생성
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a href="">팀 워크스페이스</a>
          <ul className="submenu">
            <li className="list">
              <a href=""></a>
            </li>
            <li className="all">
              <a href="">모두 보기</a>
            </li>
            <li className="new">
              <a href="">+ 팀 프로젝트 생성</a>
            </li>
          </ul>
        </li>
        <li className="nav-item profile">
          <a onClick={onLoginClick} style={{ cursor: 'pointer' }}>
            로그인
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Topbar;
