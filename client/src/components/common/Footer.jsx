import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      fontSize: '14px',
      zIndex: 1000
    }}>
      © PanelHub
    </footer>
  );
};

export default Footer;
