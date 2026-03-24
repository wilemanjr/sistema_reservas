import React from 'react';
import { useTheme } from '../../themes/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { themeType, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: themeType === 'dark' ? '#374151' : '#f3f4f6',
        color: themeType === 'dark' ? '#fbbf24' : '#0ea5e9'
      }}
    >
      {themeType === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;