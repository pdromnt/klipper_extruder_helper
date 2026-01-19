<script setup lang="ts">
import { ref } from 'vue';
import RotationDistanceCalculator from './components/RotationDistanceCalculator.vue';
import EStepConverter from './components/EStepConverter.vue';
import StepDistanceConverter from './components/StepDistanceConverter.vue';

const activeTab = ref('calculator');

const tabs = [
  {
    id: 'calculator',
    name: 'Rotation Distance Calculator',
    description: 'Calibrate your extruder using the step-by-step wizard'
  },
  {
    id: 'steps',
    name: 'E-Steps Converter',
    description: 'Convert Marlin steps/mm to Klipper rotation_distance'
  },
  {
    id: 'distance',
    name: 'Step Distance Converter',
    description: 'Convert deprecated step_distance to rotation_distance'
  },
];
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Header -->
    <header class="navbar bg-base-100 shadow-md z-10">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">Klipper Extruder Helper</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><a href="https://www.klipper3d.org/Rotation_Distance.html" target="_blank">Klipper Docs</a></li>
          <li><a href="https://github.com/pdromnt/klipper_extruder_helper" target="_blank">GitHub</a></li>
        </ul>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto p-4">

      <div class="text-center mb-8 pt-4">
        <h1 class="text-4xl font-bold mb-2">Extruder Calibration Tools</h1>
        <p class="py-2">
          Note: This helper is <strong>only for extruder steppers</strong>.
          Do not use for X, Y, or Z axes.
        </p>
      </div>

      <!-- Tabs -->
      <div role="tablist"
        class="tabs tabs-boxed tabs-lg justify-center mb-12 max-w-4xl mx-auto bg-base-300 p-2 rounded-box">
        <a v-for="tab in tabs" :key="tab.id" role="tab" class="tab transition-all duration-200" :class="[
          activeTab === tab.id ? 'tab-active font-bold' : 'hover:bg-base-200/50',
          'tooltip tooltip-bottom'
        ]" :data-tip="tab.description" @click="activeTab = tab.id">
          {{ tab.name }}
        </a>
      </div>

      <!-- Component Rendering -->
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'calculator'" key="calculator">
          <RotationDistanceCalculator />
        </div>
        <div v-else-if="activeTab === 'steps'" key="steps">
          <EStepConverter />
        </div>
        <div v-else-if="activeTab === 'distance'" key="distance">
          <StepDistanceConverter />
        </div>
      </transition>
    </main>

    <!-- Footer -->
    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <aside>
        <p>Built with Vue 3, Tailwind 4 & DaisyUI 5</p>
      </aside>
    </footer>
  </div>
</template>
