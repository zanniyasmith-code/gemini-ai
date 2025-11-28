import { HistoryItem } from '../types';

/**
 * Safely evaluates a mathematical expression string.
 * Supports basic operators +, -, *, /, %, and parenthesis.
 */
export const evaluateExpression = (expression: string): string => {
  try {
    // Sanitize input: allow only numbers, operators, parens, dots
    // Note: This is a basic safeguard.
    const sanitized = expression.replace(/[^0-9+\-*/().%]/g, '');
    
    if (!sanitized) return '';

    // Handle Percentage: Replace number% with (number/100)
    // Regex logic: Find number immediately followed by %, replace with (number/100)
    const processed = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${processed}`)();

    if (!isFinite(result) || isNaN(result)) {
      return 'Error';
    }

    // Round to reasonable decimals to avoid floating point weirdness (e.g. 0.1 + 0.2)
    return String(Math.round(result * 100000000) / 100000000);
  } catch (error) {
    return 'Error';
  }
};

export const createHistoryItem = (expression: string, result: string): HistoryItem => ({
  id: Date.now().toString(),
  expression,
  result,
  timestamp: Date.now(),
});
