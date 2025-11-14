import React from 'react';
import './Upload.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function Upload() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

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
  /*const handleUpload = async (type) => {
    if (!file) {
      alert('파일을 먼저 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceType', type);

    try {
      const response = await axios.post(
        `/workspaceType/${type}/presentations`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('업로드 성공:', response.data);
    } catch (error) {
      console.error('업로드 에러:', error);
    }
  };*/

  return (
    <div className="container">
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
          <button
            /*onClick={() => handleUpload('personal')}*/ onClick={() =>
              navigate('/select')
            }
          >
            개인 워크스페이스에서 검토
          </button>
          <button
            /*onClick={() => handleUpload('team')}*/ onClick={() =>
              navigate('/select')
            }
          >
            팀 워크스페이스에서 검토
          </button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
