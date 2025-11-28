import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../theme/definitions';
import { AppTheme } from '../types';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { theme: activeTheme, setThemeName } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-surface w-full max-w-2xl rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-text">Select Theme</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary text-text">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(THEMES).map((t: AppTheme) => (
            <button
              key={t.name}
              onClick={() => setThemeName(t.name)}
              className={`
                relative flex items-center p-4 rounded-xl border-2 text-left transition-all
                ${activeTheme.name === t.name 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border hover:border-muted/50 bg-transparent'}
              `}
            >
              <div className="flex-1">
                <div className="font-bold text-lg flex items-center gap-2" style={{ color: t.isDark ? '#FFF' : '#000' }}>
                    <span className={`px-2 py-0.5 rounded text-sm ${t.isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'}`}>
                        {t.label}
                    </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{t.description}</div>
              </div>

              {/* Color Preview Strip */}
              <div className="flex flex-col gap-1 ml-4 p-1 bg-white/10 rounded-lg">
                <div className="flex gap-1">
                   <div className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10" style={{ backgroundColor: t.colors.background }} title="Background"></div>
                   <div className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10" style={{ backgroundColor: t.colors.surface }} title="Surface"></div>
                </div>
                <div className="flex gap-1">
                   <div className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10" style={{ backgroundColor: t.colors.primary }} title="Primary"></div>
                   <div className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10" style={{ backgroundColor: t.colors.accent }} title="Accent"></div>
                </div>
              </div>

              {/* Checkmark */}
              {activeTheme.name === t.name && (
                <div className="absolute top-0 right-0 p-1">
                    <div className="bg-primary text-white rounded-bl-lg rounded-tr-lg p-1 shadow-sm">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/30 active:scale-95 transition-transform"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};