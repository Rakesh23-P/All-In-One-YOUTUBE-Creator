import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark'; // Default to dark mode for rich glassmorphism aesthetics
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.75)');
      root.style.setProperty('--glass-border', 'rgba(15, 23, 42, 0.08)');
      root.style.setProperty('--glass-shadow', 'rgba(15, 23, 42, 0.05)');
    } else {
      root.style.setProperty('--bg-primary', '#080b11');
      root.style.setProperty('--bg-secondary', '#0f1524');
      root.style.setProperty('--bg-tertiary', '#172036');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.65)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.4)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
