import React from 'react';

const Table = ({ headers, children }) => {
  return (
    <div className="custom-table-container glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="custom-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
