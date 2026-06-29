import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const loaderEl = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div className="pulse-loader"></div>
      <span style={{
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: 500,
        letterSpacing: '0.05em'
      }}>
        LOADING DATA...
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-primary)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {loaderEl}
      </div>
    );
  }

  return loaderEl;
};

export default Loader;
