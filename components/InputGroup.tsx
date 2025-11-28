import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  type?: 'number' | 'text';
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  prefix,
  suffix
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted ml-1">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-muted select-none">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full bg-surface border border-border rounded-xl py-3.5
            text-text placeholder-muted/50 font-mono text-lg
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary 
            transition-colors 
            ${prefix ? 'pl-8' : 'pl-4'} 
            ${suffix ? 'pr-10' : 'pr-4'}
          `}
        />
        {suffix && <span className="absolute right-3 text-muted select-none">{suffix}</span>}
      </div>
    </div>
  );
};
