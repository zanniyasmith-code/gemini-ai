import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { evaluateExpression, createHistoryItem } from '../domain/normal';
import { HistoryItem } from '../types';

export const NormalMode: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showHistory && historyEndRef.current) {
        historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, showHistory]);

  const handleInput = (char: string) => {
    if (display === '0' && !['.', '+', '-', '*', '/', '%'].includes(char)) {
      setDisplay(char);
    } else {
      setDisplay((prev) => prev + char);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay((prev) => prev.slice(0, -1));
    }
  };

  const handleEqual = () => {
    const result = evaluateExpression(display);
    if (result !== 'Error') {
      const newItem = createHistoryItem(display, result);
      setHistory((prev) => [...prev, newItem]);
      setExpression(`${display} =`);
      setDisplay(result);
    } else {
        setExpression(`${display} =`);
        setDisplay('Error');
    }
  };

  // Keyboard support logic remains the same
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key;
        if (/[0-9.%+\-*/()]/.test(key)) {
            e.preventDefault();
            handleInput(key);
        } else if (key === 'Enter') {
            e.preventDefault();
            handleEqual();
        } else if (key === 'Backspace') {
            e.preventDefault();
            handleDelete();
        } else if (key === 'Escape') {
            e.preventDefault();
            handleClear();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  return (
    <div className="flex flex-col h-full gap-4 relative">
        {/* Main Calculation Area */}
        <div className={`flex flex-col gap-4 transition-all duration-300 ${showHistory ? 'opacity-30 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}>
            
            {/* Display Screen */}
            <div className="flex flex-col items-end justify-end p-6 bg-display rounded-3xl min-h-[160px] shadow-inner border border-border">
                <div className="text-muted text-lg font-mono mb-2 h-8 overflow-hidden">{expression}</div>
                <div className="text-5xl md:text-6xl font-bold text-text font-mono tracking-wide break-all text-right w-full">
                    {display}
                </div>
            </div>

            {/* Keypad Grid - Standard Layout */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 flex-1">
                {/* Row 1 */}
                <Button variant="danger" size="xl" onClick={handleClear}>AC</Button>
                <Button variant="keypad" size="xl" onClick={handleDelete} className="text-xl">⌫</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('%')}>%</Button>
                <Button variant="accent" size="xl" onClick={() => handleInput('/')}>÷</Button>

                {/* Row 2 */}
                <Button variant="keypad" size="xl" onClick={() => handleInput('7')}>7</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('8')}>8</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('9')}>9</Button>
                <Button variant="accent" size="xl" onClick={() => handleInput('*')}>×</Button>

                {/* Row 3 */}
                <Button variant="keypad" size="xl" onClick={() => handleInput('4')}>4</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('5')}>5</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('6')}>6</Button>
                <Button variant="accent" size="xl" onClick={() => handleInput('-')}>-</Button>

                {/* Row 4 */}
                <Button variant="keypad" size="xl" onClick={() => handleInput('1')}>1</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('2')}>2</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('3')}>3</Button>
                <Button variant="accent" size="xl" onClick={() => handleInput('+')}>+</Button>

                {/* Row 5 */}
                <Button variant="keypad" size="xl" onClick={() => handleInput('0')}>0</Button>
                <Button variant="keypad" size="xl" onClick={() => handleInput('.')}>.</Button>
                <Button variant="primary" size="xl" onClick={handleEqual} className="col-span-2 text-3xl">=</Button>
            </div>
            
            {/* Mobile History Toggle (Floating) */}
            <button 
                onClick={() => setShowHistory(true)}
                className="md:hidden absolute top-4 left-4 p-2 bg-surface/50 backdrop-blur rounded-full text-muted border border-border"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>

        {/* History Panel - Overlay on Mobile / Side Panel on Desktop */}
        <div className={`
            absolute md:static inset-0 z-20 
            md:block md:w-80 md:h-[600px]
            bg-surface md:bg-transparent rounded-3xl md:rounded-2xl 
            flex flex-col
            transition-transform duration-300 ease-in-out
            md:border md:border-border md:shadow-none
            ${showHistory ? 'translate-y-0' : 'translate-y-full md:translate-y-0 hidden md:flex'}
        `}>
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface md:bg-transparent rounded-t-3xl">
                <h3 className="font-semibold text-text">History</h3>
                <div className="flex gap-4">
                    {history.length > 0 && (
                        <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-400">Clear</button>
                    )}
                    <button onClick={() => setShowHistory(false)} className="md:hidden text-text">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface md:bg-transparent">
                {history.length === 0 ? (
                    <div className="text-muted text-center mt-10 text-sm">No calculation history</div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="group cursor-pointer hover:bg-secondary/50 p-3 rounded-xl transition-colors border border-transparent hover:border-border" onClick={() => {
                            setDisplay(item.result);
                            setShowHistory(false);
                        }}>
                            <div className="text-right text-muted text-xs font-mono mb-1">{item.expression} =</div>
                            <div className="text-right text-primary font-mono text-xl">{item.result}</div>
                        </div>
                    ))
                )}
                <div ref={historyEndRef} />
            </div>
        </div>
    </div>
  );
};
