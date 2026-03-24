import React, { createContext, useContext, useState, useEffect } from 'react';
import { LightThemeFactory, DarkThemeFactory } from './ThemeFactory';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [themeType, setThemeType] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    return saved || 'light';
  });

  const theme = themeType === 'light' ? new LightThemeFactory() : new DarkThemeFactory();

  const setTheme = (type) => {
    setThemeType(type);
    localStorage.setItem('app_theme', type);
  };

  const toggleTheme = () => {
    setTheme(themeType === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};