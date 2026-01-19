<script setup lang="ts">
import { ref, computed } from 'vue';

const stepperDegrees = ref(1.8);
const microsteps = ref(16);
const stepsPerMm = ref<number | null>(null);

const fullStepsPerRotation = computed(() => {
  if (stepperDegrees.value <= 0) return 0;
  return 360 / stepperDegrees.value;
});

const rotationDistance = computed(() => {
  if (!stepsPerMm.value || stepsPerMm.value === 0) return null;
  const result = (fullStepsPerRotation.value * microsteps.value) / stepsPerMm.value;
  return result.toFixed(3);
});

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl max-w-2xl mx-auto">
    <div class="card-body">
      <h2 class="card-title justify-center mb-4">E-Steps to Rotation Distance</h2>
      <p class="text-center mb-6">Convert your old steps_per_mm (Marlin) to Klipper's rotation_distance.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="form-control">
          <label class="label">
            <span class="label-text">Stepper Degrees</span>
          </label>
          <input v-model="stepperDegrees" type="number" placeholder="1.8" class="input input-bordered" />
          <label class="label">
            <span class="label-text-alt">Usually 1.8 or 0.9</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Microsteps</span>
          </label>
          <input v-model="microsteps" type="number" placeholder="16" class="input input-bordered" />
          <label class="label">
            <span class="label-text-alt">Usually 16 or 32</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Steps per mm (E-Steps)</span>
          </label>
          <input v-model="stepsPerMm" type="number" placeholder="e.g. 93" class="input input-bordered" />
          <label class="label">
            <span class="label-text-alt"><small>Grab this value from your Marlin config</small></span>
          </label>
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
            <button class="btn btn-xs btn-ghost" @click="copyToClipboard(rotationDistance || '')">Copy</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
