<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStepperConfig, useClipboard, useValidation } from '../composables';

const { stepperDegrees, microsteps, fullStepsPerRotation, presets, applyPreset } = useStepperConfig();
const { copied, copyToClipboard } = useClipboard();
const { validateNumber } = useValidation();

const stepsPerMm = ref<number | null>(null);

// Validation for steps per mm
const stepsPerMmValidation = computed(() => {
  return validateNumber({
    value: stepsPerMm.value,
    rules: { required: true, min: 0.001, allowZero: false }
  });
});

const isStepsPerMmValid = computed(() => stepsPerMmValidation.value.isValid);

const rotationDistance = computed(() => {
  if (!isStepsPerMmValid.value || !stepsPerMm.value) return null;
  const result = (fullStepsPerRotation.value * microsteps.value) / stepsPerMm.value;
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
      <h2 class="card-title justify-center mb-4">E-Steps to Rotation Distance</h2>
      <p class="text-center mb-6">Convert your old steps_per_mm (Marlin) to Klipper's rotation_distance.</p>

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
          <label class="label" for="estep-degrees">
            <span class="label-text">Stepper Degrees</span>
          </label>
          <input
            id="estep-degrees"
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
          <label class="label" for="estep-microsteps">
            <span class="label-text">Microsteps</span>
          </label>
          <input
            id="estep-microsteps"
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
            <label for="esteps-value" class="text-sm font-medium">Steps per mm (E-Steps)</label>
          </div>
          <input
            id="esteps-value"
            v-model.number="stepsPerMm"
            type="number"
            placeholder="e.g. 93"
            class="input input-bordered w-full"
            :class="{ 'input-error': !isStepsPerMmValid && stepsPerMm !== null }"
            min="0.001"
            step="0.001"
          />
          <div class="text-sm text-base-content/70 mt-1">
            <span>Grab this value from your Marlin config</span>
          </div>
          <div v-if="!isStepsPerMmValid && stepsPerMm !== null" class="text-sm text-error mt-1">
            {{ stepsPerMmValidation.errorMessage }}
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
