import React, { useState } from 'react';
import { BusinessSubMode } from '../types';
import { InputGroup } from '../components/InputGroup';
import { ResultCard } from '../components/ResultCard';
import { calculatePriceFromMargin, calculatePriceFromMarkup, calculateFinalPrice, calculateEMI, calculateAmortization } from '../domain/business';
import { ProfitBarChart, EmiPieChart, GrowthChart } from '../components/AppCharts';
import { useTheme } from '../context/ThemeContext';

export const BusinessMode: React.FC = () => {
  const { theme } = useTheme();
  const [subMode, setSubMode] = useState<BusinessSubMode>(BusinessSubMode.PRICING);

  // Pricing State
  const [cost, setCost] = useState('');
  const [percentage, setPercentage] = useState(''); // Used for margin or markup
  const [isMargin, setIsMargin] = useState(true);

  // Discount/Tax State
  const [basePrice, setBasePrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');

  // EMI State
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');

  const renderPricing = () => {
    const costVal = parseFloat(cost) || 0;
    const percentVal = parseFloat(percentage) || 0;
    const result = isMargin 
        ? calculatePriceFromMargin(costVal, percentVal) 
        : calculatePriceFromMarkup(costVal, percentVal);
    const profit = result - costVal;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex bg-surface border border-border p-1 rounded-xl w-fit">
            <button 
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isMargin ? 'bg-primary text-white shadow' : 'text-muted hover:text-text'}`}
                onClick={() => setIsMargin(true)}
            >
                Margin
            </button>
            <button 
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!isMargin ? 'bg-primary text-white shadow' : 'text-muted hover:text-text'}`}
                onClick={() => setIsMargin(false)}
            >
                Markup
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Cost Price" value={cost} onChange={setCost} prefix="$" placeholder="0.00" />
            <InputGroup label={isMargin ? "Margin %" : "Markup %"} value={percentage} onChange={setPercentage} suffix="%" placeholder="0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <ResultCard label="Selling Price" value={`$${result.toFixed(2)}`} highlight />
            <ResultCard label="Profit" value={`$${profit.toFixed(2)}`} subValue={`${percentVal}% ${isMargin ? 'Margin' : 'Markup'}`} />
        </div>
        
        {/* Profit Visualization */}
        {costVal > 0 && (
            <div className="mt-6 bg-surface p-4 rounded-2xl border border-border">
                <h4 className="text-sm font-medium text-muted mb-4 ml-2">Profit Breakdown</h4>
                <ProfitBarChart cost={costVal} price={result} profit={profit} />
            </div>
        )}
      </div>
    );
  };

  const renderDiscountTax = () => {
    const p = parseFloat(basePrice) || 0;
    const d = parseFloat(discount) || 0;
    const t = parseFloat(tax) || 0;
    const { finalPrice, discountAmount, taxAmount } = calculateFinalPrice(p, d, t);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup label="Base Price" value={basePrice} onChange={setBasePrice} prefix="$" />
                <InputGroup label="Discount" value={discount} onChange={setDiscount} suffix="%" />
                <InputGroup label="Tax" value={tax} onChange={setTax} suffix="%" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <ResultCard label="Discount Amount" value={`-$${discountAmount.toFixed(2)}`} />
                <ResultCard label="Tax Amount" value={`+$${taxAmount.toFixed(2)}`} />
                <ResultCard label="Final Price" value={`$${finalPrice.toFixed(2)}`} highlight />
            </div>
        </div>
    );
  };

  const renderEMI = () => {
    const p = parseFloat(loanAmount) || 0;
    const r = parseFloat(interestRate) || 0;
    const n = parseFloat(tenure) || 0;
    const { emi, totalInterest, totalPayment } = calculateEMI(p, r, n);
    const amortizationData = calculateAmortization(p, r, n);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="$" />
                <InputGroup label="Annual Rate" value={interestRate} onChange={setInterestRate} suffix="%" />
                <InputGroup label="Tenure (Years)" value={tenure} onChange={setTenure} suffix="yr" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <ResultCard label="Monthly EMI" value={`$${emi.toFixed(2)}`} highlight />
                <ResultCard label="Total Interest" value={`$${totalInterest.toFixed(2)}`} />
                <ResultCard label="Total Payment" value={`$${totalPayment.toFixed(2)}`} />
            </div>

            {/* Charts Section */}
            {p > 0 && n > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-surface p-4 rounded-2xl border border-border">
                         <h4 className="text-sm font-medium text-muted mb-4 ml-2">Total Breakup</h4>
                         <EmiPieChart principal={p} interest={totalInterest} />
                    </div>
                    <div className="bg-surface p-4 rounded-2xl border border-border">
                         <h4 className="text-sm font-medium text-muted mb-4 ml-2">Payment Schedule</h4>
                         <GrowthChart 
                            data={amortizationData} 
                            dataKeys={[
                                { key: 'interest', color: theme.colors.accent, name: 'Interest Paid' },
                                { key: 'principal', color: theme.colors.primary, name: 'Principal Paid' }
                            ]} 
                         />
                    </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 border-b border-border no-scrollbar">
        {Object.values(BusinessSubMode).map((mode) => (
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
        {subMode === BusinessSubMode.PRICING && renderPricing()}
        {subMode === BusinessSubMode.DISCOUNT_TAX && renderDiscountTax()}
        {subMode === BusinessSubMode.EMI && renderEMI()}
      </div>
    </div>
  );
};