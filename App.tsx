
import React, { useState } from 'react';
import { AppMode } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NormalMode } from './views/NormalMode';
import { BusinessMode } from './views/BusinessMode';
import { InvestmentMode } from './views/InvestmentMode';
import { ThemeSelector } from './components/ThemeSelector';
import { LoginScreen } from './views/LoginScreen';
import { ChatbotScreen } from './views/ChatbotScreen';

type Screen = 'CALCULATOR' | 'LOGIN' | 'CHATBOT';

const AppContent: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.NORMAL);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('CALCULATOR');
  
  const { isAuthenticated } = useAuth();

  const handleAiClick = () => {
    if (isAuthenticated) {
      setCurrentScreen('CHATBOT');
    } else {
      setCurrentScreen('LOGIN');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('CHATBOT');
  };

  const handleBackToCalc = () => {
    setCurrentScreen('CALCULATOR');
  };

  // If in Calculator mode, show the standard layout
  if (currentScreen === 'CALCULATOR') {
    return (
      <div className="min-h-screen bg-background text-text transition-colors duration-300 flex flex-col font-sans">
        <ThemeSelector isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />

        <header className="sticky top-0 z-10 backdrop-blur-md bg-background/90 border-b border-border transition-colors duration-300">
          <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-mono shadow-lg shadow-primary/30">
                    ±
                </div>
                <h1 className="text-lg font-bold tracking-tight text-text">OmniCalc</h1>
            </div>
            
            <div className="flex gap-2">
                {/* AI Advisor Button */}
                <button 
                  onClick={handleAiClick}
                  className="p-2 px-3 rounded-full bg-surface border border-border hover:bg-secondary text-primary font-medium text-sm flex items-center gap-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span className="hidden sm:inline">AI Advisor</span>
                </button>

                {/* Theme Toggle */}
                <button 
                  onClick={() => setIsThemeOpen(true)}
                  className="p-2 rounded-full hover:bg-secondary text-muted hover:text-text transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
            </div>
          </div>
          
          <div className="max-w-xl mx-auto px-4 pb-3">
            <nav className="flex bg-secondary p-1 rounded-xl">
              {Object.values(AppMode).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeMode === mode
                      ? 'bg-surface text-primary shadow-sm ring-1 ring-black/5'
                      : 'text-muted hover:text-text hover:bg-surface/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col">
          <div className="flex-1 animate-in fade-in duration-300">
              {activeMode === AppMode.NORMAL && <NormalMode />}
              {activeMode === AppMode.BUSINESS && <BusinessMode />}
              {activeMode === AppMode.INVESTMENT && <InvestmentMode />}
          </div>
        </main>
      </div>
    );
  }

  // Full Screen Views (Login / Chatbot)
  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300 font-sans">
      <div className="max-w-xl mx-auto h-screen flex flex-col">
        {currentScreen === 'LOGIN' && (
          <LoginScreen onLoginSuccess={handleLoginSuccess} onBack={handleBackToCalc} />
        )}
        {currentScreen === 'CHATBOT' && (
          <ChatbotScreen onBack={handleBackToCalc} />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
