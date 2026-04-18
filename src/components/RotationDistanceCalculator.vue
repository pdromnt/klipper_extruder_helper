<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClipboard, useValidation } from '../composables';

const { copied, copyToClipboard } = useClipboard();
const { validateNumber } = useValidation();

const steps = ['Preparation', 'Extrusion', 'Measurement', 'Result'];
const currentStep = ref(0);

// Data
const initialMarkDistance = ref(70);
const requestedExtrudeDistance = ref(50);
const subsequentMarkDistance = ref<number | null>(null);
const previousRotationDistance = ref<number | null>(null);

// Validation
const initialMarkValidation = computed(() =>
  validateNumber({ value: initialMarkDistance.value, rules: { required: true, min: 1, max: 500, allowZero: false } })
);

const requestedExtrudeValidation = computed(() =>
  validateNumber({ value: requestedExtrudeDistance.value, rules: { required: true, min: 1, max: 200, allowZero: false } })
);

const subsequentMarkValidation = computed(() =>
  validateNumber({ value: subsequentMarkDistance.value, rules: { required: true, min: 0, max: initialMarkDistance.value, allowZero: true } })
);

const previousRotationValidation = computed(() =>
  validateNumber({ value: previousRotationDistance.value, rules: { required: true, min: 0.001, allowZero: false } })
);

// Computed
const isStep0Valid = computed(() => initialMarkValidation.value.isValid && requestedExtrudeValidation.value.isValid);
const isStep2Valid = computed(() => subsequentMarkValidation.value.isValid);
const isStep3Valid = computed(() => previousRotationValidation.value.isValid);

const actualExtrudeDistance = computed(() => {
  if (subsequentMarkDistance.value === null) return 0;
  return initialMarkDistance.value - subsequentMarkDistance.value;
});

