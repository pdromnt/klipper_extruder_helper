<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStepperConfig, useClipboard, useValidation } from '../composables';

const { stepperDegrees, microsteps, fullStepsPerRotation, presets, applyPreset } = useStepperConfig();
const { copied, copyToClipboard } = useClipboard();
const { validateNumber } = useValidation();

const stepDistance = ref<number | null>(null);

// Validation for step distance
const stepDistanceValidation = computed(() => {
  return validateNumber({
    value: stepDistance.value,
    rules: { required: true, min: 0.0001, allowZero: false }
  });
});

const isStepDistanceValid = computed(() => stepDistanceValidation.value.isValid);

const rotationDistance = computed(() => {
  if (!isStepDistanceValid.value || !stepDistance.value) return null;
  const result = fullStepsPerRotation.value * microsteps.value * stepDistance.value;
  return result.toFixed(3);
});

const handleCopy = async () => {
  if (rotationDistance.value) {
    await copyToClipboard(rotationDistance.value);
  }
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl max-w-2xl mx-auto">
    <div class="card-body">
      <h2 class="card-title justify-center mb-4">Step Distance to Rotation Distance</h2>
      <p class="text-center mb-6">Convert deprecated Klipper step_distance to rotation_distance.</p>

      <!-- Preset Buttons -->
      <div class="mb-6">
        <label class="label">
          <span class="label-text">Quick Presets</span>
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in presets"
            :key="preset.name"
            class="btn btn-xs btn-outline"
            @click="applyPreset(preset)"
            :class="{ 'btn-active': stepperDegrees === preset.degrees && microsteps === preset.microsteps }"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="form-control">
          <label class="label" for="stepdist-degrees">
            <span class="label-text">Stepper Degrees</span>
          </label>
          <input
            id="stepdist-degrees"
            v-model.number="stepperDegrees"
            type="number"
            placeholder="1.8"
            class="input input-bordered"
            :class="{ 'input-error': stepperDegrees <= 0 }"
            min="0.1"
            step="0.1"
          />
          <div class="text-sm text-base-content/70 mt-1">
            <span>Usually 1.8 or 0.9</span>
          </div>
          <div v-if="stepperDegrees <= 0" class="text-sm text-error mt-1">
            Must be greater than 0
          </div>
        </div>

        <div class="form-control">
          <label class="label" for="stepdist-microsteps">
            <span class="label-text">Microsteps</span>
          </label>
          <input
            id="stepdist-microsteps"
            v-model.number="microsteps"
            type="number"
            placeholder="16"
            class="input input-bordered"
            :class="{ 'input-error': microsteps < 1 }"
            min="1"
            step="1"
          />
          <div class="text-sm text-base-content/70 mt-1">
            <span>Usually 16 or 32</span>
          </div>
          <div v-if="microsteps < 1" class="text-sm text-error mt-1">
            Must be at least 1
          </div>
        </div>

        <div class="form-control md:col-span-2">
          <div class="mb-2">
            <label for="stepdist-value" class="text-sm font-medium">Step Distance</label>
          </div>
          <input
            id="stepdist-value"
            v-model.number="stepDistance"
            type="number"
            placeholder="e.g. 0.01075"
            class="input input-bordered w-full"
            :class="{ 'input-error': !isStepDistanceValid && stepDistance !== null }"
            min="0.0001"
            step="0.0001"
          />
          <div class="text-sm text-base-content/70 mt-1">
            <span>Your old step_distance value</span>
          </div>
          <div v-if="!isStepDistanceValid && stepDistance !== null" class="text-sm text-error mt-1">
            {{ stepDistanceValidation.errorMessage }}
          </div>
        </div>

      </div>

      <div class="divider">Results</div>

      <div class="stats stats-vertical md:stats-horizontal shadow w-full bg-base-200">

        <div class="stat">
          <div class="stat-title">Full Steps / Rotation</div>
          <div class="stat-value text-secondary">{{ fullStepsPerRotation }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Rotation Distance</div>
          <div class="stat-value text-primary">{{ rotationDistance || '---' }}</div>
          <div class="stat-desc" v-if="rotationDistance">
            <button
              class="btn btn-xs"
              :class="copied ? 'btn-success' : 'btn-ghost'"
              @click="handleCopy"
              :disabled="copied"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
