import React from 'react';
import './Upload.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

export const handleUpload = async (file, navigate, extraState = {}) => {
  if (!file) {
    alert('파일을 먼저 선택하세요.');
    return;
  }

  try {
    // 2. 사용자 정보 조회
    const meRes = await axios.get('/auth/me', { withCredentials: true });
    const personalSpaceId = meRes.data.personalSpaceId;
    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await axios.post(
      `/spaces/${personalSpaceId}/presentations`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const newPresentationId = uploadRes.data.id;
    console.log('업로드 완료');
    navigate('/select', {
      state: { presentationId: newPresentationId, ...extraState },
    });
  } catch (error) {
    console.error('백그라운드 업로드 실패:', error);
  } finally {
  }
};

function Upload() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); //로딩진행 상태
  const [presentationId, setPresentationId] = useState(null);

  const onFileSelect = () => {
    fileInputRef.current.click();
  };
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };
  const renderFilePreview = () => {
    if (!file)
      return (
        <>
          드래그하여 업로드 하세요.
          <img src="/upload.png" />
        </>
      );
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          style={{ maxWidth: '100%', maxHeight: '150px' }}
        />
      );
    }
    return (
      <div className="uploaded-file">
        <span>{file.name}</span>
        <button className="remove-btn" onClick={handleRemoveFile}>
          X
        </button>
      </div>
    );
  };
  const handleRemoveFile = () => {
    setFile(null);
    fileInputRef.current.value = '';
  };

  const handlePersonal = async () => {
    setLoading(true);
    await handleUpload(file, navigate);
    setLoading(false);
  };
  const handleTeam = () => {
    navigate('/createTeam', { state: { file } });
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>파일 업로드 중입니다...</p>
        </div>
      )}

      <p className="uploadP">검토하려는 파일을 업로드 하세요.</p>
      <button className="fileSelect" onClick={onFileSelect}>
        + 파일 선택하기
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <div className="loadContainer">
        <div
          className="dragLoad"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {renderFilePreview()}
        </div>
        <div className="buttonContainer">
          <button onClick={handlePersonal}>개인 워크스페이스에서 검토</button>
          <button onClick={handleTeam}>팀 워크스페이스에서 검토</button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
