import React from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, subValue, highlight = false }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-colors duration-300 ${highlight ? 'bg-primary/10 border-primary/50' : 'bg-surface border-border'}`}>
      <div className="text-sm font-medium text-muted mb-1">{label}</div>
      <div className={`text-2xl md:text-3xl font-bold tracking-tight ${highlight ? 'text-primary' : 'text-text'}`}>
        {value}
      </div>
      {subValue && (
        <div className="text-sm text-muted mt-1 opacity-80">{subValue}</div>
      )}
    </div>
  );
};
