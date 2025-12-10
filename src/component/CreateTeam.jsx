import React from 'react';
import './CreateTeam.css';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleUpload } from './Upload.jsx';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

function CreateTeam(props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.file;

  const handleInvite = () => {
    /////이거 지우고 밑에 함수
    if (email.trim() === '') return;
    setInvitedMembers([...invitedMembers, email]);
    setEmail(''); //입력창 초기화
  };

  const handleCreate = async () => {
    if (!file) return alert('업로드할 파일이 없습니다.');
    if (!name.trim()) return alert('팀 이름을 입력하세요.');

    setLoading(true);

    try {
      const memberList = invitedMembers.map((email) => ({
        email: email,
        role: 'MEMBER',
      }));
      const teamRes = await axios.post(`/spaces/team-with-members`, {
        name: name,
        members: memberList,
      });

      console.log('팀 생성 성공:', teamRes.data);
      const teamSpaceId = teamRes.data.spaceId;
      const memberNames = teamRes.data.invitedMembers.map((m) => m.name);

      await handleUpload(file, navigate, {
        isTeam: true,
        teamSpaceId: teamSpaceId,
        memberNames: memberNames,
      });
    } catch (err) {
      console.error(err);
      alert('팀 생성에 실패했습니다.');
    }
    setLoading(false);
    alert('팀 생성되었습니다!');
  };

  return (
    <div className="CreateTeamPage">
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>파일 업로드 중입니다...</p>
        </div>
      )}

      <div className="titleContainer">
        <span> 팀 워크스페이스 생성</span>
        <button
          onClick={() => navigate('/TeamSpace', { state: { file: file } })}
        >
          기존 팀 워크스페이스 선택
        </button>
      </div>
      <div className="teamCreateContainer">
        <div className="addedMember">
          <p>팀 이름</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <p>요청된 멤버</p>
          {invitedMembers.map((member, index) => (
            <p key={index} className="memberItem">
              👤 {member} {/* 대신 {member.name} ({member.email}) */}
            </p>
          ))}
        </div>
        <div className="inviteContainer">
          <p>이메일로 초대</p>
          <div>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <button onClick={handleInvite}>초대</button>
          </div>
          <p>링크로 초대</p>
          <div>
            <span>tidy/server 주소.....</span>
            <button>복사</button>
          </div>
        </div>
      </div>
      <button className="createBtn" onClick={handleCreate}>
        생성
      </button>
    </div>
  );
}

export default CreateTeam;
