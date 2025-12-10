import React from 'react';
import './TeamSpace.css';
import FileCard from './FileCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleUpload } from './Upload.jsx';
axios.defaults.baseURL = 'http://localhost:8080';

function TeamSpace() {
  const navigate = useNavigate();
  const [filesBySpace, setFilesBySpace] = useState([]); //api get 정보
  const [hoveredSpaceId, setHoveredSpaceId] = useState(null);
  const location = useLocation();
  const file = location.state?.file; //팀워크스페이스 생성에서 넘어온 경우
  const [loading, setLoading] = useState(false); //업로드 진행 상태

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const spaceRes = await axios.get(`/spaces`, {
        withCredentials: true,
      });

      const teamSpaces = spaceRes.data.filter((s) => s.type === 'TEAM');
      if (teamSpaces.length === 0) {
        setFilesBySpace([]);
        return;
      }

      let collectedFiles = [];

      for (const space of teamSpaces) {
        const detailRes = await axios.get(`/spaces/${space.id}`); //안되면 withCredentials:
        const spaceName = detailRes.data.name;
        const memberNames = (detailRes.data.members || []).map(
          (m) => m.userName
        );
        const presentations = detailRes.data.presentations || [];

        const mapped = presentations.map((p) => ({
          //presentations 정보에 space정보 합치기
          ...p,
          spaceName,
          spaceId: space.id,
        }));

        collectedFiles.push({
          spaceId: space.id,
          spaceName,
          memberNames,
          presentations: mapped,
        });
      }
      setFilesBySpace(collectedFiles);
    } catch (e) {
      console.error('팀 워크스페이스 조회 실패:', e);
    }
  };

  const totalFilesCount = filesBySpace.reduce(
    (acc, s) => acc + (s.presentations ? s.presentations.length : 0),
    0
  );

  const uploadToSpace = async (spaceId, memberNames) => {
    setLoading(true);
    try {
      await handleUpload(file, navigate, {
        isTeam: true,
        teamSpaceId: spaceId,
        memberNames: memberNames,
      });
      setLoading(false);
      alert('업로드 완료!');
      //loadFiles();
    } catch (e) {
      console.error('팀 업로드 실패:', e);
      alert('팀 업로드 중 오류가 발생했습니다.');
      return;
    }
  };

  return (
    <div className="workspace-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>파일 업로드 중입니다...</p>
        </div>
      )}

      <h2 className="workspace-title">팀 워크스페이스</h2>
      <p className="workspace-subtitle">
        팀원들과 함께 파일을 공유하고 협업하세요
      </p>

      {/* 상단 통계 카드 */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">전체 파일</div>
          <div className="stat-value">{totalFilesCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">이번 주 업로드</div>
          <div className="stat-value">{totalFilesCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">팀 수</div>
          <div className="stat-value">{filesBySpace.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">총 용량</div>
          <div className="stat-value">
            {(
              filesBySpace.reduce((a, b) => a + Number(b.size), 0) / 1024
            ).toFixed(1)}{' '}
            MB
          </div>
        </div>
      </div>

      {/* 파일 리스트 영역 */}
      <div className="file-area">
        {totalFilesCount === 0 ? (
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
            <div className="team-file-list">
              {filesBySpace.map((space) => (
                <div className="team-container" key={space.spaceId}>
                  <div
                    className="team-header"
                    onMouseEnter={() => setHoveredSpaceId(space.spaceId)}
                    onMouseLeave={() => setHoveredSpaceId(null)}
                  >
                    <div className="team-name-wrapper">
                      <div className="team-name">{space.spaceName}</div>
                      {hoveredSpaceId === space.spaceId && (
                        <div
                          className="team-tooltip"
                          onClick={() =>
                            uploadToSpace(space.spaceId, space.memberNames)
                          }
                        >
                          + {space.spaceName}에 업로드
                        </div>
                      )}
                    </div>
                    <div className="team-members">
                      {space.memberNames?.map((member, idx) => (
                        <div className="member-circle" key={idx} title={member}>
                          {member
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      ))}
                    </div>

                    <div className="team-meta">
                      {space.presentations.length}개 파일
                    </div>
                  </div>

                  <div className="team-grid">
                    {space.presentations.length === 0 ? (
                      <div className="team-empty">업로드된 파일이 없습니다</div>
                    ) : (
                      space.presentations.map((p) => (
                        <FileCard
                          key={p.id}
                          file={p}
                          isTeam={true}
                          onDelete={(deletedId) => {
                            setFilesBySpace((prev) =>
                              prev.map((space) => ({
                                ...space,
                                presentations: space.presentations.filter(
                                  (f) => f.id !== deletedId
                                ),
                              }))
                            );
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
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
