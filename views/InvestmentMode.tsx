import React, { useState } from 'react';
import { InvestmentSubMode } from '../types';
import { InputGroup } from '../components/InputGroup';
import { ResultCard } from '../components/ResultCard';
import { calculateLumpsum, calculateSIP, calculateSIPGoal, calculateInflationImpact, calculateSipYearlyGrowth, calculateLumpsumYearlyGrowth } from '../domain/investment';
import { EmiPieChart, GrowthChart } from '../components/AppCharts'; // Reuse pie and area charts
import { useTheme } from '../context/ThemeContext';

export const InvestmentMode: React.FC = () => {
  const { theme } = useTheme();
  const [subMode, setSubMode] = useState<InvestmentSubMode>(InvestmentSubMode.LUMPSUM);

  // Lumpsum State
  const [lumpP, setLumpP] = useState('');
  const [lumpR, setLumpR] = useState('');
  const [lumpT, setLumpT] = useState('');

  // SIP State
  const [sipAmount, setSipAmount] = useState('');
  const [sipR, setSipR] = useState('');
  const [sipT, setSipT] = useState('');

  // Goal State
  const [goalAmount, setGoalAmount] = useState('');
  const [goalR, setGoalR] = useState('');
  const [goalT, setGoalT] = useState('');
  const [inflation, setInflation] = useState('');

  const renderLumpsum = () => {
    const p = parseFloat(lumpP) || 0;
    const r = parseFloat(lumpR) || 0;
    const t = parseFloat(lumpT) || 0;
    const { maturityValue, totalInterest } = calculateLumpsum(p, r, t);
    const yearlyData = calculateLumpsumYearlyGrowth(p, r, t);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Investment Amount" value={lumpP} onChange={setLumpP} prefix="$" />
            <InputGroup label="Annual Rate" value={lumpR} onChange={setLumpR} suffix="%" />
            <InputGroup label="Time Period" value={lumpT} onChange={setLumpT} suffix="yr" />
        </div>
        
        {p > 0 && t > 0 && (
            <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3">
                    <EmiPieChart principal={p} interest={totalInterest} />
                </div>
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{background: theme.colors.primary}}></div>
                        <div className="text-sm text-muted">Invested: <span className="text-text font-mono">${p.toLocaleString()}</span></div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{background: theme.colors.accent}}></div>
                        <div className="text-sm text-muted">Gain: <span className="text-text font-mono">${Math.round(totalInterest).toLocaleString()}</span></div>
                     </div>
                     <div className="col-span-1 sm:col-span-2 pt-2 border-t border-border">
                        <ResultCard label="Maturity Value" value={`$${Math.round(maturityValue).toLocaleString()}`} highlight />
                     </div>
                </div>
            </div>
        )}
        
        {/* Growth Chart */}
        {yearlyData.length > 0 && (
            <div className="bg-surface p-4 rounded-2xl border border-border">
                 <h4 className="text-sm font-medium text-muted mb-4 ml-2">Growth Over Time</h4>
                 <GrowthChart 
                    data={yearlyData} 
                    dataKeys={[
                        { key: 'principal', color: theme.colors.primary, name: 'Principal' },
                        { key: 'interest', color: theme.colors.accent, name: 'Interest' }
                    ]} 
                 />
            </div>
        )}
      </div>
    );
  };

  const renderSIP = () => {
    const p = parseFloat(sipAmount) || 0;
    const r = parseFloat(sipR) || 0;
    const t = parseFloat(sipT) || 0;
    const { maturityValue, investedAmount, totalGain } = calculateSIP(p, r, t);
    const yearlyData = calculateSipYearlyGrowth(p, r, t);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup label="Monthly Investment" value={sipAmount} onChange={setSipAmount} prefix="$" />
                <InputGroup label="Expected Return" value={sipR} onChange={setSipR} suffix="%" />
                <InputGroup label="Time Period" value={sipT} onChange={setSipT} suffix="yr" />
            </div>

            {p > 0 && t > 0 && (
                <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/3">
                        <EmiPieChart principal={investedAmount} interest={totalGain} />
                    </div>
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{background: theme.colors.primary}}></div>
                            <div className="text-sm text-muted">Invested: <span className="text-text font-mono">${investedAmount.toLocaleString()}</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{background: theme.colors.accent}}></div>
                            <div className="text-sm text-muted">Gain: <span className="text-text font-mono">${Math.round(totalGain).toLocaleString()}</span></div>
                        </div>
                        <div className="col-span-1 sm:col-span-2 pt-2 border-t border-border">
                            <ResultCard label="Maturity Value" value={`$${Math.round(maturityValue).toLocaleString()}`} highlight />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Growth Chart */}
            {yearlyData.length > 0 && (
                <div className="bg-surface p-4 rounded-2xl border border-border">
                     <h4 className="text-sm font-medium text-muted mb-4 ml-2">SIP Growth Projection</h4>
                     <GrowthChart 
                        data={yearlyData} 
                        dataKeys={[
                            { key: 'invested', color: theme.colors.primary, name: 'Invested' },
                            { key: 'gain', color: theme.colors.accent, name: 'Gains' }
                        ]} 
                     />
                </div>
            )}
        </div>
    );
  };

  const renderGoal = () => {
    const target = parseFloat(goalAmount) || 0;
    const r = parseFloat(goalR) || 0;
    const t = parseFloat(goalT) || 0;
    const inf = parseFloat(inflation) || 0;

    const inflationAdjustedTarget = inf > 0 ? calculateInflationImpact(target, inf, t) : target;
    const requiredSIP = calculateSIPGoal(inflationAdjustedTarget, r, t);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputGroup label="Target Amount" value={goalAmount} onChange={setGoalAmount} prefix="$" />
                <InputGroup label="Expected Return" value={goalR} onChange={setGoalR} suffix="%" />
                <InputGroup label="Time Period" value={goalT} onChange={setGoalT} suffix="yr" />
                <InputGroup label="Inflation (Optional)" value={inflation} onChange={setInflation} suffix="%" placeholder="0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface p-6 rounded-2xl border border-border">
                    <h4 className="text-muted text-sm mb-4">Required Monthly SIP</h4>
                    <div className="text-3xl font-bold text-primary">${Math.round(requiredSIP).toLocaleString()}</div>
                    <p className="text-xs text-muted mt-2">To reach your goal in {t || 0} years.</p>
                </div>
                {inf > 0 && (
                     <div className="bg-surface p-6 rounded-2xl border border-border">
                        <h4 className="text-muted text-sm mb-4">Inflation Adjusted Goal</h4>
                        <div className="text-3xl font-bold text-accent">${Math.round(inflationAdjustedTarget).toLocaleString()}</div>
                        <p className="text-xs text-muted mt-2">Value of ${target.toLocaleString()} after {t} years at {inf}% inflation.</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
       <div className="flex gap-2 overflow-x-auto pb-4 mb-2 border-b border-border no-scrollbar">
        {Object.values(InvestmentSubMode).map((mode) => (
            <button
                key={mode}
                onClick={() => setSubMode(mode)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    subMode === mode 
                    ? 'bg-secondary text-primary border border-primary/20' 
                    : 'text-muted hover:text-text hover:bg-surface'
                }`}
            >
                {mode}
            </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {subMode === InvestmentSubMode.LUMPSUM && renderLumpsum()}
        {subMode === InvestmentSubMode.SIP_FV && renderSIP()}
        {subMode === InvestmentSubMode.SIP_GOAL && renderGoal()}
      </div>
    </div>
  );
};