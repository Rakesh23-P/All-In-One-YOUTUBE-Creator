import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      borderTop: '1px solid var(--glass-border)',
      background: 'rgba(8, 11, 17, 0.4)',
      backdropFilter: 'blur(5px)',
      marginTop: 'auto'
    }}>
      <p>&copy; {new Date().getFullYear()} All-In-One YouTube Creator Management System.</p>
    </footer>
  );
};

export default Footer;
