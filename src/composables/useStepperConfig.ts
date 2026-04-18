import { ref, computed } from 'vue';

export interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export function useStepperConfig() {
  const stepperDegrees = ref(1.8);
  const microsteps = ref(16);

  const fullStepsPerRotation = computed(() => {
    if (stepperDegrees.value <= 0) return 0;
    return 360 / stepperDegrees.value;
  });

  // Validation rules for stepper config
  const stepperValidation = computed<ValidationResult>(() => {
    if (stepperDegrees.value <= 0) {
      return { isValid: false, errorMessage: 'Stepper degrees must be greater than 0' };
    }
    if (![0.9, 1.8].includes(stepperDegrees.value)) {
      return { isValid: true, errorMessage: null }; // Allow non-standard but warn
    }
    if (microsteps.value < 1) {
      return { isValid: false, errorMessage: 'Microsteps must be at least 1' };
    }
    return { isValid: true, errorMessage: null };
  });

  // Common presets
  const presets = [
    { name: 'Standard 1.8° / 16x', degrees: 1.8, microsteps: 16 },
    { name: 'High-res 0.9° / 16x', degrees: 0.9, microsteps: 16 },
    { name: 'Standard 1.8° / 32x', degrees: 1.8, microsteps: 32 },
    { name: 'High-res 0.9° / 32x', degrees: 0.9, microsteps: 32 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    stepperDegrees.value = preset.degrees;
    microsteps.value = preset.microsteps;
  };

  return {
    stepperDegrees,
    microsteps,
    fullStepsPerRotation,
    stepperValidation,
    presets,
    applyPreset,
  };
}
