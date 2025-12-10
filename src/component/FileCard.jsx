import React from 'react';
import './FileCard.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:8080';

function FileCard({ file, isTeam, onDelete }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [fileInfo, setFileInfo] = useState({}); // 업로드 시간과 파일 사이즈 저장
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

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const res = await axios.get(`/presentations/${file.id}`);
        setFileInfo({
          uploadedAt: res.data.createdAt,
          fileSize: res.data.fileSize,
        });
      } catch (e) {
        console.error('파일 정보 가져오기 실패:', e);
      }
    };
    fetchFileInfo();
  }, [file.id]);

  const handleReviewClick = () => {
    navigate('/select', {
      state: {
        presentationId: file.id,
        isTeam: isTeam,
      },
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('파일을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/presentations/${file.id}`);
      if (onDelete) onDelete(file.id);
    } catch (e) {
      console.error('삭제 실패:', e);
    }
  };

  return (
    <div className="file-card">
      <img className="thumbnail" src={thumbnailUrl} alt={file.title} />
      <div class="file-info">
        <div class="file-name">{file.title}</div>

        <div class="file-meta">
          <span>
            ⏱ 업로드:{' '}
            {fileInfo.uploadedAt
              ? new Date(fileInfo.uploadedAt).toLocaleString()
              : '-'}
          </span>
          <span>{fileInfo.fileSize || '-'}</span>
        </div>

        <div class="actions">
          <button class="preview-btn" onClick={handleReviewClick}>
            👁 검토하기
          </button>
          <div class="side-icons">
            <button class="icon-btn">⬇</button>
            <button class="icon-btn" title="삭제하기" onClick={handleDelete}>
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileCard;
