// Loading.jsx
import React from 'react';
import './Loading.css';

const Loading = ({ isLoading }) => {
  return (
    <div className={`fundo-loading ${isLoading ? 'visible' : 'hidden'}`}>
      <div className={`loader ${isLoading ? 'visible' : 'hidden'}`}></div>
    </div>
  );
};

export default Loading;