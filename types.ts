export enum AppMode {
  NORMAL = 'Normal',
  BUSINESS = 'Business',
  INVESTMENT = 'Investment',
}

export enum BusinessSubMode {
  PRICING = 'Pricing',
  DISCOUNT_TAX = 'Discount & Tax',
  EMI = 'EMI',
}

export enum InvestmentSubMode {
  LUMPSUM = 'Lumpsum',
  SIP_FV = 'SIP (Future Value)',
  SIP_GOAL = 'SIP (Goal)',
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ThemeName = 'normal' | 'business' | 'investment' | 'professional' | 'premiumGold' | 'neonTech';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
  display: string; // Background for calculator display
  danger: string;
}

export interface AppTheme {
  name: ThemeName;
  label: string;
  description: string;
  colors: ThemeColors;
  isDark: boolean;
}