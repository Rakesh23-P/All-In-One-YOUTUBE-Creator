import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ value, onChange, placeholder = 'Search...', onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      maxWidth: '350px'
    }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: '1rem',
          height: '42px',
          background: 'rgba(15, 21, 36, 0.6)',
          border: '1px solid var(--glass-border)',
          borderRadius: '10px',
        }}
      />
      <span style={{
        position: 'absolute',
        left: '1rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        <FaSearch />
      </span>
    </form>
  );
};

export default SearchBar;
