import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { sendMessageToGemini, ChatMessage } from '../ai/GoogleAIService';

interface ChatbotScreenProps {
  onBack: () => void;
}

interface UIMessage extends ChatMessage {
  id: string;
}

const QUICK_ACTIONS = [
  "Improve profit margins",
  "SIP vs Lumpsum",
  "Calculate break-even",
  "Investment risk advice"
];

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello ${user?.name || 'there'}! I'm your Business & Investment Advisor. How can I help you optimize your finances today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim() || isLoading) return;

    const userMsg: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Create history array carefully
      const historyForApi: ChatMessage[] = messages.map(m => ({ 
        role: m.role, 
        text: m.text || ''
      }));
      
      const responseText = await sendMessageToGemini(historyForApi, text);
      
      const aiMsg: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I'm having trouble connecting right now. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 animate-in fade-in duration-300 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-border shrink-0">
        <div>
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <span className="text-2xl">🤖</span> AI Advisor
            </h2>
            <p className="text-xs text-muted">Powered by Gemini 1.5 Pro</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={logout} className="text-xs">Logout</Button>
            <Button variant="secondary" size="sm" onClick={onBack}>Close</Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`
                  max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${isUser 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-surface border border-border text-text rounded-bl-none shadow-sm'
                  }
                `}
                style={isUser ? { backgroundColor: theme.colors.primary } : {}}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-muted/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-muted/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-muted/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (only if few messages) */}
      {messages.length < 3 && !isLoading && (
        <div className="flex gap-2 overflow-x-auto pb-4 shrink-0 no-scrollbar">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-muted hover:bg-secondary hover:text-primary transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="shrink-0 bg-surface border border-border rounded-2xl p-2 flex items-end gap-2 shadow-lg">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about pricing, investment, or strategy..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-text placeholder-muted resize-none max-h-32 min-h-[44px] py-2.5 px-3 text-sm"
          rows={1}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className={`
            p-2.5 rounded-xl transition-all duration-200
            ${!inputText.trim() || isLoading 
              ? 'bg-secondary text-muted cursor-not-allowed' 
              : 'bg-primary text-white hover:brightness-110 active:scale-95 shadow-md'
            }
          `}
          style={inputText.trim() && !isLoading ? { backgroundColor: theme.colors.primary } : {}}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};