import React from 'react';
import './CreateTeam.css';

function CreateTeam(props) {
  return (
    <div className="CreateTeamPage">
      <div className="titleContainer">
        <span> 팀 워크스페이스 생성</span>
        <button>기존 팀 워크스페이스 선택</button>
      </div>
      <div className="teamCreateContainer">
        <div className="addedMember">
          <p>추가된 멤버</p>
          <p>👤 이메일</p>
        </div>
        <div className="inviteContainer">
          <p>이메일로 초대</p>
          <div>
            <input type="email" placeholder="user@example.com"></input>
            <button>초대</button>
          </div>
          <p>링크로 초대</p>
          <div>
            <span>tidy/server 주소.....</span>
            <button>복사</button>
          </div>
        </div>
      </div>
      <button className="createBtn">생성</button>
    </div>
  );
}

export default CreateTeam;
