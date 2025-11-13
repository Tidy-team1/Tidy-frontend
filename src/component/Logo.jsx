import React from 'react';
import './Logo.css';

function Logo(props) {
  return (
    <div className="container">
      <img src="/tidyLogo.png" alt="로고" />
      <p className="catchpri">
        <b>발표 전 한 끗 차이</b>
      </p>
    </div>
  );
}

export default Logo;
