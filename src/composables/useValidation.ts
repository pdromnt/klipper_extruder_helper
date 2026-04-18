import type { ValidationResult } from './useStepperConfig';

export interface NumberInputValidation {
  value: number | null;
  rules: {
    min?: number;
    max?: number;
    required?: boolean;
    allowZero?: boolean;
  };
}

export function useValidation() {
  const validateNumber = (input: NumberInputValidation): ValidationResult => {
    const { value, rules } = input;

    if (rules.required && (value === null || value === undefined)) {
      return { isValid: false, errorMessage: 'This field is required' };
    }

    if (value === null || value === undefined) {
      return { isValid: true, errorMessage: null };
    }

    if (isNaN(value)) {
      return { isValid: false, errorMessage: 'Please enter a valid number' };
    }

    if (!rules.allowZero && value === 0) {
      return { isValid: false, errorMessage: 'Value cannot be zero' };
    }

    if (rules.min !== undefined && value < rules.min) {
      return { isValid: false, errorMessage: `Value must be at least ${rules.min}` };
    }

    if (rules.max !== undefined && value > rules.max) {
      return { isValid: false, errorMessage: `Value must be at most ${rules.max}` };
    }

    return { isValid: true, errorMessage: null };
  };

  return {
    validateNumber,
  };
}
