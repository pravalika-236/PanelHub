import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '15px', color: '#666' }}>{message}</p>
      </div>
    </div>
  );
};

export default Loader;