const newRotationDistance = computed(() => {
  if (!isStep3Valid.value || !previousRotationDistance.value || !requestedExtrudeDistance.value) {
    return null;
  }

  const actual = actualExtrudeDistance.value;
  const result = (previousRotationDistance.value * actual) / requestedExtrudeDistance.value;
  return result.toFixed(3);
});

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleCopy = async () => {
  if (newRotationDistance.value) {
    await copyToClipboard(newRotationDistance.value);
  }
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl max-w-4xl mx-auto">
    <div class="card-body">
      <h2 class="card-title text-2xl justify-center mb-6">Rotation Distance Calculator</h2>

      <!-- Stepper -->
      <ul class="steps w-full mb-8" aria-label="Calibration progress">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="{ 'step-primary': index <= currentStep }"
          :aria-current="index === currentStep ? 'step' : undefined"
        >
          {{ step }}
        </li>
      </ul>

      <!-- Step Content -->
      <div class="min-h-[300px]">
        <!-- Step 0: Preparation -->
        <div v-if="currentStep === 0" class="space-y-4">
          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="stroke-current shrink-0 w-6 h-6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>LPT: Use calipers for precision. Mark your filament with a soluble marker to avoid clogs!</span>
          </div>

          <div class="form-control w-full max-w-xs">
            <label class="label" for="initial-mark">
              <span class="label-text">Distance to mark (mm)</span>
            </label>
            <input
              id="initial-mark"
              v-model.number="initialMarkDistance"
              type="number"
              placeholder="e.g. 70"
              class="input input-bordered w-full max-w-xs"
              :class="{ 'input-error': !initialMarkValidation.isValid }"
              min="1"
              max="500"
            />
            <label class="label">
              <span class="label-text-alt">Recommended: 70mm</span>
              <span v-if="!initialMarkValidation.isValid" class="label-text-alt text-error">
                {{ initialMarkValidation.errorMessage }}
              </span>
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <label class="label" for="extrude-distance">
              <span class="label-text">Distance to extrude (mm)</span>
            </label>
            <input
              id="extrude-distance"
              v-model.number="requestedExtrudeDistance"
              type="number"
              placeholder="e.g. 50"
              class="input input-bordered w-full max-w-xs"
              :class="{ 'input-error': !requestedExtrudeValidation.isValid }"
              min="1"
              max="200"
            />
            <label class="label">
              <span class="label-text-alt">Recommended: 50mm</span>
              <span v-if="!requestedExtrudeValidation.isValid" class="label-text-alt text-error">
                {{ requestedExtrudeValidation.errorMessage }}
              </span>
            </label>
          </div>
        </div>

        <!-- Step 1: Extrusion -->
        <div v-if="currentStep === 1" class="space-y-4">
          <p class="text-lg">Follow these steps in your Klipper console (Fluidd/Mainsail):</p>

          <ol class="list-decimal list-inside space-y-2">
            <li><strong>Heat up your extruder</strong> to printing temperature (e.g., 215°C for PLA).</li>
            <li>Execute the following G-Code in order:</li>
          </ol>

          <div class="mockup-code">
            <pre data-prefix=">"><code>G91</code></pre>
            <pre data-prefix=">"><code>G1 E{{ requestedExtrudeDistance }} F60</code></pre>
          </div>

          <p class="text-sm text-gray-500">
            Note: G91 sets relative positioning. The second command extrudes {{ requestedExtrudeDistance }}mm at
            60mm/min.
          </p>
        </div>

        <!-- Step 2: Measurement -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="form-control w-full space-y-2">
            <label class="label" for="subsequent-mark">
              <span class="label-text">Remaining distance to mark (mm):</span>
            </label>
            <input
              id="subsequent-mark"
              v-model.number="subsequentMarkDistance"
              type="number"
              placeholder="e.g. 18.5"
              class="input input-bordered w-full max-w-xs"
              :class="{ 'input-error': !subsequentMarkValidation.isValid && subsequentMarkDistance !== null }"
              min="0"
              :max="initialMarkDistance"
              step="0.1"
            />
            <label class="label">
              <span class="label-text-alt">Measure the distance from the extruder entry to your mark.</span>
              <span v-if="!subsequentMarkValidation.isValid && subsequentMarkDistance !== null" class="label-text-alt text-error">
                {{ subsequentMarkValidation.errorMessage }}
              </span>
            </label>
          </div>

          <div class="stats shadow" v-if="subsequentMarkDistance !== null && isStep2Valid">
            <div class="stat">
              <div class="stat-title">Actual Extruded Distance</div>
              <div class="stat-value">{{ actualExtrudeDistance.toFixed(2) }} mm</div>
              <div class="stat-desc">Initial ({{ initialMarkDistance }}) - Remaining ({{ subsequentMarkDistance }})
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Result -->
        <div v-if="currentStep === 3" class="space-y-4">
          <div class="form-control w-full space-y-2">
            <label class="label" for="previous-rotation">
              <span class="label-text">Current rotation_distance in printer.cfg:</span>
            </label>
            <input
              id="previous-rotation"
              v-model.number="previousRotationDistance"
              type="number"
              placeholder="e.g. 32.567"
              class="input input-bordered w-full max-w-xs"
              :class="{ 'input-error': !previousRotationValidation.isValid && previousRotationDistance !== null }"
              min="0.001"
              step="0.001"
            />
            <label class="label">
              <span v-if="!previousRotationValidation.isValid && previousRotationDistance !== null" class="label-text-alt text-error">
                {{ previousRotationValidation.errorMessage }}
              </span>
            </label>
          </div>

          <div v-if="newRotationDistance" class="alert alert-success mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
              viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-bold">New Rotation Distance</h3>
              <div class="text-xl font-mono copy-content">{{ newRotationDistance }}</div>
            </div>
            <button
              class="btn btn-sm"
              :class="copied ? 'btn-success' : 'btn-outline'"
              @click="handleCopy"
              :disabled="copied"
              :aria-label="copied ? 'Copied to clipboard' : 'Copy to clipboard'"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <div class="mt-4" v-if="newRotationDistance">
            <p>Formula: <span class="font-mono text-sm">({{ previousRotationDistance }} * {{
              actualExtrudeDistance.toFixed(2) }}) / {{ requestedExtrudeDistance }}</span></p>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="card-actions justify-between mt-8">
        <button class="btn btn-neutral" @click="prevStep" :disabled="currentStep === 0">
          Previous
        </button>
        <button
          class="btn btn-primary"
          @click="nextStep"
          v-if="currentStep < steps.length - 1"
          :disabled="(currentStep === 0 && !isStep0Valid) || (currentStep === 2 && !isStep2Valid)"
        >
          Next
        </button>
        <button class="btn btn-success" disabled v-else>
          Done
        </button>
      </div>
    </div>
  </div>
</template>
