
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { InputGroup } from '../components/InputGroup';
import { Button } from '../components/Button';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text">Welcome Back</h2>
          <p className="text-muted mt-2">Sign in to access AI Advisor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <InputGroup 
            label="Email" 
            value={email} 
            onChange={setEmail} 
            type="text" 
            placeholder="you@example.com"
          />
          <InputGroup 
            label="Password" 
            value={password} 
            onChange={setPassword} 
            type="text" // Using text type for demo simplicity per request, normally 'password'
            placeholder="••••••••" 
          />
          
          <div className="pt-2 flex flex-col gap-3">
            <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button 
                type="button" 
                variant="ghost" 
                fullWidth 
                onClick={onBack}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
