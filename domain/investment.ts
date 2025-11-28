/**
 * Calculate Future Value of Lumpsum Investment (Compound Interest)
 * A = P(1 + r/n)^(nt)
 * Assuming annual compounding (n=1) for simplicity in standard view
 */
export const calculateLumpsum = (
  principal: number,
  annualRate: number,
  years: number
): { maturityValue: number; totalInterest: number } => {
  const maturityValue = principal * Math.pow(1 + annualRate / 100, years);
  const totalInterest = maturityValue - principal;
  return { maturityValue, totalInterest };
};

/**
 * Calculate Future Value of SIP (Monthly Investment)
 * FV = P * [ (1+i)^n - 1 ] / i * (1+i)
 * P: Monthly investment
 * i: Monthly rate
 * n: Total months
 */
export const calculateSIP = (
  monthlyInvestment: number,
  annualRate: number,
  years: number
): { maturityValue: number; investedAmount: number; totalGain: number } => {
  const i = annualRate / 12 / 100;
  const n = years * 12;

  if (i === 0) {
      const invested = monthlyInvestment * n;
      return { maturityValue: invested, investedAmount: invested, totalGain: 0 };
  }

  // Formula for SIP (payments made at the beginning of the period)
  const maturityValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const investedAmount = monthlyInvestment * n;
  const totalGain = maturityValue - investedAmount;

  return { maturityValue, investedAmount, totalGain };
};

/**
 * Calculate Required Monthly SIP for a Goal
 * P = FV / [ { (1+i)^n - 1 } / i * (1+i) ]
 */
export const calculateSIPGoal = (
  targetAmount: number,
  annualRate: number,
  years: number
): number => {
  const i = annualRate / 12 / 100;
  const n = years * 12;

  if (i === 0) return targetAmount / n;

  const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  return targetAmount / factor;
};

/**
 * Calculate Inflation Adjusted Amount
 * Future Cost = Current Cost * (1 + inflation/100)^years
 */
export const calculateInflationImpact = (
  amount: number,
  inflationRate: number,
  years: number
): number => {
  return amount * Math.pow(1 + inflationRate / 100, years);
};

// --- CHART DATA HELPERS ---

export const calculateSipYearlyGrowth = (
    monthlyInvestment: number,
    annualRate: number,
    years: number
): { year: number; invested: number; gain: number }[] => {
    const data = [];
    const monthlyRate = annualRate / 12 / 100;
    
    let currentCorpus = 0;
    let totalInvested = 0;

    for (let y = 1; y <= years; y++) {
        // Run simulation for 12 months
        for (let m = 0; m < 12; m++) {
            currentCorpus = (currentCorpus + monthlyInvestment) * (1 + monthlyRate);
            totalInvested += monthlyInvestment;
        }
        data.push({
            year: y,
            invested: Math.round(totalInvested),
            gain: Math.round(currentCorpus - totalInvested)
        });
    }
    return data;
};

export const calculateLumpsumYearlyGrowth = (
    principal: number,
    annualRate: number,
    years: number
): { year: number; principal: number; interest: number }[] => {
    const data = [];
    for (let y = 1; y <= years; y++) {
        const maturity = principal * Math.pow(1 + annualRate / 100, y);
        data.push({
            year: y,
            principal: Math.round(principal),
            interest: Math.round(maturity - principal)
        });
    }
    return data;
};