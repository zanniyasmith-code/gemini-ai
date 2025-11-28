import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppTheme, ThemeName } from '../types';
import { THEMES } from '../theme/definitions';

interface ThemeContextType {
  theme: AppTheme;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or default to 'normal'
  const [activeTheme, setActiveTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('omnicalc_theme');
    return (saved as ThemeName) || 'normal';
  });

  const theme = THEMES[activeTheme] || THEMES.normal;

  useEffect(() => {
    localStorage.setItem('omnicalc_theme', activeTheme);
    
    // Inject CSS variables into the root element
    const root = document.documentElement;
    const colors = theme.colors;

    root.style.setProperty('--color-bg', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-muted', colors.muted);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-display', colors.display);
    root.style.setProperty('--color-danger', colors.danger);
    
    // Set meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.background);
    }
  }, [activeTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeName: setActiveTheme }}>
      <div className={theme.isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};