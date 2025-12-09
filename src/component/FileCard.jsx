import React from 'react';
import './FileCard.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080';

function FileCard({ file, isTeam }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!file.thumbnailUrl) return;

    const fetchTumbnail = async () => {
      try {
        const res = await axios.get(`/files/presigned`, {
          params: { key: file.thumbnailUrl },
        });
        setThumbnailUrl(res.data.url);
      } catch (e) {
        console.error('썸네일 불러오기 실패:', e);
      }
    };

    fetchTumbnail();
  }, [file.thumbnailUrl]);

  const handleReviewClick = () => {
    navigate('/select', {
      state: {
        presentationId: file.id,
        isTeam: isTeam,
      },
    });
  };

  return (
    <div className="file-card">
      <img className="thumbnail" src={thumbnailUrl} alt={file.title} />
      <div class="file-info">
        <div class="file-name">{file.title}</div>

        <div class="file-meta">
          <span>⏱ 업로드: {new Date(file.uploadedAt).toLocaleString()}</span>
          <span>18217 KB</span> {/*api 받을수 있으면 수정*/}
        </div>

        <div class="actions">
          <button class="preview-btn" onClick={handleReviewClick}>
            👁 검토하기
          </button>
          <div class="side-icons">
            <button class="icon-btn">⬇</button>
            <button class="icon-btn" title="삭제하기">
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileCard;
