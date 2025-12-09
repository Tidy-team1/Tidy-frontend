import React from 'react';
import './TeamSpace.css';
import FileCard from './FileCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
axios.defaults.baseURL = 'http://localhost:8080';

function TeamSpace() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await axios.get('/spaces/personal');
      const presentations = res.data.presentations || [];

      //업로드 시간 파일과 merge
      const merged = presentations.map((p) => {
        const uploadedAt = localStorage.getItem(`uploaded_${p.id}`);

        return {
          ...p,
          uploadedAt: uploadedAt || '이전 사용 기록',
        };
      });

      setFiles(merged);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="workspace-container">
      <h2 className="workspace-title">팀 워크스페이스</h2>
      <p className="workspace-subtitle">
        팀원들과 함께 파일을 공유하고 협업하세요
      </p>

      {/* 상단 통계 카드 */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">전체 파일</div>
          <div className="stat-value">{files.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">이번 주 업로드</div>
          <div className="stat-value">{files.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">팀 수</div>
          <div className="stat-value">{files.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">총 용량</div>
          <div className="stat-value">
            {(files.reduce((a, b) => a + Number(b.size), 0) / 1024).toFixed(1)}{' '}
            MB
          </div>
        </div>
      </div>

      {/* 파일 리스트 영역 */}
      <div className="file-area">
        {files.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon">📄</div>
            <p className="empty-title">아직 업로드된 파일이 없습니다</p>
            <p className="empty-text">홈 화면에서 파일을 업로드해보세요</p>

            <button className="upload-btn" onClick={() => navigate('/')}>
              파일 업로드하기
            </button>
          </div>
        ) : (
          <>
            <div className="file-list">
              {/*최신순 정렬 */}
              {[...files].reverse().map((f) => (
                <FileCard key={f.id} file={f} isTeam={true} />
              ))}
            </div>
            <div className="empty-box">
              <div className="empty-icon">📄</div>
              <p className="empty-title">홈 화면에서 파일을 업로드해보세요</p>

              <button className="upload-btn" onClick={() => navigate('/')}>
                파일 업로드하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TeamSpace;
