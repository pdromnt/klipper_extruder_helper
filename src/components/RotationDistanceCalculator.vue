<script setup lang="ts">
import { ref, computed } from 'vue';

const steps = ['Preparation', 'Extrusion', 'Measurement', 'Result'];
const currentStep = ref(0);

// Data
const initialMarkDistance = ref(70);
const requestedExtrudeDistance = ref(50);
const subsequentMarkDistance = ref<number | null>(null);
const previousRotationDistance = ref<number | null>(null);

// Computed
const actualExtrudeDistance = computed(() => {
  if (subsequentMarkDistance.value === null) return 0;
  return initialMarkDistance.value - subsequentMarkDistance.value;
});

const newRotationDistance = computed(() => {
  if (
    previousRotationDistance.value === null ||
    requestedExtrudeDistance.value === 0
  )
    return null;

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

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl max-w-4xl mx-auto">
    <div class="card-body">
      <h2 class="card-title text-2xl justify-center mb-6">Rotation Distance Calculator</h2>

      <!-- Stepper -->
      <ul class="steps w-full mb-8">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="{ 'step-primary': index <= currentStep }"
        >
          {{ step }}
        </li>
      </ul>

      <!-- Step Content -->
      <div class="min-h-[300px]">
        <!-- Step 0: Preparation -->
        <div v-if="currentStep === 0" class="space-y-4">
          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>LPT: Use calipers for precision. Mark your filament with a soluble marker to avoid clogs!</span>
          </div>

          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Distance to mark (mm)</span>
            </label>
            <input
              v-model="initialMarkDistance"
              type="number"
              placeholder="e.g. 70"
              class="input input-bordered w-full max-w-xs"
            />
            <label class="label">
              <span class="label-text-alt">Recommended: 70mm</span>
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Distance to extrude (mm)</span>
            </label>
            <input
              v-model="requestedExtrudeDistance"
              type="number"
              placeholder="e.g. 50"
              class="input input-bordered w-full max-w-xs"
            />
            <label class="label">
              <span class="label-text-alt">Recommended: 50mm</span>
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
            Note: G91 sets relative positioning. The second command extrudes {{ requestedExtrudeDistance }}mm at 60mm/min.
          </p>
        </div>

        <!-- Step 2: Measurement -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Remaining distance to mark (mm)</span>
            </label>
            <input
              v-model="subsequentMarkDistance"
              type="number"
              placeholder="e.g. 18.5"
              class="input input-bordered w-full max-w-xs"
            />
            <label class="label">
              <span class="label-text-alt">Measure the distance from the extruder entry to your mark.</span>
            </label>
          </div>

          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Actual Extruded Distance</div>
              <div class="stat-value">{{ actualExtrudeDistance.toFixed(2) }} mm</div>
              <div class="stat-desc">Initial ({{ initialMarkDistance }}) - Remaining ({{ subsequentMarkDistance || 0 }})</div>
            </div>
          </div>
        </div>

        <!-- Step 3: Result -->
        <div v-if="currentStep === 3" class="space-y-4">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Current rotation_distance in printer.cfg</span>
            </label>
            <input
              v-model="previousRotationDistance"
              type="number"
              placeholder="e.g. 32.567"
              class="input input-bordered w-full max-w-xs"
            />
          </div>

          <div v-if="newRotationDistance" class="alert alert-success mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <h3 class="font-bold">New Rotation Distance</h3>
              <div class="text-xl font-mono copy-content">{{ newRotationDistance }}</div>
            </div>
            <button class="btn btn-sm" @click="copyToClipboard(newRotationDistance || '')">Copy</button>
          </div>

          <div class="mt-4">
            <p>Formula: <span class="font-mono text-sm">({{ previousRotationDistance }} * {{ actualExtrudeDistance.toFixed(2) }}) / {{ requestedExtrudeDistance }}</span></p>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="card-actions justify-between mt-8">
        <button
          class="btn btn-neutral"
          @click="prevStep"
          :disabled="currentStep === 0"
        >
          Previous
        </button>
        <button
          class="btn btn-primary"
          @click="nextStep"
          v-if="currentStep < steps.length - 1"
        >
          Next
        </button>
        <button
          class="btn btn-success"
          disabled
          v-else
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>
