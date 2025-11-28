import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'keypad';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  size = 'md', 
  fullWidth = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-medium rounded-2xl transition-all duration-150 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background select-none";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110",
    secondary: "bg-secondary text-text border border-border hover:brightness-95",
    accent: "bg-accent text-white shadow-lg shadow-accent/20 hover:brightness-110",
    danger: "bg-red-500 text-white shadow-lg shadow-red-900/20 hover:bg-red-600",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-text",
    keypad: "bg-surface text-text shadow-sm border border-border text-2xl font-normal hover:bg-secondary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
    xl: "p-4 text-2xl h-16", // For keypad
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
