/**
 * Calculates Selling Price based on Cost and Margin %
 * Formula: Price = Cost / (1 - Margin%)
 */
export const calculatePriceFromMargin = (cost: number, marginPercent: number): number => {
  if (marginPercent >= 100) return 0; // Infinite price
  return cost / (1 - marginPercent / 100);
};

/**
 * Calculates Selling Price based on Cost and Markup %
 * Formula: Price = Cost * (1 + Markup%)
 */
export const calculatePriceFromMarkup = (cost: number, markupPercent: number): number => {
  return cost * (1 + markupPercent / 100);
};

/**
 * Calculates Final Price after Discount and Tax
 */
export const calculateFinalPrice = (
  basePrice: number,
  discountPercent: number,
  taxPercent: number
): { finalPrice: number; discountAmount: number; taxAmount: number } => {
  const discountAmount = basePrice * (discountPercent / 100);
  const priceAfterDiscount = basePrice - discountAmount;
  const taxAmount = priceAfterDiscount * (taxPercent / 100);
  const finalPrice = priceAfterDiscount + taxAmount;

  return { finalPrice, discountAmount, taxAmount };
};

/**
 * Calculates EMI (Equated Monthly Installment)
 * Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 * P: Principal loan amount
 * r: Monthly interest rate (Annual rate / 12 / 100)
 * n: Loan tenure in months
 */
export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureYears: number
): { emi: number; totalInterest: number; totalPayment: number } => {
  if (principal === 0 || tenureYears === 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }
  
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;

  let emi = 0;
  if (annualRate === 0) {
      emi = principal / n;
  } else {
      emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return { emi, totalInterest, totalPayment };
};

/**
 * Calculates yearly amortization schedule for charts
 */
export const calculateAmortization = (
    principal: number,
    annualRate: number,
    tenureYears: number
): { year: number; interest: number; principal: number; balance: number }[] => {
    if (principal === 0 || tenureYears === 0) return [];

    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;
    
    // Calculate EMI first
    let emi = 0;
    if (annualRate === 0) {
        emi = principal / months;
    } else {
        emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    let balance = principal;
    const yearlyData: { year: number; interest: number; principal: number; balance: number }[] = [];

    for (let y = 1; y <= tenureYears; y++) {
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;

        for (let m = 0; m < 12; m++) {
            if (balance <= 0) break;
            const interestComponent = balance * monthlyRate;
            const principalComponent = emi - interestComponent;
            
            yearlyInterest += interestComponent;
            yearlyPrincipal += principalComponent;
            balance -= principalComponent;
        }

        yearlyData.push({
            year: y,
            interest: Math.round(yearlyInterest),
            principal: Math.round(yearlyPrincipal),
            balance: Math.max(0, Math.round(balance))
        });
    }

    return yearlyData;
};