import React from 'react';
import './topbar.css';
import { useState } from 'react';
import { useEffect } from 'react';

function Topbar({ onLoginClick }) {
  //Topbar컴포넌트에서는 onLoginClick판단
  const [isLogIn, setIsLogIn] = useState(false);
  const [userName, setUserName] = useState('');

  //페이지 로드 시 /me API로 로그인 여부 확인
  useEffect(() => {
    fetch('http://localhost:8080/auth/me', {
      credentials: 'include',
    })
      .then((res) => {
        console.log('응답 상태:', res.status);
        if (!res.ok) throw new Error('로그인 안됨');
        return res.json();
      })
      .then((data) => {
        console.log('받아온 데이터:', data);
        setIsLogIn(true);
        setUserName(data.name);
      })
      .catch((err) => {
        console.log('로그인 안됨:', err);
        setIsLogIn(false);
        setUserName('');
      });
  }, []);

  const logout = () => {
    setIsLogIn(false);
    setUserName('');
  };

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
        <li className="profile">
          {isLogIn ? (
            <>
              <div className="userName">
                <span className="userName" style={{ marginRight: '10px' }}>
                  {userName}님
                </span>
              </div>
              <a onClick={logout} style={{ cursor: 'pointer' }}>
                로그아웃
              </a>
            </>
          ) : (
            <a onClick={onLoginClick} style={{ cursor: 'pointer' }}>
              로그인
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Topbar;
