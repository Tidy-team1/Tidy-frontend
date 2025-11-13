import React from 'react';
import './Upload.css';
import { useState, useRef } from 'react';

function Upload(props) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

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

  return (
    <div className="container">
      <p>검토하려는 파일을 업로드 하세요.</p>
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
          <button>개인 워크스페이스에서 검토</button>
          <button>팀 워크스페이스에서 검토</button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
